import { signOutGoogleAndFirebase } from '../auth/googleSignIn';
import type { LoginResult, RegisterResult, WebappUser } from '../types/api';
import { extractAuthErrorMessage } from '../utils/authErrorMessage';
import { parseEnvelope, throwIfApiError } from '../utils/apiEnvelope';
import { finalizeMobileLogin } from '../utils/mobileAuthGuard';
import apiClient, { getApiErrorMessage } from './apiClient';
import { API_ROUTES } from './apiRoutes';

export type { LoginResult };

export type LoginResponse = {
  success: boolean;
  message: string;
  data: { token?: string; user?: WebappUser } | null;
  errors: Record<string, string> | string[];
};

/** Email/password login — server enforces client-only access; token stored via Redux saga. */
export async function login(email: string, password: string): Promise<LoginResult> {
  try {
    const trimmed = email.trim();
    // Symfony json_login firewall expects `username` (user provider uses email).
    const response = await apiClient.post(API_ROUTES.login, {
      username: trimmed,
      email: trimmed,
      password,
    });
    return await finalizeMobileLogin(response.data);
  } catch (error) {
    throw new Error(extractAuthErrorMessage(error));
  }
}

export async function register(body: {
  email: string;
  password: string;
  passwordConfirm: string;
  name?: string;
}): Promise<RegisterResult> {
  try {
    const response = await apiClient.post(API_ROUTES.register, {
      email: body.email.trim(),
      password: body.password,
      passwordConfirm: body.passwordConfirm,
      name: body.name?.trim() || undefined,
    });
    const env = parseEnvelope<RegisterResult>(response.data);
    if (!env.success) {
      throw new Error(env.message || 'Registration failed');
    }
    return env.data ?? {};
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Registration failed', { authRequest: true }));
  }
}

/** Signs out Firebase/Google; caller must dispatch `authLogout()` to clear Redux. */
export async function signOutFirebase(): Promise<void> {
  await signOutGoogleAndFirebase();
}

export { getMe, updateProfile, updateProfileWithAvatar } from './profileApi';

export function parseSymfonyUser(data: WebappUser | { user?: WebappUser }): WebappUser {
  if (data && typeof data === 'object' && 'user' in data && data.user) {
    return data.user;
  }
  return data as WebappUser;
}
