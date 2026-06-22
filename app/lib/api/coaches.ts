import { apiClient, ApiResponse } from './client';

export interface CoachDto {
  id: string;
  userId: string | null;
  fullName: string;
  title: string;
  bio: string | null;
  specialization: string | null;
  yearsOfExperience: number;
  certifications: string[];
  achievements: string[];
  phone: string | null;
  email: string | null;
  avatarUrl: string | null;
  coverImageUrl: string | null;
  displayOrder: number;
  isActive: boolean;
}

export const coachesApi = {
  getCoaches: async (isActive = true): Promise<CoachDto[]> => {
    const response = await apiClient.get<ApiResponse<CoachDto[]>>(
      `/coaches?isActive=${isActive}`
    );
    return response.data.data ?? [];
  },

  getCoachById: async (id: string): Promise<CoachDto | null> => {
    const response = await apiClient.get<ApiResponse<CoachDto>>(`/coaches/${id}`);
    return response.data.data ?? null;
  },
};
