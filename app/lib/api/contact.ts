import { apiClient, ApiResponse, PaginatedResponse } from './client';

export interface ContactSubmission {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  courseName?: string;
  message: string;
  status: 'New' | 'Read' | 'Replied' | 'Archived';
  createdAt: string;
}

export interface CreateContactRequest {
  fullName: string;
  phone: string;
  email: string;
  courseId?: string;
  message: string;
}

export const contactApi = {
  // POST /api/contact - Gửi form liên hệ
  submitContact: async (data: CreateContactRequest) => {
    const response = await apiClient.post<ApiResponse<string>>(
      '/contact',
      data
    );
    return response.data;
  },

  // GET /api/contact - Danh sách submissions (Admin only)
  getSubmissions: async (pageNumber = 1, pageSize = 20) => {
    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<ContactSubmission>>
    >('/contact', {
      params: { pageNumber, pageSize },
    });
    return response.data.data!;
  },
};