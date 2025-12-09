import { apiClient, ApiResponse, PaginatedResponse } from './client';

export interface Post {
  id: string;
  title: string;
  slug: string;
  thumbnailUrl?: string;
  excerpt?: string;
  content?: string;
  featuredImageUrl?: string;
  status: 'Draft' | 'Published' | 'Archived';
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
  status?: 'Draft' | 'Published' | 'Archived';
  isFeatured?: boolean;
}

export const postsApi = {
  // GET /api/posts - Danh sách posts
  getPosts: async (params: GetPostsParams = {}): Promise<PaginatedResponse<Post>> => {
    try {
      console.log('Fetching posts with params:', params);
      
      const response = await apiClient.get<PaginatedResponse<Post>>(
        '/posts',
        { params }
      );
      
      console.log('Posts API Response:', response.data);
      
      if (!response.data) {
        throw new Error('No data received from API');
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      
      // Log chi tiết error
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      
      // Trả về giá trị mặc định để không bao giờ return undefined
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
  // GET /api/posts/{id} - Chi tiết post
  getPost: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Post>>(`/posts/${id}`);
    return response.data!;
  },

  // GET /api/posts/slug/{slug} - Post by slug
  getPostBySlug: async (slug: string) => {
    const response = await apiClient.get<ApiResponse<Post>>(
      `/posts/slug/${slug}`
    );
    return response.data.data!;
  },

  // POST /api/posts - Tạo post mới
  createPost: async (data: CreatePostRequest) => {
    const response = await apiClient.post<ApiResponse<string>>('/posts', data);
    return response.data;
  },

  // PUT /api/posts/{id} - Cập nhật post
  updatePost: async (id: string, data: Partial<CreatePostRequest>) => {
    const response = await apiClient.put<ApiResponse<boolean>>(
      `/posts/${id}`,
      data
    );
    return response.data;
  },

  // DELETE /api/posts/{id} - Xóa post
  deletePost: async (id: string) => {
    await apiClient.delete(`/posts/${id}`);
  },

  // POST /api/posts/{id}/publish - Publish post
  publishPost: async (id: string) => {
    const response = await apiClient.post<ApiResponse<boolean>>(
      `/posts/${id}/publish`
    );
    return response.data;
  },
};