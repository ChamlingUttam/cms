// export interface Faq {
//   id: string;
//   question: string;
//   answer: string;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface FaqInput {
//   question: string;
//   answer: string;
// }

// export interface Testimonial {
//   id: string;
//   name: string;
//   description: string;
//   imageUrl: string | null;
//   srcSet: string | null;
//   profession: string | null;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface TestimonialInput {
//   name: string;
//   description: string;
//   profession: string;
//   image?: File;
//   removeImage?: boolean;
// }

// export interface Blog {
//   id: string;
//   name: string;
//   slug: string;
//   shortDescription: string;
//   longDescription: string;
//   imageUrl: string | null;
//   srcSet: string | null;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface BlogInput {
//   name: string;
//   shortDescription: string;
//   longDescription: string;
//   image?: File;
//   removeImage?: boolean;
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

// export interface ContactInfo {
//   id: string;
//   address: string | null;
//   email: string | null;
//   phoneNo: string | null;
// }

// export interface ContactInput {
//   address: string;
//   email: string;
//   phoneNo: string;
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

export interface BlogPagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

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
