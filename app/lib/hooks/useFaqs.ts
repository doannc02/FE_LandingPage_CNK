import { useQuery } from '@tanstack/react-query';
import { faqsApi } from '../api/faqs';

export function useFaqs() {
  return useQuery({
    queryKey: ['faqs'],
    queryFn: faqsApi.getFaqs,
    staleTime: 15 * 60 * 1000,
    retry: 1,
  });
}
