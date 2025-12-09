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
};

// GET Posts với pagination
export function usePosts(params: GetPostsParams = {}) {
  return useQuery({
    queryKey: postKeys.list(params),
    queryFn: () => postsApi.getPosts(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// GET Single Post
export function usePost(id: string) {
  return useQuery({
    queryKey: postKeys.detail(id),
    queryFn: () => postsApi.getPost(id),
    enabled: !!id,
  });
}

// GET Post by Slug
export function usePostBySlug(slug: string) {
  return useQuery({
    queryKey: postKeys.slug(slug),
    queryFn: () => postsApi.getPostBySlug(slug),
    enabled: !!slug,
  });
}

// CREATE Post
export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostRequest) => postsApi.createPost(data),
    onSuccess: () => {
      // Invalidate và refetch posts list
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}

// UPDATE Post
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

// DELETE Post
export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => postsApi.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}

// PUBLISH Post
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
