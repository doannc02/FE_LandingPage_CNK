import { apiClient, ApiResponse } from './client';

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  fullName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: {
    id: string;
    email: string;
    username: string;
    fullName: string;
    role: string;
    avatarUrl?: string;
  };
}

export const authApi = {
  register: async (data: RegisterRequest) => {
    const response = await apiClient.post<ApiResponse<string>>(
      '/auth/register',
      data
    );
    return response.data;
  },

  login: async (data: LoginRequest) => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/login',
      data
    );

    if (response.data.isSuccess && response.data.data) {
      localStorage.setItem('accessToken', response.data.data.accessToken);
      localStorage.setItem('refreshToken', response.data.data.refreshToken);
    }

    return response.data;
  },

  /** SSO — đổi Firebase ID Token lấy JWT nội bộ.
   *  Gọi qua Next.js proxy để tránh CORS (browser → localhost → backend). */
  exchangeToken: async (firebaseIdToken: string) => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/api/auth/exchange-token',
      { firebaseIdToken },
      { baseURL: typeof window !== 'undefined' ? window.location.origin : '' }
    );

    if (response.data.isSuccess && response.data.data) {
      localStorage.setItem('accessToken', response.data.data.accessToken);
      localStorage.setItem('refreshToken', response.data.data.refreshToken);
    }

    return response.data;
  },

  /** Phân quyền — chỉ SuperAdmin được gọi */
  assignRole: async (targetUserId: string, role: 'SuperAdmin' | 'SubAdmin' | 'Student') => {
    const response = await apiClient.post<ApiResponse<null>>(
      '/auth/assign-role',
      { targetUserId, role }
    );
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
};