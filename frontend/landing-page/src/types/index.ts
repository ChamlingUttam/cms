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
