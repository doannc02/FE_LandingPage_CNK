import { useQuery } from '@tanstack/react-query';
import { testimonialsApi } from '../api/testimonials';

export function useTestimonials() {
  return useQuery({
    queryKey: ['testimonials'],
    queryFn: testimonialsApi.getTestimonials,
    staleTime: 15 * 60 * 1000,
    retry: 1,
  });
}
