// import { cacheLife, cacheTag } from "next/cache";
// import { dummyTestimonials } from "@/data/testimonials";
// import type { Testimonial } from "@/types";
// import { apiGet } from "./client";
// import { isApiConfigured, showDummyContent } from "./config";
// import { endpoints } from "./endpoints";

// interface TestimonialsResponse {
//   success?: boolean;
//   data?: { testimonials?: Partial<Testimonial>[] };
// }

// async function loadTestimonials(): Promise<Testimonial[]> {
//   "use cache";
//   cacheTag("testimonials");
//   cacheLife("minutes");

//   // Throws on failure on purpose: a thrown error is never cached.
//   const json = await apiGet<TestimonialsResponse>(endpoints.testimonials);

//   return (json.data?.testimonials ?? []).flatMap((item) =>
//     item.id && item.name && item.description
//       ? [
//           {
//             id: item.id,
//             name: item.name,
//             description: item.description,
//             profession: item.profession ?? null,
//             imageUrl: item.imageUrl ?? null,
//             srcSet: item.srcSet ?? null,
//           },
//         ]
//       : []
//   );
// }

// /**
//  * Testimonials created in the admin dashboard (newest first). Cached and
//  * refreshed in the background about once a minute. When the API is unset,
//  * unreachable or has none yet, it returns the dummy testimonials (outside
//  * production only; see `showDummyContent`) or an empty list.
//  */
// export async function getTestimonials(): Promise<Testimonial[]> {
//   const fallback = showDummyContent ? dummyTestimonials : [];

//   // No backend configured yet (early development): stay quiet.
//   if (!isApiConfigured) return fallback;

//   try {
//     const testimonials = await loadTestimonials();
//     return testimonials.length > 0 ? testimonials : fallback;
//   } catch (error) {
//     console.error("[testimonials] could not load testimonials:", error);
//     return fallback;
//   }
// }

import { cacheLife, cacheTag } from "next/cache";
import { dummyTestimonials } from "@/data/testimonials";
import type { Testimonial } from "@/types";
import { failedLife } from "./cache";
import { apiGet } from "./client";
import { isApiConfigured, showDummyContent } from "./config";
import { endpoints } from "./endpoints";

interface TestimonialsResponse {
  success?: boolean;
  data?: { testimonials?: Partial<Testimonial>[] };
}

async function fetchTestimonials(): Promise<Testimonial[]> {
  "use cache";
  cacheTag("testimonials");

  if (!isApiConfigured) {
    cacheLife("minutes");
    return [];
  }

  try {
    const json = await apiGet<TestimonialsResponse>(endpoints.testimonials);
    cacheLife("minutes");

    return (json.data?.testimonials ?? []).flatMap((item) =>
      item.id && item.name && item.description
        ? [
            {
              id: item.id,
              name: item.name,
              description: item.description,
              profession: item.profession ?? null,
              imageUrl: item.imageUrl ?? null,
              srcSet: item.srcSet ?? null,
            },
          ]
        : []
    );
  } catch (error) {
    cacheLife(failedLife);
    console.error("[testimonials] could not load testimonials:", error);
    return [];
  }
}

/**
 * Testimonials created in the admin dashboard (newest first). Cached and
 * refreshed in the background about once a minute. When the API is unset,
 * unreachable or has none yet, it returns the dummy testimonials (outside
 * production only; see `showDummyContent`) or an empty list.
 */
export async function getTestimonials(): Promise<Testimonial[]> {
  const testimonials = await fetchTestimonials();
  if (testimonials.length > 0) return testimonials;

  return showDummyContent ? dummyTestimonials : [];
}
