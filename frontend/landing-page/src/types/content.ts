export interface Testimonial {
  id: string;
  name: string;
  description: string;
  profession: string | null;
  imageUrl: string | null;
  srcSet: string | null;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
}
