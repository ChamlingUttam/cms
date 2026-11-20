import { showDummyContent } from "./config";

/**
 * Reports a failed backend request as ONE short line.
 *
 * - Development: `console.warn`. A backend that is not running locally is
 *   normal, and Next.js only turns `console.error` into the red error overlay.
 * - Production: `console.error`, so monitoring and log alerts can pick it up.
 *
 * Either way the site keeps working: it shows the dummy content (development)
 * or hides the empty section (production).
 */
export function logApiFailure(scope: string, error: unknown): void {
  const reason = error instanceof Error ? error.message : String(error);
  const outcome = showDummyContent ? "showing dummy content" : "hiding this content";
  const line = `[${scope}] backend request failed (${reason}); ${outcome}`;

  if (process.env.NODE_ENV === "production") console.error(line);
  else console.warn(line);
}
