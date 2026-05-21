import { useSelector } from 'react-redux';

import type { RootState } from '../types/redux';
import type { SessionPayload } from '../types/redux';
import {
  getUserFromSession,
  hasRoleClient,
  isClientAuthenticated,
  needsEmailVerification,
} from '../utils/authSession';

export function useAuth() {
  const auth = useSelector((state: RootState) => state.auth);
  const session = auth.data as SessionPayload | null;
  const user = getUserFromSession(session);

  return {
    session,
    user,
    isLoading: auth.isLoading,
    isBootstrapping: auth.isBootstrapping,
    isError: auth.isError,
    error: auth.error,
    isAuthenticated: isClientAuthenticated(session),
    isClient: hasRoleClient(session),
    needsVerification: needsEmailVerification(session),
    token: session?.token ?? null,
  };
}
