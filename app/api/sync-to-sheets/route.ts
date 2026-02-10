// app/api/sync-to-sheets/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

// Initialize Google Sheets API
const getGoogleSheetsClient = () => {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
};

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;

// Helper functions
function formatDate(dateString: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getLocationName(locationId: string) {
  const locations: Record<string, string> = {
    'van-yen': 'Văn Yên - Hà Đông',
    'kien-hung': 'Kiến Hưng - Hà Đông',
    'thong-nhat': 'CV Thống Nhất',
    'hoa-binh': 'CV Hòa Bình',
    'kim-giang': 'Kim Giang',
  };
  return locations[locationId] || locationId;
}

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    pending: 'Chờ xử lý',
    contacted: 'Đã liên hệ',
    enrolled: 'Đã ghi danh',
    rejected: 'Từ chối',
  };
  return labels[status] || status;
}

function getTrainingTypeLabel(type: string) {
  return type === 'offline' ? 'Trực tiếp' : 'Online';
}

// Ensure sheet exists with headers
async function ensureSheetExists(sheets: any, sheetName: string, headers: string[]) {
  try {
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });

    const sheetExists = spreadsheet.data.sheets.some(
      (sheet: any) => sheet.properties.title === sheetName
    );

    if (!sheetExists) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: [{
            addSheet: {
              properties: { title: sheetName },
            },
          }],
        },
      });
    }

    // Write headers
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A1`,
      valueInputOption: 'RAW',
      requestBody: { values: [headers] },
    });

    return true;
  } catch (error) {
    console.error(`Error ensuring sheet ${sheetName}:`, error);
    throw error;
  }
}

// Clear sheet data (keep headers)
async function clearSheetData(sheets: any, sheetName: string) {
  try {
    await sheets.spreadsheets.values.clear({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A2:Z`,
    });
  } catch (error) {
    console.error(`Error clearing sheet ${sheetName}:`, error);
  }
}

// Append rows to sheet
async function appendToSheet(sheets: any, sheetName: string, rows: any[][]) {
  try {
    if (!rows || rows.length === 0) return;

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A2`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: rows },
    });

    return rows.length;
  } catch (error) {
    console.error(`Error appending to sheet ${sheetName}:`, error);
    throw error;
  }
}

// =======================================================
// API ROUTE HANDLER
// =======================================================

export async function POST(request: NextRequest) {
  try {
    const { data, type } = await request.json();

    if (!data || !type) {
      return NextResponse.json(
        { error: 'Missing data or type parameter' },
        { status: 400 }
      );
    }

    const sheets = getGoogleSheetsClient();

    let sheetName = '';
    let headers: string[] = [];
    let rows: any[][] = [];

    // Prepare data based on type
    if (type === 'contact') {
      sheetName = 'Contact Submissions';
      headers = [
        'Ngày đăng ký',
        'Họ tên',
        'Tuổi',
        'SĐT',
        'Email',
        'Mục đích',
        'Hình thức',
        'Cơ sở',
        'Tin nhắn',
        'Trạng thái',
        'Ghi chú',
        'Cập nhật',
      ];

      rows = data.map((item: any) => [
        formatDate(item.created_at || item.createdAt),
        item.full_name || item.fullName,
        item.age,
        item.phone,
        item.email || '',
        item.purpose,
        getTrainingTypeLabel(item.training_type || item.trainingType),
        getLocationName(item.location),
        item.message || '',
        getStatusLabel(item.status),
        item.notes || '',
        formatDate(item.updated_at || item.updatedAt),
      ]);
    } else if (type === 'registration') {
      sheetName = 'Registration Submissions';
      headers = [
        'Ngày đăng ký',
        'Họ tên',
        'Tuổi',
        'SĐT',
        'Mục đích',
        'Hình thức',
        'Cơ sở',
        'Trạng thái',
        'Ghi chú',
        'Cập nhật',
      ];

      rows = data.map((item: any) => [
        formatDate(item.created_at || item.createdAt),
        item.full_name || item.fullName,
        item.age,
        item.phone,
        item.purpose,
        getTrainingTypeLabel(item.training_type || item.trainingType),
        getLocationName(item.location),
        getStatusLabel(item.status),
        item.notes || '',
        formatDate(item.updated_at || item.updatedAt),
      ]);
    } else if (type === 'stats') {
      sheetName = 'Statistics';
      headers = ['Chỉ số', 'Giá trị', 'Cập nhật'];

      const now = formatDate(new Date().toISOString());
      rows = [
        ['Tổng đăng ký', data.total || 0, now],
        ['Chờ xử lý', data.pending || 0, now],
        ['Đã liên hệ', data.contacted || 0, now],
        ['Đã ghi danh', data.enrolled || 0, now],
        ['Từ chối', data.rejected || 0, now],
      ];
    } else {
      return NextResponse.json(
        { error: 'Invalid type. Use: contact, registration, or stats' },
        { status: 400 }
      );
    }

    // Ensure sheet exists
    await ensureSheetExists(sheets, sheetName, headers);

    // Clear existing data
    await clearSheetData(sheets, sheetName);

    // Append new data
    const count = await appendToSheet(sheets, sheetName, rows);

    return NextResponse.json({
      success: true,
      message: `Đồng bộ thành công ${count} dòng vào ${sheetName}`,
      count,
      sheetName,
    });

  } catch (error: any) {
    console.error('Sync error:', error);
    return NextResponse.json(
      { error: 'Lỗi khi đồng bộ dữ liệu', details: error.message },
      { status: 500 }
    );
  }
}

// GET endpoint to check status
export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'ready',
    spreadsheetId: SPREADSHEET_ID,
    message: 'Google Sheets sync service is ready',
  });
}