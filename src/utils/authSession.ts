import type { WebappUser } from '../types/api';
import type { SessionPayload } from '../types/redux';

export function getUserFromSession(data: SessionPayload | null): WebappUser | null {
  return data?.user ?? null;
}

export function getSessionRoles(data: SessionPayload | null): string[] {
  const user = getUserFromSession(data);
  return user?.roles ?? [];
}

export function hasRoleClient(data: SessionPayload | null): boolean {
  const roles = getSessionRoles(data);
  return roles.includes('ROLE_CLIENT');
}

/** Symfony JWT session with ROLE_CLIENT (website client area). */
export function isClientAuthenticated(data: SessionPayload | null): boolean {
  if (!data || data.provider !== 'symfony' || !data.token) {
    return false;
  }
  const roles = getSessionRoles(data);
  if (roles.includes('ROLE_ADMIN') || roles.includes('ROLE_STAFF')) {
    return false;
  }
  if (roles.length === 0) {
    return true;
  }
  return roles.includes('ROLE_CLIENT') || roles.includes('ROLE_USER');
}

export function needsEmailVerification(data: SessionPayload | null): boolean {
  if (!isClientAuthenticated(data)) {
    return false;
  }
  const user = getUserFromSession(data);
  return user?.isVerified === false;
}

/** @deprecated Use isClientAuthenticated */
export function isSymfonyClientSession(data: SessionPayload | null): boolean {
  return isClientAuthenticated(data);
}
