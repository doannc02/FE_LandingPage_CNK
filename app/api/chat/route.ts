// app/api/chat/route.ts
//
// Streaming Proxy → .NET 8 Backend
// Dùng axios (cùng base URL với apiClient ở app/lib/api/client.ts)
//
// Env variables (.env.local):
//   NEXT_PUBLIC_API_URL=https://103.126.161.89/api
//   BACKEND_API_KEY=your-secret-key   (tuỳ chọn)
// ================================================================

import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import type { ChatRequest } from "@/app/components/Chat/types";
import type { IncomingMessage } from "http";

export const dynamic = "force-dynamic";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://103.126.161.89/api";

export async function POST(request: NextRequest) {
  // ── 1. Parse & validate ─────────────────────────────────────
  let body: ChatRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body không hợp lệ." }, { status: 400 });
  }

  if (!body.message || typeof body.message !== "string" || !body.message.trim()) {
    return NextResponse.json({ error: "Trường 'message' bị thiếu hoặc rỗng." }, { status: 400 });
  }

  // ── 2. Gọi backend bằng axios (responseType: stream) ────────
  let upstreamData: IncomingMessage;
  let contentType: string;

  try {
    const response = await axios.post(
      `${BACKEND_URL}/v1/chat/stream`,
      { message: body.message, history: body.history ?? [] },
      {
        responseType: "stream",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream, application/x-ndjson, */*",
          ...(process.env.BACKEND_API_KEY && {
            Authorization: `Bearer ${process.env.BACKEND_API_KEY}`,
          }),
        },
      }
    );

    upstreamData = response.data as IncomingMessage;
    contentType =
      (response.headers["content-type"] as string) ??
      "text/event-stream; charset=utf-8";
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status ?? 503;
      console.error(`[Chat Proxy] Backend ${status}:`, err.message);
      return NextResponse.json(
        { error: `Backend trả về lỗi ${status}.` },
        { status }
      );
    }
    console.error("[Chat Proxy] Không kết nối được backend:", err);
    return NextResponse.json(
      { error: "Không thể kết nối tới server AI. Vui lòng thử lại sau." },
      { status: 503 }
    );
  }

  // ── 3. Chuyển Node.js stream → Web ReadableStream rồi pipe về browser ──
  const webStream = new ReadableStream({
    start(controller) {
      upstreamData.on("data", (chunk: Buffer) => controller.enqueue(chunk));
      upstreamData.on("end", () => controller.close());
      upstreamData.on("error", (err) => controller.error(err));
    },
  });

  return new Response(webStream, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
