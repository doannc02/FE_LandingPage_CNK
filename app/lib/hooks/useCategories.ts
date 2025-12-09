import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesApi, CreateCategoryRequest } from '../api/categories';

export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (includeChildren: boolean) => [...categoryKeys.lists(), includeChildren] as const,
};

export function useCategories(includeChildren = false) {
  return useQuery({
    queryKey: categoryKeys.list(includeChildren),
    queryFn: () => categoriesApi.getCategories(includeChildren),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryRequest) => categoriesApi.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
  });
}