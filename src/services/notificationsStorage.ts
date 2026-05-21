import AsyncStorage from '@react-native-async-storage/async-storage';

const READ_IDS_KEY = 'campana_notification_read_ids';

export async function getReadNotificationIds(): Promise<Set<string>> {
  try {
    const raw = await AsyncStorage.getItem(READ_IDS_KEY);
    if (!raw) {
      return new Set();
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return new Set();
    }
    return new Set(parsed.filter((id): id is string => typeof id === 'string'));
  } catch {
    return new Set();
  }
}

export async function markNotificationRead(id: string): Promise<void> {
  const ids = await getReadNotificationIds();
  ids.add(id);
  await AsyncStorage.setItem(READ_IDS_KEY, JSON.stringify([...ids]));
}

export async function markAllNotificationsRead(ids: string[]): Promise<void> {
  const existing = await getReadNotificationIds();
  ids.forEach(id => existing.add(id));
  await AsyncStorage.setItem(READ_IDS_KEY, JSON.stringify([...existing]));
}
