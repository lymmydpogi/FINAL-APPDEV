import axios from 'axios';

import { errorsToMap, parseEnvelope } from '../utils/apiEnvelope';

/** Thrown for order API failures — preserves HTTP status and field errors from envelope */
export class OrderApiError extends Error {
  readonly status?: number;
  readonly fieldErrors: Record<string, string>;

  constructor(message: string, status?: number, fieldErrors: Record<string, string> = {}) {
    super(message);
    this.name = 'OrderApiError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

export function parseOrderApiError(error: unknown, fallback = 'Request failed'): OrderApiError {
  if (error instanceof OrderApiError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data;

    if (data && typeof data === 'object' && 'success' in data) {
      const env = parseEnvelope(data);
      const fieldErrors = errorsToMap(env.errors);
      const firstField = Object.values(fieldErrors)[0];
      const message = firstField || env.message || fallback;

      return new OrderApiError(message, status, fieldErrors);
    }

    if (status === 401) {
      return new OrderApiError('Your session expired. Please sign in again.', 401);
    }

    return new OrderApiError(
      (typeof data === 'object' && data && 'message' in data && typeof (data as { message: string }).message === 'string'
        ? (data as { message: string }).message
        : error.message) || fallback,
      status,
    );
  }

  if (error instanceof Error) {
    return new OrderApiError(error.message);
  }

  return new OrderApiError(fallback);
}
