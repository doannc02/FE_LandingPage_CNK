// app/lib/hooks/usePosts.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CreatePostRequest, GetPostsParams, postsApi } from "../api/posts";

// Query Keys
export const postKeys = {
  all: ["posts"] as const,
  lists: () => [...postKeys.all, "list"] as const,
  list: (params: GetPostsParams) => [...postKeys.lists(), params] as const,
  details: () => [...postKeys.all, "detail"] as const,
  detail: (id: string) => [...postKeys.details(), id] as const,
  slug: (slug: string) => [...postKeys.all, "slug", slug] as const,
  related: (slug: string) => [...postKeys.all, "related", slug] as const,
};

// ✅ GET Posts với pagination
export function usePosts(params: GetPostsParams = {}) {
  return useQuery({
    queryKey: postKeys.list(params),
    queryFn: () => postsApi.getPosts(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// ✅ GET Single Post by ID
export function usePost(id: string) {
  return useQuery({
    queryKey: postKeys.detail(id),
    queryFn: () => postsApi.getPost(id),
    enabled: !!id,
  });
}

// ✅ GET Post by Slug
export function usePostBySlug(slug: string) {
  return useQuery({
    queryKey: postKeys.slug(slug),
    queryFn: () => postsApi.getPostBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// ✅ NEW: GET Related Posts
export function useRelatedPosts(slug: string, limit: number = 5) {
  return useQuery({
    queryKey: postKeys.related(slug),
    queryFn: () => postsApi.getRelatedPosts(slug, limit),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

// ✅ NEW: LIKE Post
export function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => postsApi.likePost(postId),
    onSuccess: (newLikeCount, postId) => {
      // Optimistic update - cập nhật like count ngay lập tức
      queryClient.setQueryData(
        postKeys.detail(postId),
        (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            likeCount: newLikeCount,
          };
        }
      );
      
      // Invalidate để fetch lại
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}

// ✅ CREATE Post
export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostRequest) => postsApi.createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}

// ✅ UPDATE Post
export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreatePostRequest>;
    }) => postsApi.updatePost(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: postKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}

// ✅ DELETE Post
export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => postsApi.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}

// ✅ PUBLISH Post
export function usePublishPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => postsApi.publishPost(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: postKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}