import { isAxiosError } from 'axios';

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (
    isAxiosError<{ message?: string }>(error) &&
    typeof error.response?.data.message === 'string'
  ) {
    return error.response.data.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
