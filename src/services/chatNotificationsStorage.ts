import AsyncStorage from '@react-native-async-storage/async-storage';

import type { ChatMessage } from '../types/api';

const LAST_SEEN_ADMIN_ID_KEY = 'campana_chat_last_seen_admin_id';

export async function getLastSeenAdminMessageId(): Promise<number> {
  try {
    const raw = await AsyncStorage.getItem(LAST_SEEN_ADMIN_ID_KEY);
    if (!raw) {
      return 0;
    }
    const n = parseInt(raw, 10);
    return Number.isFinite(n) ? n : 0;
  } catch {
    return 0;
  }
}

export async function setLastSeenAdminMessageId(id: number): Promise<void> {
  await AsyncStorage.setItem(LAST_SEEN_ADMIN_ID_KEY, String(id));
}

/** Mark all admin messages in the loaded thread as seen (e.g. when opening chat). */
export async function markAdminMessagesSeen(messages: ChatMessage[]): Promise<void> {
  const adminIds = messages.filter(m => m.senderType === 'admin').map(m => m.id);
  if (adminIds.length === 0) {
    return;
  }
  const maxId = Math.max(...adminIds);
  const prev = await getLastSeenAdminMessageId();
  if (maxId > prev) {
    await setLastSeenAdminMessageId(maxId);
  }
}

export function getUnreadAdminMessages(
  messages: ChatMessage[],
  lastSeenId: number,
): ChatMessage[] {
  return messages.filter(m => m.senderType === 'admin' && m.id > lastSeenId);
}
