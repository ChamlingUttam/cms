'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createContactInfo,
  deleteContactInfo,
  getContactInfo,
  updateContactInfo,
} from '@/service/contact-service';
import {
  createFaq,
  deleteFaq,
  getFaqs,
  updateFaq,
} from '@/service/faq-service';
import type { ContactInput, FaqInput } from '@/types/content';

export const contentQueryKeys = {
  faqs: ['admin', 'faqs'] as const,
  contact: ['admin', 'contact'] as const,
};

export function useFaqs() {
  return useQuery({
    queryKey: contentQueryKeys.faqs,
    queryFn: getFaqs,
    retry: false,
  });
}

export function useCreateFaq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: FaqInput) => createFaq(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: contentQueryKeys.faqs }),
  });
}

export function useUpdateFaq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: FaqInput }) =>
      updateFaq(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: contentQueryKeys.faqs }),
  });
}

export function useDeleteFaq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteFaq(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: contentQueryKeys.faqs }),
  });
}

export function useContactInfo() {
  return useQuery({
    queryKey: contentQueryKeys.contact,
    queryFn: getContactInfo,
    retry: false,
  });
}

export function useCreateContactInfo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ContactInput) => createContactInfo(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: contentQueryKeys.contact }),
  });
}

export function useUpdateContactInfo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ContactInput) => updateContactInfo(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: contentQueryKeys.contact }),
  });
}

export function useDeleteContactInfo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteContactInfo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: contentQueryKeys.contact }),
  });
}
