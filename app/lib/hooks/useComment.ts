// app/lib/hooks/useComments.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AddCommentRequest, commentsApi } from "../api/comment";

// Query Keys
export const commentKeys = {
  all: ["comments"] as const,
  byPost: (postId: string) => [...commentKeys.all, "post", postId] as const,
};

// ✅ GET Comments by Post ID
export function useComments(postId: string) {
  return useQuery({
    queryKey: commentKeys.byPost(postId),
    queryFn: () => commentsApi.getComments(postId),
    enabled: !!postId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

// ✅ ADD Comment
export function useAddComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddCommentRequest) => 
      commentsApi.addComment(postId, data),
    onSuccess: () => {
      // Invalidate comments list để fetch lại
      queryClient.invalidateQueries({ 
        queryKey: commentKeys.byPost(postId) 
      });
      
      // Cập nhật comment count trong post detail
      queryClient.invalidateQueries({ 
        queryKey: ["posts", "detail"] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ["posts", "slug"] 
      });
    },
  });
}