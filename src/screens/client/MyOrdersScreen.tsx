import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import CampanaBackground from '../../components/CampanaBackground';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import { CustomButton } from '../../components';
import { canModifyOrder } from '../../constants/orderStatus';
import { useAuth } from '../../hooks/useAuth';
import { listOrders } from '../../services/ordersApi';
import type { ClientOrder } from '../../types/api';
import type { RootStackParamList } from '../../types/navigation';
import { clientStyles, commonStyles, theme } from '../../theme/tokens';
import { formatOrderDate, formatPeso } from '../../utils/format';
import { serviceDetailParamsFromOrder } from '../../utils/orderNavigation';
import { ROUTES } from '../../utils';

type Nav = StackNavigationProp<RootStackParamList, typeof ROUTES.MY_ORDERS>;

const MyOrdersScreen = () => {
  const navigation = useNavigation<Nav>();
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<ClientOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      setOrders([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setOrders(await listOrders());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Could not load orders');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  if (!isAuthenticated) {
    return (
      <CampanaBackground>
        <View style={[styles.centered, commonStyles.maxWidthCenter]}>
          <Text style={styles.emptyTitle}>Sign in to view orders</Text>
          <Text style={styles.empty}>
            Your project briefs and order history appear here after you sign in.
          </Text>
          <CustomButton
            title="Log in"
            onPress={() => navigation.navigate(ROUTES.LOGIN)}
            style={styles.emptyBtn}
          />
          <CustomButton
            title="Browse services"
            variant="outline"
            onPress={() =>
              navigation.navigate(ROUTES.MAIN_TABS, { screen: ROUTES.TAB_SERVICES })
            }
            style={styles.emptyBtn}
          />
        </View>
      </CampanaBackground>
    );
  }

  const listHeader = (
    <View style={styles.header}>
      <Text style={styles.subtitle}>
        {orders.length === 0 && !loading
          ? 'Submit a project brief from Services to create an order.'
          : `${orders.length} order${orders.length === 1 ? '' : 's'}`}
      </Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );

  const empty = !loading && !error && orders.length === 0;

  return (
    <CampanaBackground>
      {loading && orders.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={[
            styles.listContent,
            empty && styles.listContentEmpty,
          ]}
          ListHeaderComponent={listHeader}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={load} tintColor={theme.colors.primary} />
          }
          ListEmptyComponent={
            empty ? (
              <View style={styles.emptyWrap}>
                <Text style={styles.emptyTitle}>No orders yet</Text>
                <Text style={styles.empty}>
                  Browse our services and submit a project brief to get started.
                </Text>
                <CustomButton
                  title="Browse services"
                  onPress={() =>
              navigation.navigate(ROUTES.MAIN_TABS, { screen: ROUTES.TAB_SERVICES })
            }
                  style={styles.emptyBtn}
                />
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            <OrderListCard
              order={item}
              onView={() => navigation.navigate(ROUTES.ORDER_DETAIL, { orderId: item.id })}
              onEdit={() => navigation.navigate(ROUTES.ORDER_EDIT, { orderId: item.id })}
              onOrderAgain={() => {
                const params = serviceDetailParamsFromOrder(item);
                if (params) {
                  navigation.navigate(ROUTES.SERVICE_DETAIL, params);
                }
              }}
            />
          )}
        />
      )}
    </CampanaBackground>
  );
};

function OrderListCard({
  order,
  onView,
  onEdit,
  onOrderAgain,
}: {
  order: ClientOrder;
  onView: () => void;
  onEdit: () => void;
  onOrderAgain: () => void;
}) {
  const editable = canModifyOrder(order);
  const canReorder = order.serviceId != null || order.serviceName != null;

  return (
    <View style={[commonStyles.maxWidthCenter, clientStyles.surfaceCard, styles.card]}>
      <Pressable onPress={onView}>
        <View style={styles.cardHeader}>
          <Text style={styles.orderNum}>#{order.id}</Text>
          <OrderStatusBadge status={order.status} />
        </View>
        <Text style={styles.serviceName}>{order.serviceName ?? 'Service'}</Text>
        <Text style={styles.meta}>{formatPeso(order.totalPrice)}</Text>
        <Text style={styles.date}>{formatOrderDate(order.orderDate)}</Text>
      </Pressable>
      <View style={styles.actions}>
        <Pressable onPress={onView} style={styles.actionLink}>
          <Text style={styles.actionText}>View</Text>
        </Pressable>
        {editable ? (
          <Pressable onPress={onEdit} style={styles.actionLink}>
            <Text style={[styles.actionText, styles.actionEdit]}>Edit</Text>
          </Pressable>
        ) : null}
        {canReorder ? (
          <Pressable onPress={onOrderAgain} style={styles.actionLink}>
            <Text style={styles.actionText}>Order again</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingBottom: theme.spacing.xxl,
  },
  listContentEmpty: { flexGrow: 1 },
  header: { paddingTop: theme.spacing.sm, paddingBottom: theme.spacing.md },
  subtitle: { ...theme.typography.bodyMuted, lineHeight: 22 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: theme.spacing.screenPadding },
  error: { color: theme.colors.error, marginTop: theme.spacing.md, fontSize: 14 },
  card: { marginBottom: theme.spacing.md },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  orderNum: { ...theme.typography.label, color: theme.colors.textSubtle },
  serviceName: { ...theme.typography.h2, fontSize: 17, marginBottom: 4 },
  meta: { ...theme.typography.caption, marginBottom: 2 },
  date: { ...theme.typography.caption },
  actions: { flexDirection: 'row', gap: theme.spacing.lg, marginTop: theme.spacing.md },
  actionLink: { paddingVertical: 4 },
  actionText: { fontSize: 14, fontWeight: '600', color: theme.colors.primaryLight },
  actionEdit: { color: theme.colors.primary },
  emptyWrap: { alignItems: 'center', paddingTop: theme.spacing.xl, paddingHorizontal: theme.spacing.md },
  emptyTitle: { ...theme.typography.h2, marginBottom: theme.spacing.sm },
  empty: { ...theme.typography.bodyMuted, textAlign: 'center', lineHeight: 22, marginBottom: theme.spacing.lg },
  emptyBtn: { minWidth: 200, marginTop: theme.spacing.sm },
});

export default MyOrdersScreen;
