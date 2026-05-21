import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import {
  GoogleSignin,
  isCancelledResponse,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';

import { FIREBASE_GOOGLE_WEB_CLIENT_ID } from './googleWebClientId';

export { statusCodes };

export type GoogleSignInResult = {
  /** OAuth id token from Google Sign-In — send this to Symfony POST /api/auth/google */
  googleIdToken: string;
  credential: FirebaseAuthTypes.UserCredential;
};

let configured = false;

function ensureGoogleSignInConfigured(): void {
  if (configured) {
    return;
  }
  const webClientId = FIREBASE_GOOGLE_WEB_CLIENT_ID?.trim();
  if (!webClientId) {
    throw new Error('Missing Google Web OAuth client ID in googleWebClientId.ts');
  }

  GoogleSignin.configure({
    webClientId,
    offlineAccess: false,
  });
  configured = true;
}

export function initializeGoogleSignIn(): void {
  try {
    ensureGoogleSignInConfigured();
  } catch (e) {
    console.error('[GoogleSignIn] initialize failed:', e);
  }
}

function mapGoogleSignInError(error: unknown): Error {
  if (isErrorWithCode(error)) {
    switch (error.code) {
      case statusCodes.SIGN_IN_CANCELLED:
        return Object.assign(new Error(''), { code: statusCodes.SIGN_IN_CANCELLED });
      case statusCodes.IN_PROGRESS:
        return new Error('Google sign-in is already in progress. Please wait.');
      case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
        return new Error('Google Play Services is not available on this device.');
      default:
        if (String(error.code) === '10' || error.message?.includes('DEVELOPER_ERROR')) {
          return new Error(
            'Google Sign-In is not configured for this build. Add your app SHA-1 in Firebase (Project settings → Android app com.appdev), then rebuild.',
          );
        }
        if (error.message) {
          return new Error(error.message);
        }
    }
  }
  if (error instanceof Error) {
    return error;
  }
  return new Error('Google sign-in failed');
}

/**
 * Native Google Sign-In → Firebase session (optional) + Google OAuth idToken for Symfony.
 * WEBAPP verifies the **Google** id token (tokeninfo), not the Firebase JWT.
 */
export async function signInWithGoogle(): Promise<GoogleSignInResult> {
  ensureGoogleSignInConfigured();

  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

  try {
    const signInResult = await GoogleSignin.signIn();

    if (isCancelledResponse(signInResult)) {
      const err = new Error('User cancelled Google sign-in');
      (err as { code?: string }).code = statusCodes.SIGN_IN_CANCELLED;
      throw err;
    }

    if (!isSuccessResponse(signInResult)) {
      throw new Error('Unexpected Google sign-in response');
    }

    let googleIdToken = signInResult.data.idToken;
    if (!googleIdToken) {
      const tokens = await GoogleSignin.getTokens();
      googleIdToken = tokens.idToken;
    }

    if (!googleIdToken) {
      throw new Error(
        'Google Sign-In returned no idToken. Set the Web OAuth client ID in src/auth/googleWebClientId.ts (same as WEBAPP GOOGLE_CLIENT_ID).',
      );
    }

    const googleCredential = auth.GoogleAuthProvider.credential(googleIdToken);
    const credential = await auth().signInWithCredential(googleCredential);

    return { googleIdToken, credential };
  } catch (error: unknown) {
    throw mapGoogleSignInError(error);
  }
}

export async function getFirebaseIdToken(): Promise<string> {
  const user = auth().currentUser;
  if (!user) {
    throw new Error('Not signed in with Firebase.');
  }
  return user.getIdToken();
}

export async function signOutGoogleAndFirebase(): Promise<void> {
  await auth().signOut().catch(() => undefined);
  await GoogleSignin.signOut().catch(() => undefined);
}
