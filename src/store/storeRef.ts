import type { Store } from 'redux';

import type { RootState } from '../types/redux';

let store: Store<RootState> | null = null;

export function attachStore(instance: Store<RootState>): void {
  store = instance;
}

export function getStore(): Store<RootState> | null {
  return store;
}

/** JWT for API calls — read from Redux (persisted via redux-persist). */
export function selectAuthToken(): string | null {
  return store?.getState().auth.data?.token ?? null;
}
