import { useQuery } from '@tanstack/react-query';
import { coachesApi } from '../api/coaches';

export const coachKeys = {
  all: ['coaches'] as const,
  lists: () => [...coachKeys.all, 'list'] as const,
  detail: (id: string) => [...coachKeys.all, 'detail', id] as const,
};

export function useCoaches(isActive = true) {
  return useQuery({
    queryKey: [...coachKeys.lists(), isActive],
    queryFn: () => coachesApi.getCoaches(isActive),
    staleTime: 10 * 60 * 1000,
  });
}

export function useCoachById(id: string) {
  return useQuery({
    queryKey: coachKeys.detail(id),
    queryFn: () => coachesApi.getCoachById(id),
    staleTime: 10 * 60 * 1000,
    enabled: !!id,
  });
}
