import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { authLogout } from '../app/actions';
import { friendlyAuthMessage } from '../constants/mobileAuth';
import { useToast } from '../context/ToastContext';
import { navigationRef } from '../navigations/navigationRef';
import { setOnAccessDenied, setOnUnauthorized } from '../services/apiClient';
import { ROUTES } from '../utils';

/** Wires global 401/403 mobile-access API handlers (logout + login redirect). */
export default function AuthInterceptors() {
  const dispatch = useDispatch();
  const { showToast } = useToast();

  useEffect(() => {
    setOnUnauthorized(() => {
      dispatch(authLogout());
      if (navigationRef.isReady()) {
        navigationRef.navigate(ROUTES.LOGIN);
      }
    });

    setOnAccessDenied((message: string) => {
      dispatch(authLogout());
      if (navigationRef.isReady()) {
        navigationRef.navigate(ROUTES.LOGIN);
      }
      showToast(friendlyAuthMessage(message), 'error');
    });

    return () => {
      setOnUnauthorized(null);
      setOnAccessDenied(null);
    };
  }, [dispatch, showToast]);

  return null;
}
