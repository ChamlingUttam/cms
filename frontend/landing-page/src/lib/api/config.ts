import "server-only";

/**
 * Validates `API_URL` once at startup. A typo must not crash the site:
 * log it clearly and behave as "API not configured".
 */
function resolveBaseUrl(): string | undefined {
  const raw = process.env.API_URL?.trim();
  if (!raw) return undefined;

  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error("not http(s)");
    }

    const isLocal = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
    if (process.env.NODE_ENV === "production" && url.protocol === "http:" && !isLocal) {
      console.warn(
        "[api] API_URL uses plain http in production. Use https unless the backend is on a private network.",
      );
    }

    return `${url.origin}${url.pathname.replace(/\/$/, "")}`;
  } catch {
    console.error(`[api] API_URL is not a valid http(s) URL: "${raw}". Ignoring it.`);
    return undefined;
  }
}

/** Backend address, e.g. "https://api.example.com". Server-only (never exposed to the browser). */
export const API_BASE_URL = resolveBaseUrl();

/** False until `API_URL` is set to a valid URL. */
export const isApiConfigured = API_BASE_URL !== undefined;

/**
 * Dummy content (sample testimonials/FAQs) is shown only outside production,
 * so a live site never displays made-up content if the backend is empty or down.
 * Set `SHOW_DUMMY_CONTENT=true` to force it on, e.g. for a staging demo.
 */
export const showDummyContent =
  process.env.NODE_ENV !== "production" || process.env.SHOW_DUMMY_CONTENT === "true";
