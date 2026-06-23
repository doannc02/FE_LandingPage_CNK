import axios, { AxiosError, AxiosResponse } from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.dangcapnc.io.vn/api";

// Server-side only: bỏ qua SSL cert validation khi test local HTTPS
// (backend .NET dùng self-signed dev cert trên localhost)
const isServerLocalHttps =
  typeof window === "undefined" &&
  process.env.NODE_ENV === "development" &&
  API_BASE_URL.startsWith("https://localhost");

// eslint-disable-next-line @typescript-eslint/no-require-imports
const httpsAgent = isServerLocalHttps
  ? new (require("https").Agent)({ rejectUnauthorized: false })
  : undefined;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
  ...(httpsAgent ? { httpsAgent } : {}),
});

// Request interceptor - Thêm token vào header (guard cho SSR)
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
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
      const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;

      if (refreshToken) {
        try {
          const currentAccessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
          const res = await axios.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
            `${API_BASE_URL}/auth/refresh`,
            { accessToken: currentAccessToken, refreshToken }
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

      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
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
