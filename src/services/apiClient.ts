import axios, { AxiosError } from 'axios';

import { isMobileAccessDeniedMessage } from '../constants/mobileAuth';
import { selectAuthToken } from '../store/storeRef';
import { errorsToMap, parseEnvelope } from '../utils/apiEnvelope';
import { API_BASE_URL } from './config';

let onUnauthorized: (() => void) | null = null;
let onAccessDenied: ((message: string) => void) | null = null;

export function setOnUnauthorized(handler: (() => void) | null) {
  onUnauthorized = handler;
}

export function setOnAccessDenied(handler: ((message: string) => void) | null) {
  onAccessDenied = handler;
}

export function envelopeMessageFromResponseData(data: unknown): string | null {
  if (data && typeof data === 'object' && 'message' in data) {
    const msg = (data as { message?: unknown }).message;
    if (typeof msg === 'string' && msg.trim()) {
      return msg.trim();
    }
  }
  return null;
}

const PUBLIC_PATHS = [
  '/api/login',
  '/api/register',
  '/api/auth/google',
  '/api/verify-email',
  '/api/client/contact',
  '/api/client/services',
];

function isPublicPath(url?: string): boolean {
  if (!url) {
    return false;
  }
  return PUBLIC_PATHS.some(p => url.includes(p));
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 20000,
});

apiClient.interceptors.request.use(config => {
  const path = config.url ?? '';
  if (!isPublicPath(path)) {
    const token = selectAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

apiClient.interceptors.response.use(
  r => r,
  error => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const apiMessage = envelopeMessageFromResponseData(error.response?.data);

      if (status === 403 && apiMessage && isMobileAccessDeniedMessage(apiMessage)) {
        onAccessDenied?.(apiMessage);
        return Promise.reject(error);
      }

      if (status === 401) {
        const path = error.config?.url ?? '';
        const isLoginAttempt = path.includes('/api/login') || path.includes('/api/auth/google');
        if (!isLoginAttempt) {
          onUnauthorized?.();
        }
      }
    }
    return Promise.reject(error);
  },
);

export type ApiErrorMessageOptions = {
  /** Login/register/Google — use API message for 401, not session-expired copy. */
  authRequest?: boolean;
};

export function getApiErrorMessage(
  error: unknown,
  fallback = 'Request failed',
  options?: ApiErrorMessageOptions,
): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    const apiMessage = envelopeMessageFromResponseData(data);
    if (apiMessage) {
      return apiMessage;
    }
    if (data && typeof data === 'object' && 'success' in data) {
      const env = parseEnvelope(data);
      const map = errorsToMap(env.errors);
      const first = Object.values(map)[0];
      if (first) {
        return first;
      }
      if (env.message) {
        return env.message;
      }
    }
    const axErr = error as AxiosError<{ message?: string; detail?: string }>;
    if (axErr.response?.status === 401 && !options?.authRequest) {
      return 'Your session expired. Please sign in again.';
    }
    if (typeof axErr.response?.data?.message === 'string') {
      return axErr.response.data.message;
    }
    if (typeof axErr.response?.data?.detail === 'string') {
      return axErr.response.data.detail;
    }
    if (!axErr.response) {
      const hint =
        ' Cannot reach the API. Start Symfony (symfony serve), use the emulator URL http://10.0.2.2:8000, or set your PC LAN IP in src/services/config.ts for a physical device.';
      if (axErr.message === 'Network Error' || axErr.code === 'ECONNABORTED') {
        return (axErr.message || 'Network error') + hint;
      }
    }
    return axErr.message || fallback;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}

export default apiClient;
