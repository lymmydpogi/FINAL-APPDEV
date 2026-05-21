import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { AlertCircle, ChevronRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { StackNavigationProp } from '@react-navigation/stack';

import CampanaBackground from '../../components/CampanaBackground';
import ServiceStatusBadge from '../../components/ServiceStatusBadge';
import { ServiceRowIcon } from '../../components/CampanaIcons';
import { CLIENT_SERVICES } from '../../constants/clientServices';
import { fetchClientServices } from '../../services/servicesApi';
import type { ServiceItem } from '../../types/api';
import type { ClientTabParamList, RootStackParamList } from '../../types/navigation';
import { clientStyles, commonStyles, theme } from '../../theme/tokens';
import { formatPeso } from '../../utils/format';
import { serviceIconFor } from '../../utils/serviceIcons';
import { isServiceOrderable, serviceUnavailableLabel } from '../../utils/serviceStatus';
import { slugify } from '../../utils/slugify';
import { ROUTES } from '../../utils';

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<ClientTabParamList, typeof ROUTES.TAB_SERVICES>,
  StackNavigationProp<RootStackParamList>
>;

const ServicesScreen = () => {
  const navigation = useNavigation<Nav>();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await fetchClientServices();
      if (list.length > 0) {
        setServices(list);
      } else {
        setServices(
          CLIENT_SERVICES.map((s, i) => ({
            id: i + 1,
            name: s.name,
            slug: s.slug,
            description: s.tagline,
            status: 'active',
            statusLabel: 'Active',
            isOrderable: true,
            is_active: true,
          })),
        );
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Could not load services');
      setServices(
        CLIENT_SERVICES.map((s, i) => ({
          id: i + 1,
          name: s.name,
          slug: s.slug,
          description: s.tagline,
          status: 'active',
          statusLabel: 'Active',
          isOrderable: true,
          is_active: true,
        })),
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const listHeader = useMemo(
    () => (
      <View style={[commonStyles.maxWidthCenter, styles.header]}>
        <Text style={styles.headline}>Creative work, built for you</Text>
        <Text style={styles.hint}>All offerings from our catalog.</Text>
        {loading ? <ActivityIndicator color={theme.colors.textMuted} style={styles.loader} /> : null}
        {error && !loading ? (
          <View style={styles.warnRow}>
            <AlertCircle size={18} color={theme.colors.error} strokeWidth={1.75} />
            <View style={styles.warnTextCol}>
              <Text style={styles.warn}>{error}</Text>
              <Text style={styles.warnSub}>Showing saved list. Pull to retry.</Text>
            </View>
          </View>
        ) : null}
        {!loading && services.length > 0 ? (
          <View style={styles.listDivider} />
        ) : null}
      </View>
    ),
    [loading, error, services.length],
  );

  return (
    <CampanaBackground>
      <FlatList
        style={styles.list}
        data={services}
        keyExtractor={item => String(item.id)}
        refreshing={loading}
        onRefresh={load}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.empty}>No services available right now.</Text>
          ) : null
        }
        renderItem={({ item }) => {
          const slug = item.slug ?? slugify(item.name);
          const RowIcon = serviceIconFor(slug, item.name);
          const orderable = isServiceOrderable(item);
          return (
            <Pressable
              style={({ pressed }) => [
                commonStyles.maxWidthCenter,
                clientStyles.surfaceCard,
                styles.serviceCard,
                !orderable && styles.serviceCardInactive,
                pressed && styles.rowPressed,
              ]}
              onPress={() =>
                navigation.getParent()?.navigate(ROUTES.SERVICE_DETAIL, {
                  slug,
                  name: item.name,
                  serviceId: item.id,
                })
              }
            >
              <View style={styles.row}>
                <ServiceRowIcon icon={RowIcon} />
                <View style={styles.rowBody}>
                  <View style={styles.rowTop}>
                    <Text style={styles.name}>{item.name}</Text>
                    {item.price != null ? (
                      <Text style={styles.price}>{formatPeso(item.price)}</Text>
                    ) : null}
                  </View>
                  {!orderable ? (
                    <View style={styles.badgeWrap}>
                      <ServiceStatusBadge label={serviceUnavailableLabel(item)} />
                    </View>
                  ) : null}
                  {item.description ? (
                    <Text style={styles.tagline} numberOfLines={2}>
                      {item.description}
                    </Text>
                  ) : null}
                  <View style={styles.ctaRow}>
                    <Text style={[styles.cta, !orderable && styles.ctaMuted]}>
                      {orderable ? 'View details & order' : 'View details'}
                    </Text>
                    <ChevronRight
                      size={16}
                      color={orderable ? theme.colors.primary : theme.colors.textMuted}
                      strokeWidth={1.75}
                    />
                  </View>
                </View>
              </View>
            </Pressable>
          );
        }}
      />
    </CampanaBackground>
  );
};

const styles = StyleSheet.create({
  list: { flex: 1 },
  listContent: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingBottom: theme.spacing.xxl,
    gap: theme.spacing.md,
  },
  header: { paddingTop: theme.spacing.md, paddingBottom: theme.spacing.sm },
  headline: { ...theme.typography.h1, fontSize: 24, marginBottom: theme.spacing.xs },
  hint: { ...theme.typography.caption },
  loader: { marginTop: theme.spacing.lg },
  warnRow: {
    marginTop: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.errorBg,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.errorBorder,
  },
  warnTextCol: { flex: 1 },
  warn: { color: theme.colors.error, fontWeight: '500', fontSize: 14 },
  warnSub: { color: theme.colors.textMuted, fontSize: 12, marginTop: 2 },
  listDivider: { marginTop: theme.spacing.md },
  serviceCard: { marginBottom: theme.spacing.md },
  serviceCardInactive: { opacity: 0.92 },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  rowBody: { flex: 1, minWidth: 0 },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
  },
  badgeWrap: { marginTop: theme.spacing.xs, alignSelf: 'flex-start' },
  rowPressed: { opacity: 0.85 },
  name: { flex: 1, ...theme.typography.h2, fontSize: 17 },
  price: { fontSize: 14, fontWeight: '600', color: theme.colors.primaryLight },
  tagline: { ...theme.typography.bodyMuted, marginTop: theme.spacing.xs, fontSize: 14 },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    gap: 2,
  },
  cta: { fontSize: 13, fontWeight: '500', color: theme.colors.primary },
  ctaMuted: { color: theme.colors.textMuted },
  empty: { ...theme.typography.bodyMuted, textAlign: 'center', marginTop: theme.spacing.xl },
});

export default ServicesScreen;
