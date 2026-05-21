type RefreshFn = () => void;

const bellRefreshers = new Set<RefreshFn>();
const chatRefreshers = new Set<RefreshFn>();

export function registerBellRefresh(fn: RefreshFn): () => void {
  bellRefreshers.add(fn);
  return () => bellRefreshers.delete(fn);
}

export function registerChatRefresh(fn: RefreshFn): () => void {
  chatRefreshers.add(fn);
  return () => chatRefreshers.delete(fn);
}

export function triggerNotificationRefresh(): void {
  bellRefreshers.forEach(fn => fn());
  chatRefreshers.forEach(fn => fn());
}
