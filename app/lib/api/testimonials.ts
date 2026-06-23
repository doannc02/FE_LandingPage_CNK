import { apiClient, ApiResponse } from './client';

export interface TestimonialDto {
  id: string;
  authorName: string;
  avatarInitials: string | null;
  avatarColor: string | null;
  role: string | null;
  content: string;
  rating: number;
  source: 'Google' | 'Facebook';
  reviewDate: string;
  isActive: boolean;
  displayOrder: number;
}

export const testimonialsApi = {
  getTestimonials: async (): Promise<TestimonialDto[]> => {
    const response = await apiClient.get<ApiResponse<TestimonialDto[]>>('/testimonials?isActive=true');
    return response.data.data ?? [];
  },
};
