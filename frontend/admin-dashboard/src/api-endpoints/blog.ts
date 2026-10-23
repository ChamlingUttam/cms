export const blogEndpoints = {
  list: '/api/admin/blogs',
  byId: (id: string) => `/api/admin/blogs/${encodeURIComponent(id)}`,
} as const;
