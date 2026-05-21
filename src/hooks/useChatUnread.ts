import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { useAuth } from './useAuth';
import { getUnreadChatReplyCount } from '../services/notificationsService';
import { registerChatRefresh } from '../services/notificationsRefresh';

export function useChatUnread() {
  const { isAuthenticated } = useAuth();
  const [count, setCount] = useState(0);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setCount(0);
      return;
    }
    try {
      setCount(await getUnreadChatReplyCount());
    } catch {
      setCount(0);
    }
  }, [isAuthenticated]);

  useEffect(() => registerChatRefresh(refresh), [refresh]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  return { count, refresh };
}
