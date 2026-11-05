import type { Testimonial } from "@/types/content";

/**
 * DUMMY CONTENT, shown only while the admin dashboard has no testimonials
 * (or the API is unreachable). As soon as a real testimonial exists, these
 * are no longer used. Delete this file and the fallback in
 * `src/lib/testimonials.ts` before launch if you prefer an empty section
 * to be hidden instead.
 */
export const dummyTestimonials: Testimonial[] = [
  {
    id: "dummy-1",
    name: "Amara Okafor",
    profession: "Parent, Primary School",
    description:
      "My daughter walks in every morning excited to learn. The teachers know her by name, her strengths and what makes her curious.",
    imageUrl: null,
    srcSet: null,
  },
  {
    id: "dummy-2",
    name: "Daniel Reyes",
    profession: "Senior School student",
    description:
      "The small classes made all the difference. I finally felt confident asking questions, and my grades and my confidence both grew.",
    imageUrl: null,
    srcSet: null,
  },
  {
    id: "dummy-3",
    name: "Priya Nair",
    profession: "Parent, Middle School",
    description:
      "From the first tour to the first day, the community was welcoming. Our son settled in within a week and has not looked back.",
    imageUrl: null,
    srcSet: null,
  },
];
