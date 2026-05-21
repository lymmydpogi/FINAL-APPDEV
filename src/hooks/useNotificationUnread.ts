import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { useAuth } from './useAuth';
import { getUnreadNotificationCount } from '../services/notificationsService';
import { registerBellRefresh } from '../services/notificationsRefresh';

export function useNotificationUnread() {
  const { isAuthenticated } = useAuth();
  const [count, setCount] = useState(0);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setCount(0);
      return;
    }
    try {
      setCount(await getUnreadNotificationCount());
    } catch {
      setCount(0);
    }
  }, [isAuthenticated]);

  useEffect(() => registerBellRefresh(refresh), [refresh]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  return { count, refresh };
}
