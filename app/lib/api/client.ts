import axios, { AxiosError, AxiosResponse } from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://103.126.161.89/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Thêm token vào header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor — tự động refresh token khi nhận 401
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as typeof error.config & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          const res = await axios.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
            `${API_BASE_URL}/auth/refresh`,
            { refreshToken }
          );

          if (res.data.isSuccess && res.data.data) {
            const { accessToken, refreshToken: newRefresh } = res.data.data;
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", newRefresh);
            originalRequest!.headers!.Authorization = `Bearer ${accessToken}`;
            return apiClient(originalRequest!);
          }
        } catch {
          // refresh thất bại — logout
        }
      }

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

// Generic API Response wrapper
export interface ApiResponse<T> {
  isSuccess: boolean;
  data?: T;
  error?: string;
}

// Paginated response
export interface PaginatedResponse<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}
