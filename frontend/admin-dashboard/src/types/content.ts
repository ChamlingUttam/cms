export interface Faq {
  id: string;
  question: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
}

export interface FaqInput {
  question: string;
  answer: string;
}

export interface Testimonial {
  id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  srcSet: string | null;
  profession: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TestimonialInput {
  name: string;
  description: string;
  profession: string;
  image?: File;
  removeImage?: boolean;
}

export interface Blog {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  imageUrl: string | null;
  srcSet: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BlogInput {
  name: string;
  shortDescription: string;
  longDescription: string;
  image?: File;
  removeImage?: boolean;
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

export interface ContactInfo {
  id: string;
  address: string | null;
  email: string | null;
  phoneNo: string | null;
}

export interface ContactInput {
  address: string;
  email: string;
  phoneNo: string;
}
