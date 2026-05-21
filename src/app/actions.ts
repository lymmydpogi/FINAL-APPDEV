import type { LoginPayload, SessionPayload } from '../types/redux';
import type { WebappUser } from '../types/api';

export const USER_LOGIN = 'USER_LOGIN';
export const USER_LOGIN_REQUEST = 'USER_LOGIN_REQUEST';
export const USER_LOGIN_COMPLETE = 'USER_LOGIN_COMPLETE';
export const USER_LOGIN_ERROR = 'USER_LOGIN_ERROR';
export const USER_GOOGLE_LOGIN = 'USER_GOOGLE_LOGIN';
export const USER_LOGOUT = 'USER_LOGOUT';
export const AUTH_BOOTSTRAP = 'AUTH_BOOTSTRAP';
export const AUTH_BOOTSTRAP_REQUEST = 'AUTH_BOOTSTRAP_REQUEST';
export const AUTH_BOOTSTRAP_COMPLETE = 'AUTH_BOOTSTRAP_COMPLETE';
export const AUTH_USER_REFRESH = 'AUTH_USER_REFRESH';
export const RESET_USER_LOGIN = 'RESET_USER_LOGIN';

export const authLogin = (payload: LoginPayload) => ({
  type: USER_LOGIN,
  payload,
});

export const authGoogleLogin = () => ({
  type: USER_GOOGLE_LOGIN,
});

export const authLogout = () => ({
  type: USER_LOGOUT,
});

export const authBootstrap = () => ({
  type: AUTH_BOOTSTRAP,
});

export const authSessionComplete = (payload: SessionPayload) => ({
  type: USER_LOGIN_COMPLETE,
  payload,
});

export const authUserRefresh = (user: WebappUser) => ({
  type: AUTH_USER_REFRESH,
  payload: user,
});
