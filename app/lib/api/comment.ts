// app/lib/api/comments.ts
import { apiClient, ApiResponse } from "./client";

export interface CommentDto {
  id: string;
  content: string;
  authorName: string;
  authorEmail?: string;
  createdAt: string;
  parentId?: string;
  replies?: CommentDto[];
}

export interface AddCommentRequest {
  content: string;
  authorName: string;
  authorEmail: string;
  parentId?: string;
}

export const commentsApi = {
  // ✅ GET /api/posts/{id}/comments - Lấy comments của post
  getComments: async (postId: string): Promise<CommentDto[]> => {
    const response = await apiClient.get<ApiResponse<CommentDto[]>>(
      `/posts/${postId}/comments`
    );

    if (!response.data.data) {
      throw new Error(response.data.error || "Failed to fetch comments");
    }

    return response.data.data;
  },

  // ✅ POST /api/posts/{id}/comments - Thêm comment
  addComment: async (
    postId: string,
    data: AddCommentRequest
  ): Promise<{ commentId: string }> => {
    const response = await apiClient.post<ApiResponse<{ commentId: string }>>(
      `/posts/${postId}/comments`,
      data
    );

    if (!response.data.data) {
      throw new Error(response.data.error || "Failed to add comment");
    }

    return response.data.data;
  },
};
