import { absoluteUrl, siteConfig, socialLinks } from "@/lib/site";
import type { BreadcrumbItem } from "@/types";

type JsonLdObject = Record<string, unknown>;

export function schoolSchema(): JsonLdObject {
  const { address } = siteConfig.contact;

  return {
    "@context": "https://schema.org",
    "@type": "School",
    "@id": absoluteUrl("/#school"),
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: absoluteUrl("/icon"),
    image: absoluteUrl("/opengraph-image"),
    email: siteConfig.contact.email,
    telephone: siteConfig.contact.phone,
    foundingDate: String(siteConfig.foundingYear),
    address: {
      "@type": "PostalAddress",
      streetAddress: address.street,
      addressLocality: address.locality,
      postalCode: address.postalCode,
      addressCountry: address.country,
    },
    sameAs: socialLinks.map((link) => link.href),
  };
}

export function websiteSchema(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: "en",
    publisher: { "@id": absoluteUrl("/#school") },
  };
}

export function breadcrumbSchema(items: BreadcrumbItem[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** WebPage + BreadcrumbList for an inner page (Home › page). */
export function pageJsonLd(opts: {
  name: string;
  description: string;
  path: string;
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage";
}): JsonLdObject[] {
  return [
    webPageSchema(opts),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: opts.name, path: opts.path },
    ]),
  ];
}

export function webPageSchema(opts: {
  name: string;
  description: string;
  path: string;
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage";
}): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": opts.type ?? "WebPage",
    name: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.path),
    isPartOf: { "@id": absoluteUrl("/#website") },
    about: { "@id": absoluteUrl("/#school") },
  };
}
