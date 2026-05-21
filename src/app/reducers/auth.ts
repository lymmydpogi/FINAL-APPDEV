import {
  AUTH_BOOTSTRAP_COMPLETE,
  AUTH_BOOTSTRAP_REQUEST,
  AUTH_USER_REFRESH,
  RESET_USER_LOGIN,
  USER_LOGIN_COMPLETE,
  USER_LOGIN_ERROR,
  USER_LOGIN_REQUEST,
} from '../actions';
import type { AuthAction, AuthState, SessionPayload } from '../../types/redux';

const INITIALSTATE: AuthState = {
  data: null,
  isLoading: false,
  isBootstrapping: true,
  isError: false,
  error: null,
};

function withUser(session: SessionPayload, user: SessionPayload['user']): SessionPayload {
  return { ...session, user };
}

export default function reducer(state = INITIALSTATE, action: AuthAction): AuthState {
  switch (action.type) {
    case AUTH_BOOTSTRAP_REQUEST:
      return { ...state, isBootstrapping: true };

    case AUTH_BOOTSTRAP_COMPLETE:
      return {
        ...state,
        data: (action.payload as SessionPayload | null) ?? null,
        isBootstrapping: false,
        isLoading: false,
        isError: false,
        error: null,
      };

    case USER_LOGIN_REQUEST:
      return {
        ...state,
        isLoading: true,
        isError: false,
        error: null,
      };

    case USER_LOGIN_COMPLETE:
      return {
        ...state,
        data: (action.payload as SessionPayload) || null,
        isLoading: false,
        isBootstrapping: false,
        isError: false,
        error: null,
      };

    case AUTH_USER_REFRESH: {
      if (!state.data) {
        return state;
      }
      return {
        ...state,
        data: withUser(state.data, action.payload as SessionPayload['user']),
      };
    }

    case USER_LOGIN_ERROR:
      return {
        ...state,
        data: null,
        isLoading: false,
        isBootstrapping: false,
        isError: true,
        error: action.error || 'Login failed',
      };

    case RESET_USER_LOGIN:
      return { ...INITIALSTATE, isBootstrapping: false };

    default:
      return state;
  }
}
