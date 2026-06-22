import { apiClient, ApiResponse } from './client';

export interface Course {
  id: string;
  name: string;
  slug: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Professional';
  durationMonths: number;
  sessionsPerWeek: number;
  price: number;
  isFree: boolean;
  features?: string[];
  thumbnailUrl?: string;
  isFeatured: boolean;
  isActive: boolean;
}

export interface CreateCourseRequest {
  name: string;
  description: string;
  level: string;
  durationMonths: number;
  sessionsPerWeek: number;
  price: number;
  isFree: boolean;
  features: string[];
  thumbnailUrl?: string;
  isFeatured: boolean;
}

export interface CourseEnrollmentRequest {
  fullName: string;
  phone: string;
  email?: string;
  courseId: string;
  message?: string;
}

export const coursesApi = {
  // GET /api/courses
  getCourses: async () => {
    const response = await apiClient.get<ApiResponse<Course[]>>('/courses');
    return response.data.data!;
  },

  // GET /api/courses/slug/{slug}
  // Tries the dedicated slug endpoint first; if the endpoint doesn't exist or
  // returns 404 Axios throws — we catch and fall back to a full-list search.
  getCourseBySlug: async (slug: string): Promise<Course | null> => {
    try {
      const response = await apiClient.get<ApiResponse<Course>>(`/courses/slug/${slug}`);
      if (response.data?.data) return response.data.data;
    } catch {
      // 404 or network error — fall through to list search
    }
    try {
      const list = await apiClient.get<ApiResponse<Course[]>>('/courses');
      return list.data.data?.find((c) => c.slug === slug) ?? null;
    } catch {
      return null;
    }
  },

  // POST /api/course-enrollments
  enrollCourse: async (data: CourseEnrollmentRequest) => {
    const response = await apiClient.post<ApiResponse<string>>('/course-enrollments', data);
    return response.data;
  },

  // POST /api/courses
  createCourse: async (data: CreateCourseRequest) => {
    const response = await apiClient.post<ApiResponse<string>>('/courses', data);
    return response.data;
  },
};