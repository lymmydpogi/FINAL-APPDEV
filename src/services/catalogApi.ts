import { throwIfApiError } from '../utils/apiEnvelope';
import apiClient, { getApiErrorMessage } from './apiClient';
import { API_ROUTES } from './apiRoutes';

/** @deprecated Use fetchActiveServices from servicesApi.ts */
export function toApiList<T>(raw: unknown): T[] {
  if (Array.isArray(raw)) {
    return raw as T[];
  }
  if (raw && typeof raw === 'object') {
    const o = raw as Record<string, unknown>;
    if (Array.isArray(o['hydra:member'])) {
      return o['hydra:member'] as T[];
    }
    if (Array.isArray(o.member)) {
      return o.member as T[];
    }
  }
  return [];
}

/** @deprecated Use fetchActiveServices from servicesApi.ts */
export async function getServices() {
  try {
    const response = await apiClient.get(API_ROUTES.clientServices);
    const data = throwIfApiError<{ services: unknown[] }>(response.data);
    return data.services ?? [];
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Could not load services'));
  }
}
