export const faqEndpoints = {
  list: '/api/admin/faqs',
  byId: (id: string) => `/api/admin/faqs/${encodeURIComponent(id)}`,
} as const;
