export type IconName =
  | "arrow"
  | "book"
  | "globe"
  | "people"
  | "spark"
  | "science"
  | "palette"
  | "trophy"
  | "menu"
  | "close"
  | "pin"
  | "mail"
  | "phone"
  | "check";

export interface NavItem {
  label: string;
  href: string;
}

export interface Pillar {
  icon: IconName;
  title: string;
  text: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface Value {
  title: string;
  text: string;
}

export interface Facility {
  icon: IconName;
  title: string;
  text: string;
}

export type ProgramTone = "yellow" | "blue" | "green" | "coral";

export interface Program {
  slug: string;
  age: string;
  title: string;
  text: string;
  tone: ProgramTone;
}

export interface SocialLink {
  label: string;
  short: string;
  href: string;
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

// // export interface Testimonial {
// //   quote: string;
// //   name: string;
// //   /** Relationship to the school, e.g. "Parent, Primary School". */
// //   role: string;
// // }

// export interface Testimonial {
//   id: string;
//   name: string;
//   description: string;
//   profession: string | null;
//   imageUrl: string | null;
//   srcSet: string | null;
// }

export type BlogBlock = { type: "heading" | "paragraph"; text: string };

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  /** ISO date, e.g. "2026-10-14". */
  date: string;
  category: string;
  author: string;
  readTime: number;
  image: { src: string; alt: string };
  body: BlogBlock[];
}
