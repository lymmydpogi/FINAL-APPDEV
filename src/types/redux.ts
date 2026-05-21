import type { WebappUser } from './api';

export type AuthState = {
  data: SessionPayload | null;
  isLoading: boolean;
  isBootstrapping: boolean;
  isError: boolean;
  error: string | null;
};

export type RootState = {
  auth: AuthState;
};

export type LoginPayload = {
  username: string;
  password: string;
};

export type SessionPayload = {
  provider: 'symfony';
  token: string;
  user: WebappUser;
  authMethod?: 'email' | 'google';
  firebaseUid?: string | null;
};

export type AuthAction =
  | { type: 'USER_LOGIN'; payload: LoginPayload }
  | { type: 'USER_LOGIN_REQUEST' }
  | { type: 'USER_LOGIN_COMPLETE'; payload: SessionPayload }
  | { type: 'USER_LOGIN_ERROR'; error: string }
  | { type: 'USER_LOGOUT' }
  | { type: 'AUTH_BOOTSTRAP_REQUEST' }
  | { type: 'AUTH_BOOTSTRAP_COMPLETE'; payload: SessionPayload | null }
  | { type: 'AUTH_USER_REFRESH'; payload: WebappUser }
  | { type: 'RESET_USER_LOGIN' }
  | { type: string; payload?: unknown; error?: string };
