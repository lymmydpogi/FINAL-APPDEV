import { parseEnvelope } from '../utils/apiEnvelope';
import apiClient, { getApiErrorMessage } from './apiClient';
import { API_ROUTES } from './apiRoutes';

export async function verifyEmailToken(token: string): Promise<string> {
  try {
    const response = await apiClient.get(API_ROUTES.verifyEmail(token));
    const env = parseEnvelope(response.data);
    if (!env.success) {
      throw new Error(env.message || 'Invalid or expired verification token.');
    }
    return env.message || 'Email verified successfully.';
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Email verification failed'));
  }
}
