import { friendlyAuthMessage } from '../constants/mobileAuth';
import { getApiErrorMessage } from '../services/apiClient';

/** API message → friendly copy for login, register, and Google sign-in. */
export function extractAuthErrorMessage(
  error: unknown,
  fallback = "We couldn't sign you in. Please try again.",
): string {
  const raw = getApiErrorMessage(error, fallback, { authRequest: true });
  return friendlyAuthMessage(raw, fallback);
}

/** API message → friendly copy for profile load/save and other client screens. */
export function extractProfileErrorMessage(
  error: unknown,
  fallback = "We couldn't update your profile. Please try again.",
): string {
  const raw = getApiErrorMessage(error, fallback);
  return friendlyAuthMessage(raw, fallback);
}
