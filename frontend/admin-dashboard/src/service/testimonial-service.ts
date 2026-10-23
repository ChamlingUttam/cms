import { apiClient } from '@/api/client';
import { testimonialEndpoints } from '@/api-endpoints/testimonial';
import type { ApiResponse } from '@/types/auth';
import type { Testimonial, TestimonialInput } from '@/types/content';

function toFormData(input: TestimonialInput) {
  const form = new FormData();
  form.append('name', input.name);
  form.append('description', input.description);
  form.append('profession', input.profession);

  if (input.image) {
    form.append('image', input.image);
  }

  if (input.removeImage) {
    form.append('removeImage', 'true');
  }

  return form;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const { data } = await apiClient.get<
    ApiResponse<{ testimonials: Testimonial[] }>
  >(testimonialEndpoints.list);
  return data.data.testimonials;
}

export async function createTestimonial(
  input: TestimonialInput,
): Promise<Testimonial> {
  const { data } = await apiClient.post<
    ApiResponse<{ testimonial: Testimonial }>
  >(testimonialEndpoints.list, toFormData(input), {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data.testimonial;
}

export async function updateTestimonial(
  id: string,
  input: TestimonialInput,
): Promise<Testimonial> {
  const { data } = await apiClient.patch<
    ApiResponse<{ testimonial: Testimonial }>
  >(testimonialEndpoints.byId(id), toFormData(input), {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data.testimonial;
}

export async function deleteTestimonial(id: string): Promise<void> {
  await apiClient.delete(testimonialEndpoints.byId(id));
}
