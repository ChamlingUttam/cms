// import { cacheLife, cacheTag } from "next/cache";
// import type { Faq } from "@/types/content";
// import { apiGet, isApiConfigured } from "./client";
// import { endpoints } from "./endpoints";

// interface FaqsResponse {
//   success?: boolean;
//   data?: { faqs?: Partial<Faq>[] };
// }

// /**
//  * FAQs created in the admin dashboard.
//  *
//  * Cached with `"use cache"` (required with Cache Components) and refreshed in
//  * the background about once a minute. Returns an empty list when the API is
//  * unset, unreachable, or has no FAQs yet.
//  */
// async function fetchFaqs(): Promise<Faq[]> {
//   "use cache";
//   cacheTag("faqs");
//   cacheLife("minutes");

//   // No backend configured yet (early development): stay quiet.
//   if (!isApiConfigured) return [];

//   try {
//     const json = await apiGet<FaqsResponse>(endpoints.faqs);

//     return (json.data?.faqs ?? []).flatMap((item) =>
//       item.id && item.question && item.answer
//         ? [{ id: item.id, question: item.question, answer: item.answer }]
//         : []
//     );
//   } catch (error) {
//     console.error("[faqs] could not load FAQs:", error);
//     return [];
//   }
// }

// /**
//  * The admin's FAQs, or `fallback` (dummy content) while there are none.
//  * Each page passes its own fallback, e.g. `getFaqs(programFaqs)`.
//  */
// export async function getFaqs(fallback: Faq[]): Promise<Faq[]> {
//   const faqs = await fetchFaqs();
//   return faqs.length > 0 ? faqs : fallback;
// }
