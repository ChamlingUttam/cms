import type { SocialLink } from "@/types";

const rawUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const siteConfig = {
  name: "Brightwood Academy",
  shortName: "Brightwood",
  tagline: "Where bright minds grow boldly.",
  description:
    "Brightwood Academy is an independent, inclusive school for ages 5–18 where small classes, inquiry-led learning and a kind community help every student grow with confidence.",
  url: rawUrl.replace(/\/$/, ""),
  locale: "en_US",
  foundingYear: 2001,
  keywords: [
    "independent school",
    "private school",
    "school admissions",
    "primary school",
    "middle school",
    "senior school",
    "small class sizes",
    "Brightwood Academy",
  ],
  contact: {
    email: "raiayutra@gmail.com",
    phone: "+1 (555) 014-2024",
    phoneHref: "+15550142024",
    hours: "Monday–Friday, 10:00am–4:30pm",
    address: {
      street: "14 Willow Lane",
      locality: "Brightwood",
      postalCode: "BW 2041",
      country: "US",
    },
  },
} as const;

export const socialLinks: SocialLink[] = [
  {
    label: "LinkedIn",
    short: "in",
    href: "https://www.linkedin.com/company/brightwood-academy",
  },
  {
    label: "Instagram",
    short: "ig",
    href: "https://www.instagram.com/brightwoodacademy",
  },
  {
    label: "Facebook",
    short: "f",
    href: "https://www.facebook.com/brightwoodacademy",
  },
];

export function absoluteUrl(path = "/"): string {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
