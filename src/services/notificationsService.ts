import { ORDER_STATUS } from '../constants/orderStatus';
import type { ClientOrder } from '../types/api';
import { fetchMessages } from './messagesApi';
import {
  getLastSeenAdminMessageId,
  getUnreadAdminMessages,
} from './chatNotificationsStorage';
import { listOrders } from './ordersApi';
import { getReadNotificationIds, markAllNotificationsRead, markNotificationRead } from './notificationsStorage';

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  kind: 'order' | 'chat';
  orderId?: number;
  messageId?: number;
  read: boolean;
};

function notificationCopy(order: ClientOrder): { title: string; body: string } {
  const name = order.serviceName ?? 'your order';
  switch (order.status) {
    case ORDER_STATUS.PENDING:
      return {
        title: 'Order received',
        body: `Your project brief for "${name}" (#${order.id}) is pending review.`,
      };
    case ORDER_STATUS.APPROVED:
      return {
        title: 'Order approved',
        body: `"${name}" (#${order.id}) was approved. We'll keep you updated.`,
      };
    case ORDER_STATUS.IN_PROGRESS:
      return {
        title: 'Order in progress',
        body: `We're working on "${name}" (#${order.id}).`,
      };
    case ORDER_STATUS.COMPLETED:
      return {
        title: 'Order completed',
        body: `"${name}" (#${order.id}) is marked completed.`,
      };
    case ORDER_STATUS.CANCELLED:
      return {
        title: 'Order cancelled',
        body: `Order #${order.id} for "${name}" was cancelled.`,
      };
    case ORDER_STATUS.REJECTED:
      return {
        title: 'Order update',
        body: `Order #${order.id} for "${name}" was not approved.`,
      };
    default:
      return {
        title: 'Order update',
        body: `Order #${order.id} for "${name}" — status: ${order.status}.`,
      };
  }
}

function orderToNotification(order: ClientOrder, readIds: Set<string>): AppNotification {
  const { title, body } = notificationCopy(order);
  const id = `order-${order.id}-${order.status}`;
  return {
    id,
    title,
    body,
    createdAt: order.orderDate,
    kind: 'order',
    orderId: order.id,
    read: readIds.has(id),
  };
}

function chatToNotifications(
  messages: Awaited<ReturnType<typeof fetchMessages>>,
  lastSeenId: number,
  readIds: Set<string>,
): AppNotification[] {
  return getUnreadAdminMessages(messages, lastSeenId).map(m => {
    const id = `chat-${m.id}`;
    const preview =
      m.message.length > 120 ? `${m.message.slice(0, 120)}…` : m.message;
    return {
      id,
      title: 'New message from Campana Designs',
      body: preview,
      createdAt: m.createdAt,
      kind: 'chat',
      messageId: m.id,
      read: readIds.has(id),
    };
  });
}

export async function fetchNotifications(): Promise<AppNotification[]> {
  const [orders, readIds, messages, lastSeenAdminId] = await Promise.all([
    listOrders(),
    getReadNotificationIds(),
    fetchMessages().catch(() => [] as Awaited<ReturnType<typeof fetchMessages>>),
    getLastSeenAdminMessageId(),
  ]);

  const orderNotes = orders.map(o => orderToNotification(o, readIds));
  const chatNotes = chatToNotifications(messages, lastSeenAdminId, readIds);

  return [...chatNotes, ...orderNotes].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function getUnreadNotificationCount(): Promise<number> {
  const items = await fetchNotifications();
  return items.filter(n => !n.read).length;
}

export async function getUnreadChatReplyCount(): Promise<number> {
  try {
    const [messages, lastSeen] = await Promise.all([
      fetchMessages(),
      getLastSeenAdminMessageId(),
    ]);
    return getUnreadAdminMessages(messages, lastSeen).length;
  } catch {
    return 0;
  }
}

export { markNotificationRead, markAllNotificationsRead };
