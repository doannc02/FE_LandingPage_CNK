import { apiClient, type ApiResponse } from "./client";
import type { ChatMessageRequest, ChatMessageResponse } from "@/app/components/Chat/types";

// ─── History types ────────────────────────────────────────────

export interface ChatHistoryMessage {
  id: string;
  role: "User" | "Bot" | "Admin";
  content: string;
  senderAdminId: string | null;
  createdAt: string;
}

export interface ChatHistoryResponse {
  sessionId: string;
  status: "BotHandling" | "HumanHandoff" | "Closed" | "None";
  handoffType: null | "Firebase" | "Pending";
  firebaseChatRoomId: null | string;
  pendingMessageId: null | string;
  messages: ChatHistoryMessage[];
}

// ─── API ──────────────────────────────────────────────────────

export const chatApi = {
  sendMessage: (data: ChatMessageRequest) =>
    apiClient.post<ApiResponse<ChatMessageResponse>>("/v1/chat/message", data),

  getHistory: (sessionId: string) =>
    apiClient.get<ApiResponse<ChatHistoryResponse>>(
      `/v1/chat/history?sessionId=${encodeURIComponent(sessionId)}`
    ),
};
