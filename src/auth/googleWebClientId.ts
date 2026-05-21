/**
 * OAuth 2.0 **Web** client ID (client_type 3) — used in GoogleSignin.configure({ webClientId }).
 *
 * Do NOT paste the Android client ID here. Android OAuth is tied to package com.appdev + SHA-1.
 *
 * Where to find it:
 * Firebase Console → Project settings → Your apps → Web client ID
 * or Authentication → Sign-in method → Google → Web SDK configuration → Web client ID
 *
 * Should match the Web entry in android/app/google-services.json (oauth_client, client_type 3).
 */
export const FIREBASE_GOOGLE_WEB_CLIENT_ID =
  '524392883707-r9hs3a4o74ksqug0oeddgjar13vn7tel.apps.googleusercontent.com';
