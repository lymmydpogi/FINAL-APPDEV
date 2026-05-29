/** Skip admin-update banners briefly after the client edits/cancels an order locally. */
const TOUCH_MS = 12_000;
const touched = new Map<number, number>();

export function markOrderMutatedByClient(orderId: number): void {
  touched.set(orderId, Date.now());
}

export function isOrderRecentlyMutatedByClient(orderId: number): boolean {
  const at = touched.get(orderId);
  if (!at) {
    return false;
  }
  if (Date.now() - at > TOUCH_MS) {
    touched.delete(orderId);
    return false;
  }
  return true;
}
