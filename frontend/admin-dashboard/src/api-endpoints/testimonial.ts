export const testimonialEndpoints = {
  list: '/api/admin/testimonials',
  byId: (id: string) => `/api/admin/testimonials/${encodeURIComponent(id)}`,
} as const;
