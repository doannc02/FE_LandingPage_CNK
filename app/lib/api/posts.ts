// app/lib/api/posts.ts
import { apiClient, ApiResponse, PaginatedResponse } from "./client";

export interface Post {
  id: string;
  title: string;
  slug: string;
  thumbnailUrl?: string;
  excerpt?: string;
  content?: string;
  featuredImageUrl?: string;
  status: "Draft" | "Published" | "Archived";
  isFeatured: boolean;
  publishedAt?: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  authorName: string;
  categoryName?: string;
  createdAt: string;
  images?: PostImage[];
  tags?: string[];
}

export interface PostDetailDto extends Post {
  // Extended fields for detail page
}

export interface RelatedPostDto {
  id: string;
  title: string;
  slug: string;
  featuredImageUrl?: string;
  thumbnailUrl?: string;
  publishedAt?: string;
  createdAt: string;
  categoryName?: string;
}

export interface PostImage {
  id: string;
  imageUrl: string;
  thumbnailUrl?: string;
  caption?: string;
  altText?: string;
  displayOrder: number;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  excerpt?: string;
  featuredImageUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  categoryId?: string;
  tags: string[];
  imageUrls: string[];
  isFeatured: boolean;
  publishNow: boolean;
}

export interface GetPostsParams {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  categoryId?: string;
  status?: "Draft" | "Published" | "Archived";
  isFeatured?: boolean;
}

export const postsApi = {
  // ✅ GET /api/posts - Danh sách posts với pagination
  getPosts: async (
    params: GetPostsParams = {}
  ): Promise<PaginatedResponse<Post>> => {
    try {
      console.log("Fetching posts with params:", params);

      const response = await apiClient.get<
        ApiResponse<PaginatedResponse<Post>>
      >("/posts", { params });

      console.log("Posts API Response:", response.data);

      // Backend trả về { success, data, error }
      // data chứa PaginatedList<PostDto>
      if (response.data && response.data.data) {
        return response.data.data;
      }

      throw new Error(response.data.error || "Failed to fetch posts");
    } catch (error) {
      console.error("Error fetching posts:", error);

      // Trả về giá trị mặc định
      return {
        items: [],
        pageNumber: params.pageNumber || 1,
        pageSize: params.pageSize || 20,
        totalCount: 0,
        totalPages: 0,
        hasPrevious: false,
        hasNext: false,
      };
    }
  },

  // ✅ GET /api/posts/{id} - Chi tiết post by ID
  getPost: async (id: string): Promise<PostDetailDto> => {
    const response = await apiClient.get<ApiResponse<PostDetailDto>>(
      `/posts/${id}`
    );

    if (!response.data || !response.data.data) {
      throw new Error(response.data.error || "Post not found");
    }

    return response.data.data;
  },

  // ✅ GET /api/posts/slug/{slug} - Post by slug
  getPostBySlug: async (slug: string): Promise<PostDetailDto> => {
    const response = await apiClient.get<ApiResponse<PostDetailDto>>(
      `/posts/slug/${slug}`
    );

    if (!response.data || !response.data.data) {
      throw new Error(response.data.error || "Post not found");
    }

    return response.data.data;
  },

  // ✅ NEW: GET /api/posts/{slug}/related - Related posts
  getRelatedPosts: async (
    slug: string,
    limit: number = 5
  ): Promise<RelatedPostDto[]> => {
    const response = await apiClient.get<ApiResponse<RelatedPostDto[]>>(
      `/posts/${slug}/related`,
      { params: { limit } }
    );

    if (!response.data || !response.data.data) {
      throw new Error(response.data.error || "Failed to fetch related posts");
    }

    return response.data.data;
  },

  // ✅ NEW: POST /api/posts/{id}/like - Like post
  likePost: async (id: string): Promise<number> => {
    const response = await apiClient.post<ApiResponse<number>>(
      `/posts/${id}/like`
    );

    if (!response.data) {
      throw new Error("Failed to like post");
    }

    return response.data.data || 0;
  },

  // ✅ POST /api/posts - Tạo post mới (Admin/Editor)
  createPost: async (data: CreatePostRequest): Promise<string> => {
    const response = await apiClient.post<ApiResponse<string>>("/posts", data);

    if (!response.data || !response.data.data) {
      throw new Error("Failed to create post");
    }

    return response.data.data;
  },

  // ✅ PUT /api/posts/{id} - Cập nhật post
  updatePost: async (
    id: string,
    data: Partial<CreatePostRequest>
  ): Promise<boolean> => {
    const response = await apiClient.put<ApiResponse<boolean>>(
      `/posts/${id}`,
      data
    );

    if (!response.data) {
      throw new Error("Failed to update post");
    }

    return response.data.data || false;
  },

  // ✅ DELETE /api/posts/{id} - Xóa post
  deletePost: async (id: string): Promise<void> => {
    await apiClient.delete(`/posts/${id}`);
  },

  // ✅ POST /api/posts/{id}/publish - Publish post
  publishPost: async (id: string): Promise<boolean> => {
    const response = await apiClient.post<ApiResponse<boolean>>(
      `/posts/${id}/publish`
    );

    if (!response.data) {
      throw new Error("Failed to publish post");
    }

    return response.data.data || false;
  },
};
