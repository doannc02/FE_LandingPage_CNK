// ============================================================
// Types — Bubble Chat Support (Streaming version)
// ============================================================

export type MessageRole = "user" | "assistant";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  /** true trong khi đang nhận stream từ backend */
  isStreaming?: boolean;
  timestamp: Date;
}

// ─── API ──────────────────────────────────────────────────────

export interface ChatHistoryItem {
  role: MessageRole;
  content: string;
}

/** Body gửi lên /api/chat (Next.js proxy) */
export interface ChatRequest {
  message: string;
  history: ChatHistoryItem[];
}

/** Phản hồi lỗi khi upstream không trả về stream */
export interface ChatErrorResponse {
  error: string;
}
