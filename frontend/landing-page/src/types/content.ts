// /**
//  * Content that is managed in the admin dashboard and loaded from the backend API.
//  * Mirrors the admin's `@/types/content`.
//  */

// /** A frequently asked question, as returned by GET /api/faqs (managed in the admin dashboard). */
// export interface Faq {
//   id: string;
//   question: string;
//   answer: string;
// }

// /** A testimonial as returned by GET /api/testimonials. */
// export interface Testimonial {
//   id: string;
//   name: string;
//   description: string;
//   profession: string | null;
//   imageUrl: string | null;
//   srcSet: string | null;
// }

// /** A blog post as returned by GET /api/blogs (managed in the admin dashboard). */
// export interface Blog {
//   id: string;
//   name: string;
//   slug: string;
//   shortDescription: string;
//   /** Plain text. Blank lines separate paragraphs. */
//   longDescription: string;
//   imageUrl: string | null;
//   srcSet: string | null;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface BlogPagination {
//   page: number;
//   limit: number;
//   totalItems: number;
//   totalPages: number;
// }

// export interface BlogList {
//   blogs: Blog[];
//   pagination: BlogPagination;
// }

// /** The school's contact details, as returned by GET /api/contact-info (same as the admin's `ContactInfo`). */
// export interface ContactInfo {
//   id: string;
//   address: string | null;
//   email: string | null;
//   phoneNo: string | null;
// }

/**
 * Content that is managed in the admin dashboard and loaded from the backend API.
 * Mirrors the admin's `@/types/content`.
 */

/** A frequently asked question, as returned by GET /api/faqs (managed in the admin dashboard). */
export interface Faq {
  id: string;
  question: string;
  answer: string;
}

/** A testimonial as returned by GET /api/testimonials. */
export interface Testimonial {
  id: string;
  name: string;
  description: string;
  profession: string | null;
  imageUrl: string | null;
  srcSet: string | null;
}

/** A blog post as returned by GET /api/blogs (managed in the admin dashboard). */
export interface Blog {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  /** Plain text. Blank lines separate paragraphs. */
  longDescription: string;
  imageUrl: string | null;
  srcSet: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Paging info returned by the backend's list endpoints (blogs, gallery). */
export interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export type BlogPagination = Pagination;

export interface BlogList {
  blogs: Blog[];
  pagination: BlogPagination;
}

/** The school's contact details, as returned by GET /api/contact-info (same as the admin's `ContactInfo`). */
export interface ContactInfo {
  id: string;
  address: string | null;
  email: string | null;
  phoneNo: string | null;
}

/** A photo as returned by GET /api/gallery (uploaded in the admin dashboard). */
export interface GalleryImage {
  id: string;
  imageUrl: string;
  srcSet: string | null;
  /** Short description for screen readers. The admin has no caption field, so this is usually empty. */
  alt: string;
  createdAt: string;
}

export interface GalleryList {
  images: GalleryImage[];
  pagination: Pagination;
}
