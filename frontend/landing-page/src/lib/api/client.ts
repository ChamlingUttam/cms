// // client.ts
// const BASE_URL = process.env.API_URL?.replace(/\/$/, "");

// /** False until `API_URL` is set; callers use their fallback content meanwhile. */
// export const isApiConfigured = Boolean(BASE_URL);
// export async function apiGet<T>(path: string): Promise<T> {
//   if (!BASE_URL) throw new Error("API_URL is not set");

//   const response = await fetch(`${BASE_URL}${path}`, {
//     headers: { Accept: "application/json" },
//     signal: AbortSignal.timeout(8000),
//   });
//   if (!response.ok) throw new Error(`API responded with ${response.status}`);

//   return response.json() as Promise<T>;
// }

import "server-only";
import axios, { isAxiosError } from "axios";
import { API_BASE_URL } from "./config";

/**
 * Landing-page counterpart of the admin dashboard's `apiClient`:
 * same axios setup, but server-only and without a login token, because
 * the landing page only reads public endpoints.
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    Accept: "application/json",
  },
});

export class ApiError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = "ApiError";
  }
}

const RETRYABLE_STATUSES = new Set([408, 425, 429, 500, 502, 503, 504]);
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * GET a public endpoint and return its JSON body.
 * Retries once on network errors, timeouts and 5xx/429 responses;
 * other 4xx responses and non-JSON bodies fail immediately.
 */
export async function apiGet<T>(
  path: string,
  { retries = 1 }: { retries?: number } = {}
): Promise<T> {
  if (!API_BASE_URL) throw new ApiError("API_URL is not configured");

  for (let attempt = 0; ; attempt++) {
    try {
      const { data } = await apiClient.get<T>(path);

      if (typeof data !== "object" || data === null) {
        throw new ApiError(`GET ${path} did not return JSON`);
      }
      return data;
    } catch (error) {
      const status = isAxiosError(error) ? error.response?.status : undefined;
      const retryable =
        isAxiosError(error) &&
        (status === undefined || RETRYABLE_STATUSES.has(status));

      if (retryable && attempt < retries) {
        await wait(300 * 2 ** attempt);
        continue;
      }

      if (error instanceof ApiError) throw error;
      throw new ApiError(
        `GET ${path} failed: ${
          status ??
          (isAxiosError(error) ? error.code : undefined) ??
          "unknown error"
        }`,
        status
      );
    }
  }
}
