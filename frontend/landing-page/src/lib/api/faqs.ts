// import { cacheLife, cacheTag } from "next/cache";
// import type { Faq } from "@/types";
// import { apiGet } from "./client";
// import { isApiConfigured, showDummyContent } from "./config";
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
// async function loadFaqs(): Promise<Faq[]> {
//   "use cache";
//   cacheTag("faqs");
//   cacheLife("minutes");

//   // Throws on failure on purpose: a thrown error is never cached.
//   const json = await apiGet<FaqsResponse>(endpoints.faqs);

//   return (json.data?.faqs ?? []).flatMap((item) =>
//     item.id && item.question && item.answer
//       ? [{ id: item.id, question: item.question, answer: item.answer }]
//       : []
//   );
// }

// async function fetchFaqs(): Promise<Faq[]> {
//   // No backend configured yet (early development): stay quiet.
//   if (!isApiConfigured) return [];

//   try {
//     return await loadFaqs();
//   } catch (error) {
//     console.error("[faqs] could not load FAQs:", error);
//     return [];
//   }
// }

// /**
//  * The admin's FAQs. While there are none, `fallback` (dummy content) is
//  * returned outside production; in production an empty list hides the section.
//  * Each page passes its own fallback, e.g. `getFaqs(programFaqs)`.
//  */
// export async function getFaqs(fallback: Faq[]): Promise<Faq[]> {
//   const faqs = await fetchFaqs();
//   if (faqs.length > 0) return faqs;
//   return showDummyContent ? fallback : [];
// }

import { cacheLife, cacheTag } from "next/cache";
import type { Faq } from "@/types";
import { failedLife } from "./cache";
import { apiGet } from "./client";
import { isApiConfigured, showDummyContent } from "./config";
import { endpoints } from "./endpoints";

interface FaqsResponse {
  success?: boolean;
  data?: { faqs?: Partial<Faq>[] };
}

/**
 * FAQs created in the admin dashboard.
 *
 * Cached with `"use cache"` (required with Cache Components) and refreshed in
 * the background about once a minute (a failed request: every 5 seconds).
 * Returns an empty list when the API is unset, unreachable, or has no FAQs yet.
 */
async function fetchFaqs(): Promise<Faq[]> {
  "use cache";
  cacheTag("faqs");

  // No backend configured yet (early development): stay quiet.
  if (!isApiConfigured) {
    cacheLife("minutes");
    return [];
  }

  try {
    const json = await apiGet<FaqsResponse>(endpoints.faqs);
    cacheLife("minutes");

    return (json.data?.faqs ?? []).flatMap((item) =>
      item.id && item.question && item.answer
        ? [{ id: item.id, question: item.question, answer: item.answer }]
        : []
    );
  } catch (error) {
    cacheLife(failedLife);
    console.error("[faqs] could not load FAQs:", error);
    return [];
  }
}

/**
 * The admin's FAQs. While there are none, `fallback` (dummy content) is
 * returned outside production; in production an empty list hides the section.
 * Each page passes its own fallback, e.g. `getFaqs(programFaqs)`.
 */
export async function getFaqs(fallback: Faq[]): Promise<Faq[]> {
  const faqs = await fetchFaqs();
  if (faqs.length > 0) return faqs;
  return showDummyContent ? fallback : [];
}
