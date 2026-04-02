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

// ✅ Fix đơn giản, đúng
function parsePrivateKey(raw: string | undefined): string {
  if (!raw) return '';
  return raw
    .replace(/^["']+|["']+$/g, '') // strip quotes
    .replace(/\\n/g, '\n')          // literal \n → real newline
    .trim();
}

function validateEnvVars() {
  const required = [
    'GOOGLE_SERVICE_ACCOUNT_EMAIL',
    'GOOGLE_PRIVATE_KEY',
    'GOOGLE_SPREADSHEET_ID',
  ];
  const missing = required.filter((k) => !process.env[k]);
  return { valid: missing.length === 0, missing };
}

function getGoogleSheetsClient() {
  const parsedKey = parsePrivateKey(process.env.GOOGLE_PRIVATE_KEY);

  console.log('[Sheets] Key diagnostics:', {
    rawLength: process.env.GOOGLE_PRIVATE_KEY?.length ?? 0,
    parsedLength: parsedKey.length,
    startsCorrectly: parsedKey.startsWith('-----BEGIN PRIVATE KEY-----'),
    endsCorrectly: parsedKey.includes('-----END PRIVATE KEY-----'),
    hasRealNewlines: parsedKey.includes('\n'),
    newlineCount: (parsedKey.match(/\n/g) || []).length,
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
  const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
  const sheetExists = spreadsheet.data.sheets?.some(
    (s) => s.properties?.title === SHEET_NAME
  );

  if (!sheetExists) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [{ addSheet: { properties: { title: SHEET_NAME } } }],
      },
    });
    console.log(`[Sheets] Đã tạo sheet "${SHEET_NAME}"`);
  }

  const headersRes = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${SHEET_NAME}!A1:G1`,
  });

  const existingHeaders = headersRes.data.values?.[0] ?? [];
  const headersMatch =
    existingHeaders.length === HEADERS.length &&
    existingHeaders.every((h, i) => h === HEADERS[i]);

  if (!headersMatch) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${SHEET_NAME}!A1`,
      valueInputOption: 'RAW',
      requestBody: { values: [HEADERS] },
    });
    console.log('[Sheets] Headers đã được ghi.');
  }
}

export async function POST(request: NextRequest) {
  console.log('[submit-registration] ===== START =====');

  const { valid, missing } = validateEnvVars();
  if (!valid) {
    console.error('[submit-registration] ❌ Thiếu env vars:', missing);
    return NextResponse.json(
      { error: `Thiếu cấu hình: ${missing.join(', ')}` },
      { status: 500 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Body không hợp lệ' }, { status: 400 });
  }

  const { timestamp, fullName, age, phone, purpose, trainingType, location } =
    body as Record<string, string>;

  if (!fullName || !phone) {
    return NextResponse.json(
      { error: 'Thiếu họ tên hoặc số điện thoại' },
      { status: 400 }
    );
  }

  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID!;

  try {
    const sheets = getGoogleSheetsClient();
    await ensureHeadersExist(sheets, spreadsheetId);

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${SHEET_NAME}!A1`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [[timestamp, fullName, age, phone, purpose, trainingType, location]],
      },
    });

    console.log('[submit-registration] ✅ Ghi thành công:', { fullName, phone });
    return NextResponse.json({ success: true, message: 'Đăng ký thành công' });

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('[submit-registration] ❌ Error:', msg);

    if (msg.includes('DECODER') || msg.includes('unsupported')) {
      return NextResponse.json(
        { error: 'Private key sai format', details: msg },
        { status: 500 }
      );
    }
    if (msg.includes('403') || msg.includes('PERMISSION_DENIED')) {
      return NextResponse.json(
        {
          error: 'Chưa cấp quyền cho service account',
          hint: `Share sheet với: ${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL}`,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Lỗi khi ghi dữ liệu', details: msg },
      { status: 500 }
    );
  }
}
