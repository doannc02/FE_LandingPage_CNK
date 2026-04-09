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

/** Trích xuất ApiResponse từ Axios error (HTTP 4xx) để lấy thông báo lỗi từ backend */
function extractErrorResponse<T>(err: unknown): ApiResponse<T> | null {
  const axiosErr = err as { response?: { data?: ApiResponse<T> } };
  const data = axiosErr?.response?.data;
  if (data && typeof data === 'object' && 'isSuccess' in data) {
    return data as ApiResponse<T>;
  }
  return null;
}

export const authApi = {
  register: async (data: RegisterRequest): Promise<ApiResponse<string>> => {
    try {
      const response = await apiClient.post<ApiResponse<string>>('/auth/register', data);
      return response.data;
    } catch (err: unknown) {
      const errData = extractErrorResponse<string>(err);
      if (errData) return errData;
      throw err;
    }
  },

  login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data);
      if (response.data.isSuccess && response.data.data) {
        localStorage.setItem('accessToken', response.data.data.accessToken);
        localStorage.setItem('refreshToken', response.data.data.refreshToken);
      }
      return response.data;
    } catch (err: unknown) {
      const errData = extractErrorResponse<AuthResponse>(err);
      if (errData) return errData;
      throw err;
    }
  },

  /** SSO — đổi Firebase ID Token lấy JWT nội bộ.
   *  Gọi qua Next.js proxy để tránh CORS (browser → localhost → backend). */
  exchangeToken: async (firebaseIdToken: string): Promise<ApiResponse<AuthResponse>> => {
    try {
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
    } catch (err: unknown) {
      const errData = extractErrorResponse<AuthResponse>(err);
      if (errData) return errData;
      throw err;
    }
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
