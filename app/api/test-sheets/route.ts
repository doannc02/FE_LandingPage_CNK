import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET() {
  const rawKey = process.env.GOOGLE_PRIVATE_KEY ?? '';
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ?? '';
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID ?? '';

  // Diagnose the key format without exposing its value
  const keyDiagnostics = {
    exists: rawKey.length > 0,
    length: rawKey.length,
    startsWithQuote: rawKey.startsWith('"') || rawKey.startsWith("'"),
    hasLiteralBackslashN: rawKey.includes('\\n'),
    hasRealNewline: rawKey.includes('\n'),
    startsWithBegin: rawKey.replace(/^["']/, '').startsWith('-----BEGIN'),
    endsWithEnd: rawKey.replace(/["']$/, '').endsWith('-----END PRIVATE KEY-----\n') ||
                 rawKey.replace(/["']$/, '').endsWith('-----END PRIVATE KEY-----'),
  };

  // Parse the key
  const parsedKey = rawKey
    .replace(/^["']|["']$/g, '')
    .replace(/\\n/g, '\n');

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: email,
        private_key: parsedKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Try to read spreadsheet metadata
    const res = await sheets.spreadsheets.get({ spreadsheetId });
    const sheetTitles = res.data.sheets?.map((s) => s.properties?.title) ?? [];

    return NextResponse.json({
      status: 'OK',
      spreadsheetTitle: res.data.properties?.title,
      sheets: sheetTitles,
      keyDiagnostics,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({
      status: 'ERROR',
      error: message,
      keyDiagnostics,
      hints: {
        decoderError: message.includes('DECODER') ? 'Private key format sai — xem keyDiagnostics' : null,
        notFound: message.includes('404') ? 'GOOGLE_SPREADSHEET_ID không đúng' : null,
        permission: message.includes('403') ? 'Service account chưa được share quyền Editor vào Sheet' : null,
      },
    }, { status: 500 });
  }
}
