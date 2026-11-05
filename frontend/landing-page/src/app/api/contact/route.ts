import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/site";
import { validateContact } from "@/lib/validation";

// export const runtime = "nodejs";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const MAX_BODY_BYTES = 10_000;

/**
 * Best-effort, per-instance rate limit. On serverless or multi-instance
 * deployments use a shared store (Redis/Upstash) or your platform's WAF.
 */
const hits = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(key: string): boolean {
  const now = Date.now();

  for (const [ip, entry] of hits) {
    if (entry.resetAt <= now) hits.delete(ip);
  }

  const entry = hits.get(key);
  if (!entry) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > MAX_REQUESTS;
}

function json(
  body: Record<string, unknown>,
  status = 200,
  headers?: HeadersInit
) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });
}

export async function POST(request: Request) {
  const forwarded = request.headers
    .get("x-forwarded-for")
    ?.split(",")[0]
    ?.trim();
  const ip = forwarded || request.headers.get("x-real-ip") || "unknown";

  if (isRateLimited(ip)) {
    return json(
      {
        message:
          "Too many enquiries from this connection. Please try again later.",
      },
      429,
      { "Retry-After": String(WINDOW_MS / 1000) }
    );
  }

  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > MAX_BODY_BYTES) {
    return json({ message: "Your message is too large." }, 413);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ message: "Invalid request." }, 400);
  }

  const result = validateContact(body);
  if (!result.ok) {
    return json(
      {
        message: "Please check the highlighted fields.",
        errors: result.errors,
      },
      422
    );
  }

  const { website, ...enquiry } = result.data;

  // Honeypot filled in: pretend success so bots learn nothing.
  if (website) return json({ ok: true });

  const webhookUrl = process.env.CONTACT_WEBHOOK_URL;

  if (!webhookUrl) {
    if (process.env.NODE_ENV === "production") {
      console.error(
        "[contact] CONTACT_WEBHOOK_URL is not set; enquiry was not delivered."
      );
      return json(
        {
          message: `Our enquiry form is temporarily unavailable. Please email ${siteConfig.contact.email}.`,
        },
        503
      );
    }
    console.info("[contact] enquiry (dev only, not delivered):", enquiry);
    return json({ ok: true });
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: siteConfig.url,
        receivedAt: new Date().toISOString(),
        ...enquiry,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok)
      throw new Error(`Webhook responded with ${response.status}`);
  } catch (error) {
    console.error("[contact] failed to forward enquiry:", error);
    return json(
      {
        message: `We couldn’t send your message just now. Please email ${siteConfig.contact.email}.`,
      },
      502
    );
  }

  return json({ ok: true });
}
