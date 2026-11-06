// export const endpoints = {
//   testimonials: "/api/testimonials",
//   faqs: "/api/faqs",
//   gallery: "/api/gallery",
//   blogs: "/api/blogs",
//   post: (slug: string) => `/api/posts/${encodeURIComponent(slug)}`,
//   contact: "/api/contact", // POST only, called by the landing's /api/contact route
// } as const;

// /** Every backend URL the landing page uses (public, read-only). */
// export const endpoints = {
//   testimonials: "/api/testimonials",
//   faqs: "/api/faqs",
//   gallery: "/api/gallery",
//   blogs: "/api/blogs", // ?page=1&limit=9
//   blog: (slug: string) => `/api/blogs/${encodeURIComponent(slug)}`,
//   contactInfo: "/api/contact-info",
//   enquiries: "/api/enquiries", // POST only, called by the landing's /api/contact route
// } as const;

/** Every backend URL the landing page uses (public, read-only). */
export const endpoints = {
  testimonials: "/api/testimonials",
  faqs: "/api/faqs",
  gallery: "/api/gallery",
  blogs: "/api/blogs", // ?page=1&limit=9
  blog: (slug: string) => `/api/blogs/${encodeURIComponent(slug)}`,
  contactInfo: "/api/contact",
  enquiries: "/api/enquiries", // POST only, called by the landing's /api/contact route
} as const;
