import { cacheLife, cacheTag } from "next/cache";
import { dummyTestimonials } from "@/data/testimonials";
import type { Testimonial } from "@/types/content";
import { apiGet, isApiConfigured } from "./client";
import { endpoints } from "./endpoints";

interface TestimonialsResponse {
  success?: boolean;
  data?: { testimonials?: Partial<Testimonial>[] };
}

/**
 * Testimonials created in the admin dashboard (newest first).
 *
 * Cached with `"use cache"` (required with Cache Components) and refreshed
 * in the background about once a minute. Falls back to the dummy
 * testimonials when the API is unset, unreachable, or has none yet.
 */
export async function getTestimonials(): Promise<Testimonial[]> {
  "use cache";
  cacheTag("testimonials");
  cacheLife("minutes");
  // No backend configured yet (early development): use the dummy content quietly.
  if (!isApiConfigured) return dummyTestimonials;

  try {
    const json = await apiGet<TestimonialsResponse>(endpoints.testimonials);

    const testimonials = (json.data?.testimonials ?? []).flatMap((item) =>
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

    return testimonials.length > 0 ? testimonials : dummyTestimonials;
  } catch (error) {
    console.error("[testimonials] could not load testimonials:", error);
    return dummyTestimonials;
  }
}
