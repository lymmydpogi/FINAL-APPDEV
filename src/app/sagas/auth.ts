import { takeLatest, call, put, select } from 'redux-saga/effects';

import { friendlyAuthMessage } from '../../constants/mobileAuth';
import { signInWithGoogle } from '../../auth/googleSignIn';
import { signOutFirebase } from '../../services/authApi';
import { getMe } from '../../services/profileApi';
import { loginWithGoogleIdToken } from '../../services/googleAuthApi';
import type { RootState, SessionPayload } from '../../types/redux';
import {
  AUTH_BOOTSTRAP,
  AUTH_BOOTSTRAP_COMPLETE,
  AUTH_BOOTSTRAP_REQUEST,
  RESET_USER_LOGIN,
  USER_GOOGLE_LOGIN,
  USER_LOGIN,
  USER_LOGIN_COMPLETE,
  USER_LOGIN_ERROR,
  USER_LOGIN_REQUEST,
  USER_LOGOUT,
} from '../actions';
import { userLogin as userLoginApi } from '../api/auth';

type CompleteExtras = {
  authMethod?: 'email' | 'google';
  firebaseUid?: string | null;
};

function buildSession(
  token: string,
  user: SessionPayload['user'],
  extras?: CompleteExtras,
): SessionPayload {
  return {
    provider: 'symfony',
    token,
    user,
    authMethod: extras?.authMethod,
    firebaseUid: extras?.firebaseUid,
  };
}

export function* userLoginAsync(action: {
  payload?: { username: string; password: string };
}) {
  const email = action.payload?.username ?? '';
  try {
    yield put({ type: USER_LOGIN_REQUEST });

    const result: { token: string; user: SessionPayload['user'] } = yield call(userLoginApi, {
      username: email,
      password: action.payload?.password ?? '',
    });

    yield put({
      type: USER_LOGIN_COMPLETE,
      payload: buildSession(result.token, result.user, { authMethod: 'email' }),
    });
  } catch (error: unknown) {
    const message = friendlyAuthMessage(
      error instanceof Error ? error.message : "We couldn't sign you in. Please try again.",
    );
    yield put({ type: USER_LOGIN_ERROR, error: message });
  }
}

export function* userGoogleLoginAsync() {
  try {
    yield put({ type: USER_LOGIN_REQUEST });

    const { googleIdToken, credential }: Awaited<ReturnType<typeof signInWithGoogle>> =
      yield call(signInWithGoogle);
    const result: { token: string; user: SessionPayload['user'] } = yield call(
      loginWithGoogleIdToken,
      googleIdToken,
    );

    yield put({
      type: USER_LOGIN_COMPLETE,
      payload: buildSession(result.token, result.user, {
        authMethod: 'google',
        firebaseUid: credential.user.uid,
      }),
    });
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string };
    if (err?.code === 'SIGN_IN_CANCELLED' || err?.code === '-5') {
      yield put({ type: USER_LOGIN_ERROR, error: '' });
      return;
    }
    const message = friendlyAuthMessage(
      error instanceof Error ? error.message : "Couldn't sign in with Google. Try again.",
      "Couldn't sign in with Google. Try again or use your email instead.",
    );
    yield put({ type: USER_LOGIN_ERROR, error: message });
  }
}

export function* logoutAsync() {
  yield call(signOutFirebase);
  yield put({ type: RESET_USER_LOGIN });
}

export function* authBootstrapAsync() {
  yield put({ type: AUTH_BOOTSTRAP_REQUEST });
  const session: SessionPayload | null = yield select((s: RootState) => s.auth.data);

  if (!session?.token) {
    yield put({ type: AUTH_BOOTSTRAP_COMPLETE, payload: null });
    return;
  }

  try {
    const user: SessionPayload['user'] = yield call(getMe);
    yield put({
      type: AUTH_BOOTSTRAP_COMPLETE,
      payload: { ...session, user },
    });
  } catch {
    yield put({ type: RESET_USER_LOGIN });
    yield put({ type: AUTH_BOOTSTRAP_COMPLETE, payload: null });
  }
}

export function* watchAuth() {
  yield takeLatest(USER_LOGIN as never, userLoginAsync);
  yield takeLatest(USER_GOOGLE_LOGIN as never, userGoogleLoginAsync);
  yield takeLatest(USER_LOGOUT as never, logoutAsync);
  yield takeLatest(AUTH_BOOTSTRAP as never, authBootstrapAsync);
}
