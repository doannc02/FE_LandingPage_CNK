import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coursesApi, CreateCourseRequest } from '../api/course';

export const courseKeys = {
  all: ['courses'] as const,
  lists: () => [...courseKeys.all, 'list'] as const,
};

export function useCourses() {
  return useQuery({
    queryKey: courseKeys.lists(),
    queryFn: () => coursesApi.getCourses(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCourseRequest) => coursesApi.createCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
    },
  });
}