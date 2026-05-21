/** Exact WEBAPP API messages — used for matching, not always shown to users. */
export const MSG_INVALID_CREDENTIALS = 'Invalid email or password.';
export const MSG_ACCOUNT_INACTIVE = 'Your account is currently inactive. Please contact support.';
export const MSG_STAFF_LOGIN = 'Staff accounts are not allowed to access the mobile app yet.';
export const MSG_ADMIN_LOGIN = 'Admin accounts must use the web app.';
export const MSG_STAFF_API = 'Staff accounts are not allowed to access mobile app features yet.';
export const MSG_ADMIN_API = 'Admin accounts must use the web app.';
export const MSG_NOT_ALLOWED_MOBILE = 'This account is not allowed to use the mobile app.';

const ACCESS_DENIED_MESSAGES = new Set([
  MSG_ACCOUNT_INACTIVE,
  MSG_STAFF_LOGIN,
  MSG_ADMIN_LOGIN,
  MSG_STAFF_API,
  MSG_ADMIN_API,
  MSG_NOT_ALLOWED_MOBILE,
]);

const FRIENDLY_AUTH_MESSAGES: Record<string, string> = {
  [MSG_INVALID_CREDENTIALS]: 'Incorrect email or password. Please try again.',
  [MSG_STAFF_LOGIN]: 'This app is for clients. Team accounts should sign in on the Campana website.',
  [MSG_STAFF_API]: 'This app is for clients. Team accounts should sign in on the Campana website.',
  [MSG_ADMIN_LOGIN]: 'This app is for clients. Please sign in on the Campana website instead.',
  [MSG_ACCOUNT_INACTIVE]: "Your account isn't active right now. Contact support if you need help.",
  [MSG_NOT_ALLOWED_MOBILE]: "This account can't be used here. Contact support if you need help.",
};

function isSymfonyRoleAccessDenied(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes('access denied') &&
    (lower.includes('role_client') ||
      lower.includes('role_user') ||
      /role_[a-z_]+/.test(lower))
  );
}

export function isMobileAccessDeniedMessage(message: string): boolean {
  const trimmed = message.trim();
  return ACCESS_DENIED_MESSAGES.has(trimmed) || isSymfonyRoleAccessDenied(trimmed);
}

/** User-facing copy for login, Google sign-in, and session errors. */
export function friendlyAuthMessage(
  apiMessage: string,
  fallback = "We couldn't sign you in. Please try again.",
): string {
  const trimmed = apiMessage.trim();
  if (!trimmed) {
    return fallback;
  }

  if (trimmed === MSG_ADMIN_API) {
    return FRIENDLY_AUTH_MESSAGES[MSG_ADMIN_LOGIN];
  }

  const mapped = FRIENDLY_AUTH_MESSAGES[trimmed];
  if (mapped) {
    return mapped;
  }

  const lower = trimmed.toLowerCase();
  if (isSymfonyRoleAccessDenied(trimmed)) {
    return 'This app is for clients. Please sign in on the Campana website instead.';
  }
  if (lower.includes('access denied')) {
    return "You don't have access to this app. Please sign in on the Campana website instead.";
  }
  if (lower.includes('network error') || lower.includes('cannot reach the api')) {
    return "We can't connect right now. Check your internet and try again.";
  }
  if (lower.includes('session expired') || lower.includes('unauthorized')) {
    return 'Please sign in again to continue.';
  }
  if (trimmed.includes('must be provided') || trimmed.includes('Invalid JSON')) {
    return 'Please check your email and password.';
  }
  if (lower.includes('google sign-in') || lower.includes('google')) {
    return "Couldn't sign in with Google. Try again or use your email instead.";
  }
  if (lower.includes('login failed') || lower.includes('sign-in failed')) {
    return fallback;
  }
  if (trimmed.length > 100 || lower.includes('role_')) {
    return fallback;
  }

  return trimmed;
}
