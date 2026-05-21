import type { ServiceItem } from '../types/api';
import { throwIfApiError } from '../utils/apiEnvelope';
import apiClient, { getApiErrorMessage } from './apiClient';
import { API_ROUTES } from './apiRoutes';

/** All services from catalog (active and inactive) — do not filter on the client. */
export async function fetchClientServices(): Promise<ServiceItem[]> {
  try {
    const response = await apiClient.get(API_ROUTES.clientServices);
    const data = throwIfApiError<{ services: ServiceItem[] }>(response.data);
    return data.services ?? [];
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Could not load services'));
  }
}

/** @deprecated Use fetchClientServices */
export const fetchActiveServices = fetchClientServices;

export async function fetchServiceBySlug(slug: string): Promise<ServiceItem> {
  try {
    const response = await apiClient.get(API_ROUTES.clientServiceBySlug(slug));
    const data = throwIfApiError<{ service: ServiceItem }>(response.data);
    if (!data.service) {
      throw new Error('Service not found.');
    }
    return data.service;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Could not load service'));
  }
}
