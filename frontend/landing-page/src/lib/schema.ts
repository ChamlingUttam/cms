// import { absoluteUrl, siteConfig, socialLinks } from "@/lib/site";
// import type { Blog, BreadcrumbItem, ContactInfo, Faq } from "@/types";

// type JsonLdObject = Record<string, unknown>;

// export function schoolSchema(contact: ContactInfo): JsonLdObject {
//   return {
//     "@context": "https://schema.org",
//     "@type": "School",
//     "@id": absoluteUrl("/#school"),
//     name: siteConfig.name,
//     description: siteConfig.description,
//     url: siteConfig.url,
//     logo: absoluteUrl("/icon"),
//     image: absoluteUrl("/opengraph-image"),
//     ...(contact.email ? { email: contact.email } : {}),
//     ...(contact.phoneNo ? { telephone: contact.phoneNo } : {}),
//     foundingDate: String(siteConfig.foundingYear),
//     // The admin stores the address as a single line.
//     ...(contact.address
//       ? {
//           address: {
//             "@type": "PostalAddress",
//             streetAddress: contact.address,
//             addressCountry: siteConfig.contact.address.country,
//           },
//         }
//       : {}),
//     sameAs: socialLinks.map((link) => link.href),
//   };
// }

// export function websiteSchema(): JsonLdObject {
//   return {
//     "@context": "https://schema.org",
//     "@type": "WebSite",
//     "@id": absoluteUrl("/#website"),
//     name: siteConfig.name,
//     url: siteConfig.url,
//     inLanguage: "en",
//     publisher: { "@id": absoluteUrl("/#school") },
//   };
// }

// export function breadcrumbSchema(items: BreadcrumbItem[]): JsonLdObject {
//   return {
//     "@context": "https://schema.org",
//     "@type": "BreadcrumbList",
//     itemListElement: items.map((item, index) => ({
//       "@type": "ListItem",
//       position: index + 1,
//       name: item.name,
//       item: absoluteUrl(item.path),
//     })),
//   };
// }

// /** WebPage + BreadcrumbList for an inner page (Home › page). */
// export function pageJsonLd(opts: {
//   name: string;
//   description: string;
//   path: string;
//   type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage";
// }): JsonLdObject[] {
//   return [
//     webPageSchema(opts),
//     breadcrumbSchema([
//       { name: "Home", path: "/" },
//       { name: opts.name, path: opts.path },
//     ]),
//   ];
// }

// export function webPageSchema(opts: {
//   name: string;
//   description: string;
//   path: string;
//   type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage";
// }): JsonLdObject {
//   return {
//     "@context": "https://schema.org",
//     "@type": opts.type ?? "WebPage",
//     name: opts.name,
//     description: opts.description,
//     url: absoluteUrl(opts.path),
//     isPartOf: { "@id": absoluteUrl("/#website") },
//     about: { "@id": absoluteUrl("/#school") },
//   };
// }

// export function faqSchema(faqs: Faq[]): JsonLdObject {
//   return {
//     "@context": "https://schema.org",
//     "@type": "FAQPage",
//     mainEntity: faqs.map((faq) => ({
//       "@type": "Question",
//       name: faq.question,
//       acceptedAnswer: { "@type": "Answer", text: faq.answer },
//     })),
//   };
// }

// /** BlogPosting + breadcrumbs for a single blog (Home › Blog › post). */
// export function postJsonLd(blog: Blog): JsonLdObject[] {
//   const path = `/blog/${blog.slug}`;

//   return [
//     {
//       "@context": "https://schema.org",
//       "@type": "BlogPosting",
//       headline: blog.name,
//       description: blog.shortDescription || blog.longDescription.slice(0, 160),
//       ...(blog.imageUrl ? { image: blog.imageUrl } : {}),
//       ...(blog.createdAt ? { datePublished: blog.createdAt } : {}),
//       ...(blog.updatedAt || blog.createdAt
//         ? { dateModified: blog.updatedAt || blog.createdAt }
//         : {}),
//       // The admin has no author field, so the school is the author.
//       author: { "@id": absoluteUrl("/#school") },
//       publisher: { "@id": absoluteUrl("/#school") },
//       mainEntityOfPage: absoluteUrl(path),
//     },
//     breadcrumbSchema([
//       { name: "Home", path: "/" },
//       { name: "Blog", path: "/blog" },
//       { name: blog.name, path },
//     ]),
//   ];
// }

import { splitList } from "@/lib/format";
import { absoluteUrl, siteConfig, socialLinks } from "@/lib/site";
import type { Blog, BreadcrumbItem, ContactInfo, Faq } from "@/types";

type JsonLdObject = Record<string, unknown>;

/** One value stays a string; several become an array (both are valid schema.org). */
const oneOrMany = (list: string[]) => (list.length === 1 ? list[0] : list);

export function schoolSchema(contact: ContactInfo): JsonLdObject {
  const emails = splitList(contact.email);
  const phones = splitList(contact.phoneNo);

  return {
    "@context": "https://schema.org",
    "@type": "School",
    "@id": absoluteUrl("/#school"),
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: absoluteUrl("/icon"),
    image: absoluteUrl("/opengraph-image"),
    ...(emails.length ? { email: oneOrMany(emails) } : {}),
    ...(phones.length ? { telephone: oneOrMany(phones) } : {}),
    foundingDate: String(siteConfig.foundingYear),
    // The admin stores the address as a single line.
    ...(contact.address
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: contact.address,
            addressCountry: siteConfig.contact.address.country,
          },
        }
      : {}),
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

export function faqSchema(faqs: Faq[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

/** BlogPosting + breadcrumbs for a single blog (Home › Blog › post). */
export function postJsonLd(blog: Blog): JsonLdObject[] {
  const path = `/blog/${blog.slug}`;

  return [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: blog.name,
      description: blog.shortDescription || blog.longDescription.slice(0, 160),
      ...(blog.imageUrl ? { image: blog.imageUrl } : {}),
      ...(blog.createdAt ? { datePublished: blog.createdAt } : {}),
      ...(blog.updatedAt || blog.createdAt
        ? { dateModified: blog.updatedAt || blog.createdAt }
        : {}),
      // The admin has no author field, so the school is the author.
      author: { "@id": absoluteUrl("/#school") },
      publisher: { "@id": absoluteUrl("/#school") },
      mainEntityOfPage: absoluteUrl(path),
    },
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
      { name: blog.name, path },
    ]),
  ];
}
