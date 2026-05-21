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
import { CustomButton } from '../../components';
import { useAuth } from '../../hooks/useAuth';
import { setLastSeenAdminMessageId } from '../../services/chatNotificationsStorage';
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type AppNotification,
} from '../../services/notificationsService';
import type { RootStackParamList } from '../../types/navigation';
import { clientStyles, commonStyles, theme } from '../../theme/tokens';
import { formatOrderDate } from '../../utils/format';
import { ROUTES } from '../../utils';

const NotificationsScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      setItems([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setItems(await fetchNotifications());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Could not load notifications');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const onOpen = async (item: AppNotification) => {
    if (!item.read) {
      await markNotificationRead(item.id);
      setItems(prev =>
        prev.map(n => (n.id === item.id ? { ...n, read: true } : n)),
      );
    }
    if (item.kind === 'chat') {
      if (item.messageId != null) {
        await setLastSeenAdminMessageId(item.messageId);
      }
      navigation.navigate(ROUTES.MESSAGES);
      return;
    }
    if (item.orderId != null) {
      navigation.navigate(ROUTES.ORDER_DETAIL, { orderId: item.orderId });
    }
  };

  const onMarkAllRead = async () => {
    await markAllNotificationsRead(items.map(n => n.id));
    setItems(prev => prev.map(n => ({ ...n, read: true })));
  };

  if (!isAuthenticated) {
    return (
      <CampanaBackground>
        <View style={[styles.centered, commonStyles.maxWidthCenter]}>
          <Text style={styles.emptyTitle}>Sign in for notifications</Text>
          <Text style={styles.empty}>
            Order updates and team replies appear here once you are signed in.
          </Text>
          <CustomButton
            title="Log in"
            onPress={() => navigation.navigate(ROUTES.LOGIN)}
            style={styles.emptyBtn}
          />
        </View>
      </CampanaBackground>
    );
  }

  return (
    <CampanaBackground>
      {loading && items.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={load} tintColor={theme.colors.primary} />
          }
          ListHeaderComponent={
            <View style={styles.header}>
              {error ? <Text style={styles.error}>{error}</Text> : null}
              {items.some(n => !n.read) ? (
                <Pressable onPress={onMarkAllRead} style={styles.markAll}>
                  <Text style={styles.markAllText}>Mark all as read</Text>
                </Pressable>
              ) : null}
            </View>
          }
          ListEmptyComponent={
            !loading && !error ? (
              <Text style={styles.empty}>No notifications yet. Submit an order to get started.</Text>
            ) : null
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => onOpen(item)}
              style={({ pressed }) => [
                clientStyles.surfaceCard,
                styles.card,
                !item.read && styles.cardUnread,
                pressed && styles.cardPressed,
              ]}
            >
              <View style={styles.cardTop}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                {!item.read ? <View style={styles.dot} /> : null}
              </View>
              <Text style={styles.cardBody}>{item.body}</Text>
              <Text style={styles.cardDate}>{formatOrderDate(item.createdAt)}</Text>
            </Pressable>
          )}
        />
      )}
    </CampanaBackground>
  );
};

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingBottom: theme.spacing.xxl,
  },
  header: { paddingTop: theme.spacing.sm, paddingBottom: theme.spacing.md },
  markAll: { alignSelf: 'flex-end', paddingVertical: theme.spacing.xs },
  markAllText: { color: theme.colors.primaryLight, fontSize: 14, fontWeight: '600' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { marginBottom: theme.spacing.md },
  cardUnread: { borderColor: theme.colors.primary },
  cardPressed: { opacity: 0.92 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  cardTitle: { ...theme.typography.body, fontWeight: '600', flex: 1 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
    marginLeft: theme.spacing.sm,
  },
  cardBody: { ...theme.typography.bodyMuted, lineHeight: 20, marginBottom: 6 },
  cardDate: { ...theme.typography.caption },
  error: { color: theme.colors.error, marginBottom: theme.spacing.sm },
  empty: { ...theme.typography.bodyMuted, textAlign: 'center', paddingTop: theme.spacing.xl },
  emptyTitle: { ...theme.typography.h2, marginBottom: theme.spacing.sm, textAlign: 'center' },
  emptyBtn: { marginTop: theme.spacing.lg, minWidth: 160 },
});

export default NotificationsScreen;
