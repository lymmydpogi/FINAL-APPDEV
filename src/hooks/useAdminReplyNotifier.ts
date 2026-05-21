import { useCallback, useEffect, useRef } from 'react';
import { AppState } from 'react-native';

import { useToast } from '../context/ToastContext';
import { useAuth } from './useAuth';
import { fetchMessages } from '../services/messagesApi';
import {
  getLastSeenAdminMessageId,
  getUnreadAdminMessages,
} from '../services/chatNotificationsStorage';
import { navigationRef } from '../navigations/navigationRef';
import { triggerNotificationRefresh } from '../services/notificationsRefresh';
import ROUTES from '../utils/routes';

const POLL_MS = 25_000;

/**
 * Polls chat while logged in; toast when a new admin reply arrives off the Messages screen.
 */
export function useAdminReplyNotifier() {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const lastToastedIdRef = useRef(0);
  const pollingRef = useRef(false);

  const checkForNewReplies = useCallback(async () => {
    if (!isAuthenticated || pollingRef.current) {
      return;
    }
    pollingRef.current = true;
    try {
      const [messages, lastSeen] = await Promise.all([
        fetchMessages(),
        getLastSeenAdminMessageId(),
      ]);
      const unread = getUnreadAdminMessages(messages, lastSeen);
      triggerNotificationRefresh();

      if (unread.length === 0) {
        return;
      }

      const newest = unread[unread.length - 1];
      const routeName = navigationRef.isReady()
        ? navigationRef.getCurrentRoute()?.name
        : undefined;

      if (
        routeName !== ROUTES.MESSAGES &&
        newest.id > lastToastedIdRef.current
      ) {
        const preview =
          newest.message.length > 80
            ? `${newest.message.slice(0, 80)}…`
            : newest.message;
        showToast(`Campana Designs replied: ${preview}`, 'info');
        lastToastedIdRef.current = newest.id;
      }
    } catch {
      // ignore poll errors (offline, etc.)
    } finally {
      pollingRef.current = false;
    }
  }, [isAuthenticated, showToast]);

  useEffect(() => {
    if (!isAuthenticated) {
      lastToastedIdRef.current = 0;
      return;
    }

    checkForNewReplies();
    const interval = setInterval(checkForNewReplies, POLL_MS);
    const sub = AppState.addEventListener('change', state => {
      if (state === 'active') {
        checkForNewReplies();
      }
    });

    return () => {
      clearInterval(interval);
      sub.remove();
    };
  }, [isAuthenticated, checkForNewReplies]);
}
