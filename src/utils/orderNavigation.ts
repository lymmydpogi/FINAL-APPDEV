import { CLIENT_SERVICES } from '../constants/clientServices';
import type { ClientOrder } from '../types/api';
import type { ServiceDetailParams } from '../types/navigation';
import { slugify } from './slugify';

/** Params for Service detail — used by "Order again" (always POST create, never PATCH). */
export function serviceDetailParamsFromOrder(
  order: Pick<ClientOrder, 'serviceId' | 'serviceName'>,
): ServiceDetailParams | null {
  if (!order.serviceId && !order.serviceName) {
    return null;
  }

  const byName = order.serviceName
    ? CLIENT_SERVICES.find(s => s.name === order.serviceName)
    : undefined;

  return {
    slug: byName?.slug ?? (order.serviceName ? slugify(order.serviceName) : 'service'),
    name: order.serviceName ?? undefined,
    serviceId: order.serviceId ?? undefined,
  };
}
