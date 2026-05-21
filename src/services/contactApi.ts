import { parseEnvelope } from '../utils/apiEnvelope';
import apiClient, { getApiErrorMessage } from './apiClient';
import { API_ROUTES } from './apiRoutes';

export type ContactBody = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export async function submitContact(body: ContactBody) {
  try {
    const response = await apiClient.post(API_ROUTES.clientContact, body);
    const env = parseEnvelope(response.data);
    if (!env.success) {
      throw new Error(getApiErrorMessage({ response: { data: env } }, 'Could not send message'));
    }
    return env.message || 'Thanks! Your message was sent successfully.';
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Could not send message'));
  }
}
