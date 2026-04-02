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

function getGoogleSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return google.sheets({ version: 'v4', auth });
}

async function ensureHeadersExist(sheets: ReturnType<typeof google.sheets>, spreadsheetId: string) {
  // Check if sheet exists
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
  }

  // Write headers to row 1 (only if sheet is new or headers missing)
  const headersRes = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${SHEET_NAME}!A1:G1`,
  });

  if (!headersRes.data.values || headersRes.data.values.length === 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${SHEET_NAME}!A1`,
      valueInputOption: 'RAW',
      requestBody: { values: [HEADERS] },
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { timestamp, fullName, age, phone, purpose, trainingType, location } = body;

    if (!fullName || !phone) {
      return NextResponse.json(
        { error: 'Thiếu thông tin bắt buộc: họ tên và số điện thoại' },
        { status: 400 }
      );
    }

    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
    if (!spreadsheetId) {
      return NextResponse.json(
        { error: 'Chưa cấu hình GOOGLE_SPREADSHEET_ID' },
        { status: 500 }
      );
    }

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

    return NextResponse.json({ success: true, message: 'Đăng ký thành công' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('submit-registration error:', message);
    return NextResponse.json(
      { error: 'Lỗi khi ghi dữ liệu', details: message },
      { status: 500 }
    );
  }
}
