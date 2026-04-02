// app/api/submit-registration/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

const SHEET_NAME = 'Đăng Ký Học';
const HEADERS = [
  'Thời gian',
  'Họ và tên',
  'Tuổi',
  'Số điện thoại',
  'Mục đích',
  'Hình thức',
  'Cơ sở',
];

// ✅ Fix: handle nhiều edge case của Vercel env
function parsePrivateKey(raw: string | undefined): string {
  if (!raw) return '';

  let key = raw;

  // Strip surrounding quotes (single hoặc double, kể cả lồng nhau)
  key = key.replace(/^["']+|["']+$/g, '');

  // Convert literal \n → real newline
  key = key.replace(/\\n/g, '\n');

  // Đảm bảo có newline sau header và trước footer
  key = key
    .replace('-----BEGIN PRIVATE KEY-----', '-----BEGIN PRIVATE KEY-----\n')
    .replace('-----END PRIVATE KEY-----', '\n-----END PRIVATE KEY-----\n');

  // Xóa duplicate newlines
  key = key.replace(/\n{3,}/g, '\n\n');

  return key;
}

// ✅ Validate env vars trước khi dùng
function validateEnvVars(): { valid: boolean; missing: string[] } {
  const required = [
    'GOOGLE_SERVICE_ACCOUNT_EMAIL',
    'GOOGLE_PRIVATE_KEY',
    'GOOGLE_SPREADSHEET_ID',
  ];
  const missing = required.filter((key) => !process.env[key]);
  return { valid: missing.length === 0, missing };
}

function getGoogleSheetsClient() {
  const parsedKey = parsePrivateKey(process.env.GOOGLE_PRIVATE_KEY);

  // ✅ Log diagnostics (không expose key value)
  console.log('[Sheets] Key diagnostics:', {
    rawLength: process.env.GOOGLE_PRIVATE_KEY?.length ?? 0,
    parsedLength: parsedKey.length,
    startsCorrectly: parsedKey.startsWith('-----BEGIN PRIVATE KEY-----'),
    endsCorrectly: parsedKey.includes('-----END PRIVATE KEY-----'),
    hasRealNewlines: parsedKey.includes('\n'),
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
  });

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: parsedKey,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
}

async function ensureHeadersExist(
  sheets: ReturnType<typeof google.sheets>,
  spreadsheetId: string
) {
  // Check sheet tồn tại chưa
  const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
  const sheetExists = spreadsheet.data.sheets?.some(
    (s) => s.properties?.title === SHEET_NAME
  );

  if (!sheetExists) {
    console.log(`[Sheets] Sheet "${SHEET_NAME}" chưa tồn tại, đang tạo...`);
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [{ addSheet: { properties: { title: SHEET_NAME } } }],
      },
    });
    console.log(`[Sheets] Đã tạo sheet "${SHEET_NAME}"`);
  }

  // ✅ Fix: chỉ ghi header nếu row 1 thực sự trống
  const headersRes = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${SHEET_NAME}!A1:G1`,
  });

  const existingHeaders = headersRes.data.values?.[0] ?? [];
  const headersMatch =
    existingHeaders.length === HEADERS.length &&
    existingHeaders.every((h, i) => h === HEADERS[i]);

  if (!headersMatch) {
    console.log('[Sheets] Ghi headers vào row 1...');
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${SHEET_NAME}!A1`,
      valueInputOption: 'RAW',
      requestBody: { values: [HEADERS] },
    });
    console.log('[Sheets] Headers đã được ghi.');
  } else {
    console.log('[Sheets] Headers đã tồn tại, bỏ qua.');
  }
}

