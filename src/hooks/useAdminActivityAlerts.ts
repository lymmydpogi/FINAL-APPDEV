import { useCallback, useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

import { useActivityBanner } from '../context/ActivityBannerContext';
import { fetchClientServices } from '../services/servicesApi';
import { listOrders } from '../services/ordersApi';
import type { ClientOrder, ServiceItem } from '../types/api';
import { isOrderRecentlyMutatedByClient } from '../utils/orderMutationGuard';

const POLL_MS = 8_000;

function serviceFingerprint(service: ServiceItem): string {
  return [
    service.id,
    service.name,
    service.slug ?? '',
    String(service.price ?? ''),
    service.status ?? '',
    (service.description ?? '').slice(0, 120),
    String(service.isOrderable ?? ''),
  ].join('\u0001');
}

function orderFingerprint(order: ClientOrder): string {
  return [
    order.status,
    order.serviceName ?? '',
    String(order.quantity),
    String(order.totalPrice),
    order.notes ?? '',
    order.paymentMethod,
    order.paymentStatus,
    order.deliveryDate ?? '',
  ].join('\u0001');
}

type ServiceMeta = { name: string; fingerprint: string };

/**
 * Polls services + orders and shows banners when Campana Designs (admin) changes catalog or orders.
 */
export function useAdminActivityAlerts(isAuthenticated: boolean) {
  const { showBanner } = useActivityBanner();
  const servicesBootstrapped = useRef(false);
  const ordersBootstrapped = useRef(false);
  const knownServices = useRef<Map<number, ServiceMeta>>(new Map());
  const knownOrders = useRef<Map<number, string>>(new Map());
  const inFlight = useRef(false);

  const poll = useCallback(async () => {
    if (!isAuthenticated || inFlight.current) {
      return;
    }
    inFlight.current = true;

    try {
      const [services, orders] = await Promise.all([
        fetchClientServices().catch(() => [] as ServiceItem[]),
        listOrders().catch(() => [] as ClientOrder[]),
      ]);

      const currentServiceIds = new Set<number>();

      for (const service of services) {
        const id = Number(service.id);
        if (!id) {
          continue;
        }
        currentServiceIds.add(id);
        const fp = serviceFingerprint(service);
        const prev = knownServices.current.get(id);

        if (!servicesBootstrapped.current) {
          knownServices.current.set(id, { name: service.name, fingerprint: fp });
          continue;
        }

        if (!prev) {
          showBanner({
            id: `service-new-${id}`,
            kind: 'service-new',
            title: 'New service',
            message: `"${service.name}" is now available in the app.`,
          });
          knownServices.current.set(id, { name: service.name, fingerprint: fp });
          continue;
        }

        if (prev.fingerprint !== fp) {
          showBanner({
            id: `service-edit-${id}-${fp.length}`,
            kind: 'service-edit',
            title: 'Service updated',
            message: `"${service.name}" was updated by Campana Designs (price, status, or details).`,
          });
          knownServices.current.set(id, { name: service.name, fingerprint: fp });
        }
      }

      if (servicesBootstrapped.current) {
        knownServices.current.forEach((meta, id) => {
          if (!currentServiceIds.has(id)) {
            showBanner({
              id: `service-remove-${id}`,
              kind: 'service-remove',
              title: 'Service removed',
              message: `"${meta.name}" is no longer available.`,
            });
            knownServices.current.delete(id);
          }
        });
      }
      servicesBootstrapped.current = true;

      const currentOrderIds = new Set<number>();

      for (const order of orders) {
        const id = order.id;
        currentOrderIds.add(id);
        const fp = orderFingerprint(order);
        const prev = knownOrders.current.get(id);

        if (!ordersBootstrapped.current) {
          knownOrders.current.set(id, fp);
          continue;
        }

        if (prev !== undefined && prev !== fp && !isOrderRecentlyMutatedByClient(id)) {
          const prevStatus = prev.split('\u0001')[0];
          const nextStatus = order.status;
          if (prevStatus !== nextStatus) {
            showBanner({
              id: `order-status-${id}-${nextStatus}`,
              kind: 'order-update',
              title: 'Order updated',
              message: `Order #${id} is now "${nextStatus}" (updated by Campana Designs).`,
            });
          } else {
            showBanner({
              id: `order-edit-${id}-${fp.length}`,
              kind: 'order-edit',
              title: 'Order updated',
              message: `Campana Designs updated order #${id} (service, notes, price, or delivery details).`,
            });
          }
        }

        knownOrders.current.set(id, fp);
      }

      if (ordersBootstrapped.current) {
        knownOrders.current.forEach((_, id) => {
          if (!currentOrderIds.has(id)) {
            showBanner({
              id: `order-remove-${id}`,
              kind: 'order-update',
              title: 'Order removed',
              message: `Order #${id} was removed or closed by Campana Designs.`,
            });
            knownOrders.current.delete(id);
          }
        });
      }
      ordersBootstrapped.current = true;
    } finally {
      inFlight.current = false;
    }
  }, [isAuthenticated, showBanner]);

  useEffect(() => {
    if (!isAuthenticated) {
      servicesBootstrapped.current = false;
      ordersBootstrapped.current = false;
      knownServices.current = new Map();
      knownOrders.current = new Map();
      return;
    }

    void poll();
    const timer = setInterval(() => void poll(), POLL_MS);

    const onAppState = (state: AppStateStatus) => {
      if (state === 'active') {
        void poll();
      }
    };
    const sub = AppState.addEventListener('change', onAppState);

    return () => {
      clearInterval(timer);
      sub.remove();
    };
  }, [isAuthenticated, poll]);
}
