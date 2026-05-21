/**
 * @deprecated Auth tokens are stored in Redux (`auth.data.token`) and persisted
 * with redux-persist. Do not read/write JWT here — use the auth slice / sagas.
 */
export async function saveAuthToken(_token: string): Promise<void> {
  if (__DEV__) {
    console.warn('[tokenStorage] saveAuthToken is deprecated — use Redux auth actions.');
  }
}

export async function getAuthToken(): Promise<string | null> {
  if (__DEV__) {
    console.warn('[tokenStorage] getAuthToken is deprecated — use selectAuthToken() from store.');
  }
  return null;
}

export async function clearAuthToken(): Promise<void> {
  if (__DEV__) {
    console.warn('[tokenStorage] clearAuthToken is deprecated — dispatch authLogout().');
  }
}
