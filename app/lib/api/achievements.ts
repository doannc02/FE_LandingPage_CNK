import { apiClient, ApiResponse } from './client';

export interface AchievementDto {
  id: string;
  title: string;
  description: string | null;
  achievementDate: string;
  type: 'Competition' | 'Certification' | 'Milestone' | 'Award';
  imageUrl: string | null;
  videoUrl: string | null;
  coachId: string | null;
  participantNames: string[] | null;
  displayOrder: number;
  isFeatured: boolean;
}

export const achievementsApi = {
  getAchievements: async (featured?: boolean): Promise<AchievementDto[]> => {
    const params = new URLSearchParams();
    if (featured !== undefined) params.set('featured', String(featured));
    const response = await apiClient.get<ApiResponse<AchievementDto[]>>(
      `/achievements?${params.toString()}`
    );
    return response.data.data ?? [];
  },
};
