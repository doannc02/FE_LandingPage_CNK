import type { AxiosProgressEvent } from "axios";
import { apiClient } from "./client";
import type { ChatRequest } from "@/app/components/Chat/types";

export const chatApi = {
  streamMessage: (
    data: ChatRequest,
    onDownloadProgress: (evt: AxiosProgressEvent) => void,
    signal?: AbortSignal,
  ) =>
    apiClient.post<string>("/v1/chat/stream", data, {
      responseType: "text",
      signal,
      onDownloadProgress,
    }),
};
