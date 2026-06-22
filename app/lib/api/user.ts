import { apiClient, ApiResponse } from './client';

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  fullName: string;
  role: string;
  avatarUrl?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: string;
  createdAt?: string;
}

export interface UpdateProfileRequest {
  fullName?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: string;
  avatarUrl?: string;
}

export const userApi = {
  getMe: async (): Promise<UserProfile> => {
    const response = await apiClient.get<ApiResponse<UserProfile>>('/users/me');
    return response.data.data!;
  },

  updateProfile: async (id: string, data: UpdateProfileRequest): Promise<boolean> => {
    const response = await apiClient.put<ApiResponse<boolean>>(`/users/${id}`, data);
    return response.data.isSuccess;
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.post<ApiResponse<null>>('/auth/change-password', { currentPassword, newPassword });
    return response.data;
  },
};
