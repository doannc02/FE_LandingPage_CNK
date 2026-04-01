// ============================================================
// Types — Bubble Chat Support
// ============================================================

export type MessageRole = "user" | "assistant" | "system";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

// ─── API ──────────────────────────────────────────────────────

export interface ChatHistoryItem {
  role: "user" | "assistant";
  content: string;
}

export interface ChatMessageRequest {
  sessionId: string;
  userMessage: string;
  history: ChatHistoryItem[];
  userId?: string | null;
}

export type ChatResponseType = "AI" | "HumanOnline" | "LeftMessage";

export interface ChatMessageResponse {
  type: ChatResponseType;
  answer?: string | null;
  chatRoomId?: string | null;
  pendingMessageId?: string | null;
}

/** Legacy — streaming proxy (app/api/chat/route.ts) */
export interface ChatRequest {
  message: string;
  history: ChatHistoryItem[];
}

/** Phản hồi lỗi */
export interface ChatErrorResponse {
  error: string;
}

// ─── Firebase ────────────────────────────────────────────────

export interface FirebaseChatMessage {
  sender: string; // "user" | "admin:{adminId}"
  text: string;
  timestamp: number;
  read: boolean;
}

export interface FirebaseNotification {
  reply: string;
  adminId: string;
  repliedAt: number;
  read: boolean;
}
