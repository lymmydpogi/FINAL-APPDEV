import { extractAuthErrorMessage } from '../utils/authErrorMessage';
import { finalizeMobileLogin } from '../utils/mobileAuthGuard';
import apiClient from './apiClient';
import { API_ROUTES } from './apiRoutes';
import type { LoginResult } from '../types/api';

/**
 * Exchange Google OAuth idToken for Symfony JWT.
 * Same mobile access rules as email login (staff/admin blocked).
 */
export async function loginWithGoogleIdToken(googleIdToken: string): Promise<LoginResult> {
  try {
    const response = await apiClient.post(API_ROUTES.authGoogle, { idToken: googleIdToken });
    return await finalizeMobileLogin(response.data);
  } catch (error) {
    throw new Error(
      extractAuthErrorMessage(
        error,
        "Couldn't sign in with Google. Try again or use your email instead.",
      ),
    );
  }
}
