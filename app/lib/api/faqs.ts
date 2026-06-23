import { apiClient, ApiResponse } from './client';

export interface FaqDto {
  id: string;
  question: string;
  answer: string;
  tag: string | null;
  displayOrder: number;
  isActive: boolean;
}

export const faqsApi = {
  getFaqs: async (): Promise<FaqDto[]> => {
    const response = await apiClient.get<ApiResponse<FaqDto[]>>('/faqs?isActive=true');
    return response.data.data ?? [];
  },
};
