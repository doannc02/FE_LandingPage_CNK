import { useQuery } from '@tanstack/react-query';
import { achievementsApi } from '../api/achievements';

export const achievementKeys = {
  all: ['achievements'] as const,
  lists: (featured?: boolean) => [...achievementKeys.all, 'list', featured] as const,
};

export function useAchievements(featured?: boolean) {
  return useQuery({
    queryKey: achievementKeys.lists(featured),
    queryFn: () => achievementsApi.getAchievements(featured),
    staleTime: 15 * 60 * 1000,
  });
}
