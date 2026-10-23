export const galleryEndpoints = {
  list: '/api/admin/gallery',
  byId: (id: string) => `/api/admin/gallery/${encodeURIComponent(id)}`,
} as const;
