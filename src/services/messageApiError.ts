import axios from 'axios';

import { errorsToMap, parseEnvelope } from '../utils/apiEnvelope';

export class MessageApiError extends Error {
  readonly status?: number;
  readonly fieldErrors: Record<string, string>;

  constructor(message: string, status?: number, fieldErrors: Record<string, string> = {}) {
    super(message);
    this.name = 'MessageApiError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

export function parseMessageApiError(error: unknown, fallback = 'Request failed'): MessageApiError {
  if (error instanceof MessageApiError) {
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
      return new MessageApiError(message, status, fieldErrors);
    }

    if (status === 401) {
      return new MessageApiError('Your session expired. Please sign in again.', 401);
    }

    return new MessageApiError(
      (typeof data === 'object' && data && 'message' in data && typeof (data as { message: string }).message === 'string'
        ? (data as { message: string }).message
        : error.message) || fallback,
      status,
    );
  }

  if (error instanceof Error) {
    return new MessageApiError(error.message);
  }

  return new MessageApiError(fallback);
}
