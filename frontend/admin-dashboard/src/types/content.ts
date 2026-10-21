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
