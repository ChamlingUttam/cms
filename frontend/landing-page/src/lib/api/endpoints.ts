export const endpoints = {
  testimonials: "/api/testimonials",
  faqs: "/api/faqs",
  gallery: "/api/gallery",
  posts: "/api/posts",
  post: (slug: string) => `/api/posts/${encodeURIComponent(slug)}`,
  enquiries: "/api/enquiries", // POST only, called by the landing's /api/contact route
} as const;
