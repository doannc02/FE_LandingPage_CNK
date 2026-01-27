/**
 * GOOGLE APPS SCRIPT CODE
 * Đây là code để paste vào Google Apps Script (Extensions > Apps Script)
 *
 * HƯỚNG DẪN CÀI ĐẶT:
 *
 * 1. Tạo Google Spreadsheet mới (hoặc dùng spreadsheet có sẵn)
 * 2. Vào Extensions > Apps Script
 * 3. Xóa code mặc định và paste code này vào
 * 4. Sửa SHEET_NAME nếu cần (mặc định là "Registrations")
 * 5. Click Deploy > New deployment
 * 6. Chọn "Web app"
 * 7. Execute as: Me
 * 8. Who has access: Anyone
 * 9. Click "Deploy" và copy URL
 * 10. Paste URL vào file .env.local:
 *     NEXT_PUBLIC_GOOGLE_SHEETS_URL=https://script.google.com/macros/s/YOUR_ID/exec
 */

// Tên sheet để lưu data (tự động tạo nếu chưa có)
const SHEET_NAME = "Registrations";

/**
 * Hàm nhận POST request từ website
 */
function doPost(e) {
  try {
    // Parse JSON data
    const data = JSON.parse(e.postData.contents);

    // Lấy hoặc tạo sheet
    const sheet = getOrCreateSheet();

    // Thêm data vào sheet
    sheet.appendRow([
      data.timestamp || new Date().toLocaleString("vi-VN"),
      data.fullName || "",
      data.age || "",
      data.phone || "",
      data.email || "",
      data.purpose || "",
      data.trainingType || "",
      data.location || "",
      data.message || "",
    ]);

    // Return success
    return ContentService.createTextOutput(
      JSON.stringify({ success: true })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    // Return error
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: error.toString(),
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Hàm nhận GET request (để test)
 */
function doGet(e) {
  return ContentService.createTextOutput(
    "Google Sheets API is working! Use POST method to submit data."
  ).setMimeType(ContentService.MimeType.TEXT);
}

/**
 * Lấy hoặc tạo sheet mới
 */
function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  // Nếu sheet chưa tồn tại, tạo mới và thêm header
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);

    // Thêm header row
    const headers = [
      "Thời gian",
      "Họ và tên",
      "Tuổi",
      "Số điện thoại",
      "Email",
      "Mục đích học",
      "Hình thức",
      "Cơ sở",
      "Lời nhắn",
    ];

    sheet.appendRow(headers);

    // Format header
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground("#D32F2F");
    headerRange.setFontColor("#FFFFFF");
    headerRange.setFontWeight("bold");
    headerRange.setHorizontalAlignment("center");

    // Auto-resize columns
    for (let i = 1; i <= headers.length; i++) {
      sheet.autoResizeColumn(i);
    }

    // Freeze header row
    sheet.setFrozenRows(1);
  }

  return sheet;
}

/**
 * HÀM BỔ SUNG: Gửi email thông báo khi có đăng ký mới
 * (Optional - bỏ comment để kích hoạt)
 */
/*
function sendEmailNotification(data) {
  const emailAddress = 'your-email@gmail.com'; // Thay bằng email của bạn
  const subject = '🥋 Đăng ký mới từ website Côn Nhị Khúc Hà Đông';
  
  const body = `
Có học viên mới đăng ký!

📝 THÔNG TIN:
- Họ và tên: ${data.fullName}
- Tuổi: ${data.age}
- Số điện thoại: ${data.phone}
- Email: ${data.email}
- Mục đích: ${data.purpose}
- Hình thức: ${data.trainingType}
- Cơ sở: ${data.location}
- Lời nhắn: ${data.message}
- Thời gian: ${data.timestamp}

Vui lòng liên hệ học viên sớm nhất!
  `;
  
  MailApp.sendEmail(emailAddress, subject, body);
}
*/

/**
 * HÀM TEST: Tạo data mẫu để test
 */
function testAddSampleData() {
  const sampleData = {
    timestamp: new Date().toLocaleString("vi-VN"),
    fullName: "Nguyễn Văn A",
    age: "25",
    phone: "0123456789",
    email: "test@example.com",
    purpose: "Tăng cường sức khỏe và tự vệ",
    trainingType: "Trực tiếp",
    location: "Cơ sở 1: Trường TH Văn Yên - Hà Đông (MIỄN PHÍ)",
    message: "Tôi muốn tìm hiểu thêm về khóa học",
  };

  const sheet = getOrCreateSheet();
  sheet.appendRow([
    sampleData.timestamp,
    sampleData.fullName,
    sampleData.age,
    sampleData.phone,
    sampleData.email,
    sampleData.purpose,
    sampleData.trainingType,
    sampleData.location,
    sampleData.message,
  ]);

  Logger.log("✅ Sample data added successfully!");
}
