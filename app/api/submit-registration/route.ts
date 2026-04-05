// app/api/submit-registration/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

const SHEET_NAME = 'Đăng Ký Học';
const HEADERS = [
  'Thời gian',
  'Họ và tên',
  'Tuổi',
  'Số điện thoại',
  'Mục đích tham gia',
  'Hình thức',
  'Cơ sở',
];

// Column widths (pixels)
const COLUMN_WIDTHS = [160, 280, 80, 160, 250, 120, 290];

function parsePrivateKey(raw: string | undefined): string {
  if (!raw) return '';
  return raw
    .replace(/^["']+|["']+$/g, '')
    .replace(/\\n/g, '\n')
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

async function getSheetId(
  sheets: ReturnType<typeof google.sheets>,
  spreadsheetId: string
): Promise<number | undefined> {
  const res = await sheets.spreadsheets.get({ spreadsheetId });
  return (
    res.data.sheets?.find((s) => s.properties?.title === SHEET_NAME)
      ?.properties?.sheetId ?? undefined
  );
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

async function formatSheet(
  sheets: ReturnType<typeof google.sheets>,
  spreadsheetId: string
) {
  const sheetId = await getSheetId(sheets, spreadsheetId);
  if (sheetId === undefined) {
    console.warn('[Sheets] ⚠️ Không tìm thấy sheetId để format');
    return;
  }

  const requests: object[] = [];

  // 1. Header style: nền xanh, chữ trắng bold, căn giữa
  requests.push({
    repeatCell: {
      range: {
        sheetId,
        startRowIndex: 0,
        endRowIndex: 1,
        startColumnIndex: 0,
        endColumnIndex: HEADERS.length,
      },
      cell: {
        userEnteredFormat: {
          backgroundColor: { red: 0.26, green: 0.52, blue: 0.96 },
          textFormat: {
            bold: true,
            foregroundColor: { red: 1, green: 1, blue: 1 },
            fontSize: 11,
          },
          horizontalAlignment: 'CENTER',
          verticalAlignment: 'MIDDLE',
          wrapStrategy: 'CLIP',
        },
      },
      fields:
        'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment,wrapStrategy)',
    },
  });

  // 2. Freeze row 1
  requests.push({
    updateSheetProperties: {
      properties: {
        sheetId,
        gridProperties: { frozenRowCount: 1 },
      },
      fields: 'gridProperties.frozenRowCount',
    },
  });

  // 3. Column widths
  COLUMN_WIDTHS.forEach((pixelSize, index) => {
    requests.push({
      updateDimensionProperties: {
        range: {
          sheetId,
          dimension: 'COLUMNS',
          startIndex: index,
          endIndex: index + 1,
        },
        properties: { pixelSize },
        fields: 'pixelSize',
      },
    });
  });

  // 4. Border toàn bộ vùng A1:G500
  requests.push({
    updateBorders: {
      range: {
        sheetId,
        startRowIndex: 0,
        endRowIndex: 500,
        startColumnIndex: 0,
        endColumnIndex: HEADERS.length,
      },
      top:    { style: 'SOLID', width: 1, color: { red: 0.8, green: 0.8, blue: 0.8 } },
      bottom: { style: 'SOLID', width: 1, color: { red: 0.8, green: 0.8, blue: 0.8 } },
      left:   { style: 'SOLID', width: 1, color: { red: 0.8, green: 0.8, blue: 0.8 } },
      right:  { style: 'SOLID', width: 1, color: { red: 0.8, green: 0.8, blue: 0.8 } },
      innerHorizontal: { style: 'SOLID', width: 1, color: { red: 0.8, green: 0.8, blue: 0.8 } },
      innerVertical:   { style: 'SOLID', width: 1, color: { red: 0.8, green: 0.8, blue: 0.8 } },
    },
  });

  // 5. Header row height = 40px
  requests.push({
    updateDimensionProperties: {
      range: {
        sheetId,
        dimension: 'ROWS',
        startIndex: 0,
        endIndex: 1,
      },
      properties: { pixelSize: 40 },
      fields: 'pixelSize',
    },
  });

  // ✅ 6. Set cột "Số điện thoại" (index 3) = TEXT format
  requests.push({
    repeatCell: {
      range: {
        sheetId,
        startRowIndex: 1,
        startColumnIndex: 3,
        endColumnIndex: 4,
      },
      cell: {
        userEnteredFormat: {
          numberFormat: { type: 'TEXT' },
        },
      },
      fields: 'userEnteredFormat.numberFormat',
    },
  });

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: { requests },
  });

  console.log('[Sheets] ✅ Format sheet OK');
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

    // Step 1: Ensure headers
    await ensureHeadersExist(sheets, spreadsheetId);

    // Step 2: Append data — phone dùng `'${phone}` để giữ số 0 đầu
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${SHEET_NAME}!A1`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [[
          timestamp,
          fullName,
          age,
          `'${phone}`,   // ✅ giữ số 0 đầu
          purpose,
          trainingType,
          location,
        ]],
      },
    });

    console.log('[submit-registration] ✅ Ghi thành công:', { fullName, phone });

    // Step 3: Format sheet (non-critical)
    try {
      await formatSheet(sheets, spreadsheetId);
    } catch (fmtErr) {
      console.warn('[Sheets] ⚠️ Format failed (non-critical):', fmtErr);
    }

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
