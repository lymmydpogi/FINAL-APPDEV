import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import CampanaBackground from '../../components/CampanaBackground';
import { CustomButton, CustomInput } from '../../components';
import { ORDER_STATUS } from '../../constants/orderStatus';
import { CLIENT_SERVICES } from '../../constants/clientServices';
import { fetchClientServices } from '../../services/servicesApi';
import { isServiceOrderable } from '../../utils/serviceStatus';
import { getOrder, OrderApiError, updateOrder } from '../../services/ordersApi';
import type { ServiceItem } from '../../types/api';
import type { RootStackParamList } from '../../types/navigation';
import { clientStyles, commonStyles, theme } from '../../theme/tokens';
import { formatPeso } from '../../utils/format';
import { ROUTES } from '../../utils';

const MIN_BRIEF = 20;
const MSG_NOT_EDITABLE = 'This order can no longer be edited because it is already being processed.';
const MSG_ADMIN_CHANGED = 'This order was already updated by the admin and can no longer be modified.';

type Props = {
  route: RouteProp<RootStackParamList, typeof ROUTES.ORDER_EDIT>;
};

const OrderEditScreen = ({ route }: Props) => {
  const { orderId } = route.params;
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [blocked, setBlocked] = useState<string | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [serviceId, setServiceId] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [lastTotal, setLastTotal] = useState<number | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    setBlocked(null);
    setFieldErrors({});
    try {
      const [order, serviceList] = await Promise.all([getOrder(orderId), fetchClientServices()]);

      const editable = order.canEdit === true || order.status === ORDER_STATUS.PENDING;
      if (!editable) {
        setBlocked(MSG_NOT_EDITABLE);
        return;
      }

      const orderableFromApi = serviceList.filter(isServiceOrderable);
      const list =
        orderableFromApi.length > 0
          ? orderableFromApi
          : CLIENT_SERVICES.map((s, i) => ({
              id: i + 1,
              name: s.name,
              slug: s.slug,
              description: s.tagline,
              status: 'active',
              isOrderable: true,
              is_active: true,
            }));

      setServices(list);
      setServiceId(order.serviceId ?? list[0]?.id ?? null);
      setNotes(order.notes ?? '');
      setLastTotal(order.totalPrice);
    } catch (e: unknown) {
      if (e instanceof OrderApiError && e.status === 404) {
        setBlocked('Order not found.');
      } else if (e instanceof OrderApiError && e.status === 403) {
        setBlocked('You are not allowed to modify this order.');
      } else {
        setBlocked(e instanceof Error ? e.message : 'Could not load order');
      }
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const onSave = async () => {
    if (submitting || blocked || serviceId == null) {
      return;
    }

    const trimmed = notes.trim();
    const localErrors: Record<string, string> = {};

    if (trimmed.length < MIN_BRIEF) {
      localErrors.notes = 'Please provide at least 20 characters for your project brief.';
    }

    if (Object.keys(localErrors).length > 0) {
      setFieldErrors(localErrors);
      return;
    }

    setSubmitting(true);
    setFieldErrors({});

    try {
      const updated = await updateOrder(orderId, {
        serviceId,
        notes: trimmed,
      });
      navigation.replace(ROUTES.ORDER_DETAIL, { orderId: updated.id });
    } catch (e: unknown) {
      if (e instanceof OrderApiError) {
        if (e.message === MSG_ADMIN_CHANGED || e.status === 422) {
          Alert.alert('Cannot edit', e.message, [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
          return;
        }
        if (e.fieldErrors && Object.keys(e.fieldErrors).length > 0) {
          setFieldErrors(e.fieldErrors);
          return;
        }
        Alert.alert('Update failed', e.message);
        return;
      }
      Alert.alert('Update failed', e instanceof Error ? e.message : 'Could not update order');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <CampanaBackground>
        <View style={styles.centered}>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </View>
      </CampanaBackground>
    );
  }

  if (blocked) {
    return (
      <CampanaBackground>
        <View style={[styles.centered, commonStyles.maxWidthCenter]}>
          <Text style={styles.blocked}>{blocked}</Text>
          <CustomButton title="Go back" onPress={() => navigation.goBack()} style={styles.backBtn} />
        </View>
      </CampanaBackground>
    );
  }

  return (
    <CampanaBackground>
      <ScrollView
        contentContainerStyle={clientStyles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={commonStyles.maxWidthCenter}>
          <Text style={styles.intro}>
            Your total updates when you save based on the service you choose.
          </Text>
          {lastTotal != null ? (
            <Text style={styles.lastTotal}>Current total: {formatPeso(lastTotal)}</Text>
          ) : null}

          <Text style={clientStyles.sectionTitle}>Service</Text>
          <View style={styles.serviceList}>
            {services.map(s => {
              const selected = serviceId === s.id;
              return (
                <Pressable
                  key={s.id}
                  style={[styles.serviceOption, selected && styles.serviceOptionSelected]}
                  onPress={() => setServiceId(s.id)}
                >
                  <Text style={[styles.serviceName, selected && styles.serviceNameSelected]}>
                    {s.name}
                  </Text>
                  {s.price != null ? (
                    <Text style={styles.servicePrice}>{formatPeso(s.price)}</Text>
                  ) : null}
                </Pressable>
              );
            })}
          </View>
          {fieldErrors.serviceId ? (
            <Text style={styles.fieldError}>{fieldErrors.serviceId}</Text>
          ) : null}

          <CustomInput
            label="Project brief"
            value={notes}
            onChangeText={setNotes}
            placeholder={`At least ${MIN_BRIEF} characters…`}
            multiline
            error={fieldErrors.notes ?? fieldErrors.projectBrief}
          />

          <CustomButton
            title="Save changes"
            onPress={onSave}
            loading={submitting}
            disabled={submitting}
            fullWidth
          />
        </View>
      </ScrollView>
    </CampanaBackground>
  );
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', padding: theme.spacing.screenPadding },
  intro: { ...theme.typography.bodyMuted, marginBottom: theme.spacing.sm, lineHeight: 22 },
  lastTotal: { ...theme.typography.caption, marginBottom: theme.spacing.lg },
  serviceList: { gap: theme.spacing.sm, marginBottom: theme.spacing.lg },
  serviceOption: {
    padding: theme.spacing.md,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    backgroundColor: theme.colors.backgroundElevated,
  },
  serviceOptionSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
  },
  serviceName: { ...theme.typography.body, fontWeight: '500' },
  serviceNameSelected: { color: theme.colors.primaryLight },
  servicePrice: { ...theme.typography.caption, marginTop: 4 },
  fieldError: { color: theme.colors.error, fontSize: 12, marginBottom: theme.spacing.md },
  blocked: { ...theme.typography.body, color: theme.colors.error, textAlign: 'center', lineHeight: 22 },
  backBtn: { marginTop: theme.spacing.lg },
});

export default OrderEditScreen;
