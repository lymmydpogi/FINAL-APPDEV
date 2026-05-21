import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import CampanaBackground from '../../components/CampanaBackground';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import { CustomButton } from '../../components';
import { canCancelOrder, canModifyOrder } from '../../constants/orderStatus';
import { cancelOrder, getOrder, OrderApiError } from '../../services/ordersApi';
import type { ClientOrder } from '../../types/api';
import type { RootStackParamList } from '../../types/navigation';
import { clientStyles, commonStyles, theme } from '../../theme/tokens';
import { formatOrderDate, formatPeso } from '../../utils/format';
import { serviceDetailParamsFromOrder } from '../../utils/orderNavigation';
import { ROUTES } from '../../utils';

type Props = {
  route: RouteProp<RootStackParamList, typeof ROUTES.ORDER_DETAIL>;
};

const OrderDetailScreen = ({ route }: Props) => {
  const { orderId } = route.params;
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [order, setOrder] = useState<ClientOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setOrder(await getOrder(orderId));
    } catch (e: unknown) {
      const msg = e instanceof OrderApiError ? e.message : 'Could not load order';
      setError(msg);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const onCancel = () => {
    if (!order || cancelling) {
      return;
    }
    Alert.alert(
      'Cancel order',
      'This will mark the order as Cancelled. It stays in your history but cannot be edited.',
      [
        { text: 'Keep order', style: 'cancel' },
        {
          text: 'Cancel order',
          style: 'destructive',
          onPress: async () => {
            setCancelling(true);
            try {
              const updated = await cancelOrder(order.id);
              setOrder(updated);
            } catch (e: unknown) {
              const msg = e instanceof OrderApiError ? e.message : 'Could not cancel order';
              Alert.alert('Cancel failed', msg);
            } finally {
              setCancelling(false);
            }
          },
        },
      ],
    );
  };

  const showEdit = order ? canModifyOrder(order) : false;
  const showCancel = order ? canCancelOrder(order) : false;

  if (loading && !order) {
    return (
      <CampanaBackground>
        <View style={styles.centered}>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </View>
      </CampanaBackground>
    );
  }

  if (error && !order) {
    return (
      <CampanaBackground>
        <View style={[styles.centered, commonStyles.maxWidthCenter]}>
          <Text style={styles.error}>{error}</Text>
          <CustomButton title="Try again" onPress={load} style={styles.retry} />
        </View>
      </CampanaBackground>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <CampanaBackground>
      <ScrollView contentContainerStyle={clientStyles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={commonStyles.maxWidthCenter}>
          <View style={styles.headerRow}>
            <Text style={styles.orderId}>Order #{order.id}</Text>
            <OrderStatusBadge status={order.status} />
          </View>

          <View style={clientStyles.surfaceCard}>
            <DetailRow label="Service" value={order.serviceName ?? '—'} />
            <DetailRow label="Total" value={formatPeso(order.totalPrice)} hint="Calculated by Campana Designs" />
            <DetailRow label="Placed" value={formatOrderDate(order.orderDate)} />
            <DetailRow label="Payment" value={`${order.paymentMethod} · ${order.paymentStatus}`} />
          </View>

          {order.notes ? (
            <View style={[clientStyles.surfaceCard, styles.briefCard]}>
              <Text style={clientStyles.sectionTitle}>Project brief</Text>
              <Text style={styles.brief}>{order.notes}</Text>
            </View>
          ) : null}

          {error ? <Text style={styles.errorInline}>{error}</Text> : null}

          {showEdit ? (
            <CustomButton
              title="Edit order"
              onPress={() => navigation.navigate(ROUTES.ORDER_EDIT, { orderId: order.id })}
              fullWidth
              style={styles.actionBtn}
            />
          ) : null}

          {showCancel ? (
            <CustomButton
              title="Cancel order"
              variant="danger"
              onPress={onCancel}
              loading={cancelling}
              disabled={cancelling}
              fullWidth
              style={styles.actionBtn}
            />
          ) : null}

          <CustomButton
            title="Order again"
            variant="outline"
            onPress={() => {
              const params = serviceDetailParamsFromOrder(order);
              if (!params) {
                Alert.alert('Unavailable', 'This service could not be opened. Try from the services list.');
                return;
              }
              navigation.navigate(ROUTES.SERVICE_DETAIL, params);
            }}
            fullWidth
            style={styles.actionBtn}
          />
        </View>
      </ScrollView>
    </CampanaBackground>
  );
};

function DetailRow({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
      {hint ? <Text style={styles.detailHint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: theme.spacing.screenPadding },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  orderId: { ...theme.typography.h2, flex: 1 },
  detailRow: { marginBottom: theme.spacing.md },
  detailLabel: { ...theme.typography.label, marginBottom: 4 },
  detailValue: { ...theme.typography.body, color: theme.colors.textStrong },
  detailHint: { ...theme.typography.caption, marginTop: 2 },
  briefCard: { marginTop: theme.spacing.md },
  brief: { ...theme.typography.bodyMuted, lineHeight: 22 },
  actionBtn: { marginTop: theme.spacing.md },
  error: { color: theme.colors.error, textAlign: 'center', marginBottom: theme.spacing.md },
  errorInline: { color: theme.colors.error, marginTop: theme.spacing.md },
  retry: { marginTop: theme.spacing.md },
});

export default OrderDetailScreen;