export async function POST(request: NextRequest) {
  console.log('[submit-registration] ===== START =====');

  // ✅ Step 1: Validate env vars
  const { valid, missing } = validateEnvVars();
  if (!valid) {
    console.error('[submit-registration] ❌ Thiếu env vars:', missing);
    return NextResponse.json(
      { error: `Thiếu cấu hình môi trường: ${missing.join(', ')}` },
      { status: 500 }
    );
  }
  console.log('[submit-registration] ✅ Env vars OK');

  // ✅ Step 2: Parse request body
  let body: Record<string, unknown>;
  try {
    body = await request.json();
    console.log('[submit-registration] ✅ Body parsed:', {
      hasTimestamp: !!body.timestamp,
      hasFullName: !!body.fullName,
      hasPhone: !!body.phone,
      hasAge: !!body.age,
      hasPurpose: !!body.purpose,
      hasTrainingType: !!body.trainingType,
      hasLocation: !!body.location,
    });
  } catch (parseError) {
    console.error('[submit-registration] ❌ Lỗi parse body:', parseError);
    return NextResponse.json(
      { error: 'Request body không hợp lệ' },
      { status: 400 }
    );
  }

  const { timestamp, fullName, age, phone, purpose, trainingType, location } = body as {
    timestamp: string;
    fullName: string;
    age: string;
    phone: string;
    purpose: string;
    trainingType: string;
    location: string;
  };

  // ✅ Step 3: Validate required fields
  if (!fullName || !phone) {
    console.error('[submit-registration] ❌ Thiếu fullName hoặc phone');
    return NextResponse.json(
      { error: 'Thiếu thông tin bắt buộc: họ tên và số điện thoại' },
      { status: 400 }
    );
  }

  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID!;

  // ✅ Step 4: Init Google Sheets client
  let sheets: ReturnType<typeof google.sheets>;
  try {
    sheets = getGoogleSheetsClient();
    console.log('[submit-registration] ✅ Google Sheets client khởi tạo OK');
  } catch (initError) {
    console.error('[submit-registration] ❌ Lỗi khởi tạo Google Sheets client:', initError);
    return NextResponse.json(
      {
        error: 'Lỗi khởi tạo Google Sheets client',
        details: initError instanceof Error ? initError.message : String(initError),
      },
      { status: 500 }
    );
  }

  // ✅ Step 5: Ensure headers
  try {
    await ensureHeadersExist(sheets, spreadsheetId);
    console.log('[submit-registration] ✅ ensureHeadersExist OK');
  } catch (headerError: unknown) {
    const msg = headerError instanceof Error ? headerError.message : String(headerError);
    console.error('[submit-registration] ❌ Lỗi ensureHeadersExist:', msg);

    // ✅ Phân loại lỗi cụ thể
    if (msg.includes('DECODER') || msg.includes('PEM') || msg.includes('asn1')) {
      return NextResponse.json(
        {
          error: 'GOOGLE_PRIVATE_KEY sai format. Kiểm tra lại biến môi trường.',
          details: msg,
          hint: 'Thêm .replace(/\\\\n/g, "\\n") khi parse key',
        },
        { status: 500 }
      );
    }

    if (msg.includes('403') || msg.includes('PERMISSION_DENIED')) {
      return NextResponse.json(
        {
          error: 'Service account chưa được cấp quyền vào Spreadsheet.',
          details: msg,
          hint: `Share spreadsheet với: ${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL}`,
        },
        { status: 500 }
      );
    }

    if (msg.includes('404') || msg.includes('not found')) {
      return NextResponse.json(
        {
          error: 'GOOGLE_SPREADSHEET_ID không tồn tại hoặc không truy cập được.',
          details: msg,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Lỗi khi kiểm tra sheet', details: msg },
      { status: 500 }
    );
  }

  // ✅ Step 6: Append data
  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${SHEET_NAME}!A1`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [[timestamp, fullName, age, phone, purpose, trainingType, location]],
      },
    });

    console.log('[submit-registration] ✅ Ghi dữ liệu thành công:', {
      fullName,
      phone,
      timestamp,
    });
    console.log('[submit-registration] ===== END OK =====');

    return NextResponse.json({ success: true, message: 'Đăng ký thành công' });
  } catch (appendError: unknown) {
    const msg = appendError instanceof Error ? appendError.message : String(appendError);
    console.error('[submit-registration] ❌ Lỗi append data:', msg);
    console.log('[submit-registration] ===== END ERROR =====');

    return NextResponse.json(
      { error: 'Lỗi khi ghi dữ liệu', details: msg },
      { status: 500 }
    );
  }
}
