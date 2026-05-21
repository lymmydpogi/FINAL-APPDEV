import { parseEnvelope } from '../utils/apiEnvelope';

/** Read JWT from login response (envelope or Lexik plain). */
export function extractAuthToken(data: unknown): string | null {
  const env = parseEnvelope<{ token?: string; access_token?: string }>(data);
  const fromEnv = env.data?.token ?? env.data?.access_token;
  if (fromEnv) {
    return fromEnv;
  }

  if (!data || typeof data !== 'object') {
    return null;
  }
  const body = data as Record<string, unknown>;
  if (typeof body.token === 'string') {
    return body.token;
  }
  if (typeof body.access_token === 'string') {
    return body.access_token;
  }
  return null;
}
