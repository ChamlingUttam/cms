// client.ts
const BASE_URL = process.env.API_URL?.replace(/\/$/, "");

/** False until `API_URL` is set; callers use their fallback content meanwhile. */
export const isApiConfigured = Boolean(BASE_URL);
export async function apiGet<T>(path: string): Promise<T> {
  if (!BASE_URL) throw new Error("API_URL is not set");

  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error(`API responded with ${response.status}`);

  return response.json() as Promise<T>;
}
