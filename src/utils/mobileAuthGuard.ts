import { extractAuthToken } from '../api/authToken';
import {
  MSG_ADMIN_LOGIN,
  MSG_INVALID_CREDENTIALS,
  MSG_NOT_ALLOWED_MOBILE,
  MSG_STAFF_LOGIN,
} from '../constants/mobileAuth';
import { fetchMeWithToken } from '../services/profileApi';
import type { LoginResult, WebappUser } from '../types/api';
import { parseEnvelope } from './apiEnvelope';

const MOBILE_ALLOWED_ROLES = new Set(['ROLE_CLIENT', 'ROLE_USER']);

export function assertMobileClientAccess(user: WebappUser): void {
  const roles = user.roles ?? [];

  if (roles.includes('ROLE_ADMIN')) {
    throw new Error(MSG_ADMIN_LOGIN);
  }
  if (roles.includes('ROLE_STAFF')) {
    throw new Error(MSG_STAFF_LOGIN);
  }

  const hasAllowed = roles.some(r => MOBILE_ALLOWED_ROLES.has(r));
  if (roles.length > 0 && !hasAllowed) {
    throw new Error(MSG_NOT_ALLOWED_MOBILE);
  }
}

function rejectLexikAuthFailure(raw: unknown): void {
  if (!raw || typeof raw !== 'object') {
    return;
  }
  const body = raw as Record<string, unknown>;
  if ('success' in body && body.success === false) {
    throw new Error(String(body.message ?? MSG_INVALID_CREDENTIALS));
  }
  const code = body.code ?? body.status;
  if ((code === 401 || code === '401') && !extractAuthToken(raw)) {
    throw new Error(
      typeof body.message === 'string' ? body.message : MSG_INVALID_CREDENTIALS,
    );
  }
}

/**
 * Parse login / Google response (WEBAPP envelope or Lexik JWT).
 * Loads /api/me when needed so staff/admin are blocked with the correct API message.
 */
export async function finalizeMobileLogin(raw: unknown): Promise<LoginResult> {
  rejectLexikAuthFailure(raw);

  const env = parseEnvelope<{ token?: string; user?: WebappUser }>(raw);

  if ('success' in (raw as object) && !env.success) {
    throw new Error(env.message || 'Login failed. Please try again.');
  }

  const token = env.data?.token ?? extractAuthToken(raw);
  if (!token) {
    throw new Error(env.message || 'Login failed. Please try again.');
  }

  let user = env.data?.user;
  if (!user?.email) {
    user = await fetchMeWithToken(token);
  }

  assertMobileClientAccess(user);
  return { token, user };
}
