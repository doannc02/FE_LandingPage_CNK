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

export const coursesApi = {
  // GET /api/courses
  getCourses: async () => {
    const response = await apiClient.get<ApiResponse<Course[]>>('/courses');
    return response.data.data!;
  },

  // POST /api/courses
  createCourse: async (data: CreateCourseRequest) => {
    const response = await apiClient.post<ApiResponse<string>>(
      '/courses',
      data
    );
    return response.data;
  },
};