import { apiClient, type ApiResponse } from "./client";
import type { ChatMessageRequest, ChatMessageResponse } from "@/app/components/Chat/types";

export const chatApi = {
  sendMessage: (data: ChatMessageRequest) =>
    apiClient.post<ApiResponse<ChatMessageResponse>>("/v1/chat/message", data),
};
