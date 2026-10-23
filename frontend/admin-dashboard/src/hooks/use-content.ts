'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createBlog,
  deleteBlog,
  getBlogs,
  updateBlog,
} from '@/service/blog-service';
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
import {
  createTestimonial,
  deleteTestimonial,
  getTestimonials,
  updateTestimonial,
} from '@/service/testimonial-service';
import type {
  ContactInput,
  BlogInput,
  FaqInput,
  TestimonialInput,
} from '@/types/content';

export const contentQueryKeys = {
  blogs: ['admin', 'blogs'] as const,
  blogList: (page: number) => [...contentQueryKeys.blogs, page] as const,
  faqs: ['admin', 'faqs'] as const,
  contact: ['admin', 'contact'] as const,
  testimonials: ['admin', 'testimonials'] as const,
};

export function useBlogs(page: number) {
  return useQuery({
    queryKey: contentQueryKeys.blogList(page),
    queryFn: () => getBlogs(page),
    retry: false,
  });
}

export function useCreateBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: BlogInput) => createBlog(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: contentQueryKeys.blogs }),
  });
}

export function useUpdateBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: BlogInput }) =>
      updateBlog(id, input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: contentQueryKeys.blogs }),
  });
}

export function useDeleteBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBlog(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: contentQueryKeys.blogs }),
  });
}

export function useTestimonials() {
  return useQuery({
    queryKey: contentQueryKeys.testimonials,
    queryFn: getTestimonials,
    retry: false,
  });
}

export function useCreateTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: TestimonialInput) => createTestimonial(input),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: contentQueryKeys.testimonials,
      }),
  });
}

export function useUpdateTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: TestimonialInput }) =>
      updateTestimonial(id, input),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: contentQueryKeys.testimonials,
      }),
  });
}

export function useDeleteTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTestimonial(id),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: contentQueryKeys.testimonials,
      }),
  });
}

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
