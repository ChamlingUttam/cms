import { cacheLife, cacheTag } from "next/cache";
import type { Faq } from "@/types";
import { failedLife } from "./cache";
import { apiGet } from "./client";
import { logApiFailure } from "./log";
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
    logApiFailure("faqs", error);
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
