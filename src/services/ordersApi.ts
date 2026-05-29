import type { ClientOrder } from '../types/api';
import { parseEnvelope, throwIfApiError } from '../utils/apiEnvelope';
import { markOrderMutatedByClient } from '../utils/orderMutationGuard';
import { sortOrdersNewestFirst } from '../utils/sortOrders';
import apiClient from './apiClient';
import { API_ROUTES } from './apiRoutes';
import { OrderApiError, parseOrderApiError } from './orderApiError';

export { OrderApiError } from './orderApiError';

export type CreateOrderResult = {
  order: ClientOrder;
  created: boolean;
  orderId: number;
  message: string;
};

function mapOrder(raw: ClientOrder): ClientOrder {
  return {
    id: Number(raw.id),
    serviceId: raw.serviceId ?? null,
    serviceName: raw.serviceName ?? null,
    status: raw.status,
    quantity: Number(raw.quantity ?? 1),
    notes: raw.notes ?? null,
    totalPrice: Number(raw.totalPrice ?? 0),
    orderDate: raw.orderDate,
    paymentMethod: raw.paymentMethod ?? '',
    paymentStatus: raw.paymentStatus ?? '',
    deliveryDate: raw.deliveryDate ?? null,
    canEdit: Boolean(raw.canEdit),
    canCancel: Boolean(raw.canCancel),
  };
}

export async function listOrders(): Promise<ClientOrder[]> {
  try {
    const response = await apiClient.get(API_ROUTES.clientOrders);
    const data = throwIfApiError<{ orders: ClientOrder[] }>(response.data);
    return sortOrdersNewestFirst((data.orders ?? []).map(mapOrder));
  } catch (error) {
    throw parseOrderApiError(error, 'Could not load orders');
  }
}

export async function getOrder(id: number): Promise<ClientOrder> {
  try {
    const response = await apiClient.get(API_ROUTES.clientOrder(id));
    const data = throwIfApiError<{ order: ClientOrder }>(response.data);
    if (!data.order) {
      throw new OrderApiError('Order not found.', 404);
    }
    return mapOrder(data.order);
  } catch (error) {
    throw parseOrderApiError(error, 'Could not load order');
  }
}

/** Always creates a new order row — quantity is server-side (1); never sent from the app. */
export async function createOrderFromService(
  serviceId: number,
  projectBrief: string,
  serviceSlug?: string,
): Promise<CreateOrderResult> {
  try {
    const response = await apiClient.post(API_ROUTES.clientOrderFromService, {
      serviceId,
      projectBrief,
      ...(serviceSlug ? { serviceSlug } : {}),
    });
    const envelope = parseEnvelope<{
      order: ClientOrder;
      created?: boolean;
      orderId?: number;
    }>(response.data);
    if (!envelope.success) {
      throw parseOrderApiError({ response: { data: response.data, status: response.status } });
    }
    if (!envelope.data?.order) {
      throw new OrderApiError('Order was created but no order data was returned.', 201);
    }
    const order = mapOrder(envelope.data.order);
    const orderId = Number(envelope.data.orderId ?? order.id);
    return {
      order,
      created: envelope.data.created ?? true,
      orderId,
      message: envelope.message,
    };
  } catch (error) {
    throw parseOrderApiError(error, 'Could not submit project brief');
  }
}

export type UpdateOrderBody = {
  serviceId: number;
  notes: string;
};

export async function updateOrder(id: number, body: UpdateOrderBody): Promise<ClientOrder> {
  try {
    const response = await apiClient.patch(API_ROUTES.clientOrder(id), body);
    const data = throwIfApiError<{ order: ClientOrder }>(response.data);
    if (!data.order) {
      throw new OrderApiError('Order updated but no order data was returned.');
    }
    const order = mapOrder(data.order);
    markOrderMutatedByClient(id);
    return order;
  } catch (error) {
    throw parseOrderApiError(error, 'Could not update order');
  }
}

export async function cancelOrder(id: number): Promise<ClientOrder> {
  try {
    const response = await apiClient.patch(API_ROUTES.clientOrderCancel(id));
    const data = throwIfApiError<{ order: ClientOrder }>(response.data);
    if (!data.order) {
      throw new OrderApiError('Order cancelled but no order data was returned.');
    }
    const order = mapOrder(data.order);
    markOrderMutatedByClient(id);
    return order;
  } catch (error) {
    throw parseOrderApiError(error, 'Could not cancel order');
  }
}

/** @deprecated Use createOrderFromService(serviceId, projectBrief) */
export async function submitOrderFromService(
  serviceId: number,
  projectBrief: string,
): Promise<{ order?: ClientOrder; message: string }> {
  const result = await createOrderFromService(serviceId, projectBrief);
  return { order: result.order, message: result.message };
}

/** @deprecated Use listOrders */
export const fetchMyOrders = listOrders;
