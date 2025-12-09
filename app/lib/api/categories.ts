import { apiClient, ApiResponse } from './client';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  parentName?: string;
  displayOrder: number;
  isActive: boolean;
  postCount: number;
  children: Category[];
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  parentId?: string;
  displayOrder: number;
  isActive: boolean;
}

export const categoriesApi = {
  // GET /api/categories
  getCategories: async (includeChildren = false) => {
    const response = await apiClient.get<ApiResponse<Category[]>>(
      '/categories',
      { params: { includeChildren } }
    );
    return response.data.data!;
  },

  // POST /api/categories
  createCategory: async (data: CreateCategoryRequest) => {
    const response = await apiClient.post<ApiResponse<string>>(
      '/categories',
      data
    );
    return response.data;
  },
};