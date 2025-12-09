import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { contactApi, CreateContactRequest } from '../api/contact';

export const contactKeys = {
  all: ['contact'] as const,
  submissions: (page: number) => [...contactKeys.all, 'submissions', page] as const,
};

export function useSubmitContact() {
  return useMutation({
    mutationFn: (data: CreateContactRequest) => contactApi.submitContact(data),
  });
}

export function useContactSubmissions(pageNumber = 1, pageSize = 20) {
  return useQuery({
    queryKey: contactKeys.submissions(pageNumber),
    queryFn: () => contactApi.getSubmissions(pageNumber, pageSize),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}