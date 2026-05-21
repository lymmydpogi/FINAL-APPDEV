import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { RouteProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import { CustomButton, CustomInput, CampanaBackground, useToast } from '../../components';
import ServiceStatusBadge from '../../components/ServiceStatusBadge';
import { OrderApiError } from '../../services/ordersApi';
import { getServiceBySlug } from '../../constants/clientServices';
import { createOrderFromService } from '../../services/ordersApi';
import { fetchServiceBySlug } from '../../services/servicesApi';
import type { ServiceItem } from '../../types/api';
import type { RootStackParamList } from '../../types/navigation';
import { clientStyles, commonStyles, theme } from '../../theme/tokens';
import { formatPeso } from '../../utils/format';
import { useAuth } from '../../hooks/useAuth';
import { resetToOrderDetailAfterCreate } from '../../utils/navigationHelpers';
import {
  isServiceOrderable,
  MSG_SERVICE_INACTIVE,
  serviceUnavailableLabel,
} from '../../utils/serviceStatus';
import { ROUTES } from '../../utils';

const MIN_BRIEF = 20;

type Props = {
  route: RouteProp<RootStackParamList, typeof ROUTES.SERVICE_DETAIL>;
};

const ServiceDetailScreen = ({ route }: Props) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { slug, name: paramName, serviceId: paramId } = route.params;
  const { isAuthenticated } = useAuth();

  const [service, setService] = useState<ServiceItem | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const [projectBrief, setProjectBrief] = useState('');
  const [briefError, setBriefError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const fallback = getServiceBySlug(slug);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const s = await fetchServiceBySlug(slug);
      setService(s);
    } catch {
      if (fallback) {
        setService({
          id: paramId ?? 0,
          name: fallback.name,
          slug: fallback.slug,
          description: fallback.tagline,
          status: 'active',
          isOrderable: true,
          is_active: true,
        });
      }
    } finally {
      setLoading(false);
    }
  }, [slug, fallback, paramId]);

  useEffect(() => {
    load();
  }, [load]);

  const displayName = service?.name ?? paramName ?? fallback?.name ?? 'Service';
  const serviceId = service?.id ?? paramId;
  const orderable = service ? isServiceOrderable(service) : true;
  const canSubmit = isAuthenticated && orderable;

  const onSubmitBrief = async () => {
    if (submitting) {
      return;
    }
    setBriefError(null);
    setFieldErrors({});

    if (service && !isServiceOrderable(service)) {
      Alert.alert('Unavailable', MSG_SERVICE_INACTIVE);
      return;
    }

    const trimmed = projectBrief.trim();
    if (trimmed.length < MIN_BRIEF) {
      setFieldErrors({
        projectBrief: 'Please provide at least 20 characters so we understand your goals.',
      });
      return;
    }

    if (!isAuthenticated) {
      Alert.alert(
        'Sign in required',
        'Please sign in with your Campana Designs account to submit a project brief.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Log in',
            onPress: () =>
              navigation.navigate(ROUTES.LOGIN, {
                returnTo: {
                  name: ROUTES.SERVICE_DETAIL,
                  params: { slug, name: displayName, serviceId },
                },
              }),
          },
        ],
      );
      return;
    }

    if (!serviceId) {
      Alert.alert('Error', 'This service could not be ordered. Please try again from the services list.');
      return;
    }

    setSubmitting(true);
    try {
      const { orderId, message } = await createOrderFromService(serviceId, trimmed);
      showToast(message, 'success');
      resetToOrderDetailAfterCreate(navigation, orderId);
    } catch (e: unknown) {
      if (e instanceof OrderApiError) {
        const msg = e.message;
        if (msg === MSG_SERVICE_INACTIVE || e.status === 422) {
          Alert.alert('Unavailable', msg);
          return;
        }
        if (Object.keys(e.fieldErrors).length > 0) {
          setFieldErrors(e.fieldErrors);
          const first = Object.values(e.fieldErrors)[0];
          if (first) {
            setBriefError(first);
          }
          return;
        }
        setBriefError(msg);
        showToast(msg, 'error');
        return;
      }
      const msg = e instanceof Error ? e.message : 'Could not submit project brief';
      setBriefError(msg);
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <CampanaBackground>
        <View style={styles.centered}>
          <ActivityIndicator color={theme.colors.textMuted} size="large" />
        </View>
      </CampanaBackground>
    );
  }

  return (
    <CampanaBackground>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={clientStyles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={commonStyles.maxWidthCenter}>
          <View style={clientStyles.pageHeader}>
            <Text style={styles.label}>Service</Text>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{displayName}</Text>
              {!orderable && service ? (
                <ServiceStatusBadge label={serviceUnavailableLabel(service)} />
              ) : null}
            </View>
            {service?.price != null ? (
              <Text style={styles.price}>{formatPeso(service.price)}</Text>
            ) : null}
          </View>

          <Text style={styles.body}>
            {service?.description ??
              fallback?.tagline ??
              'Deliver polished creative output aligned to your goals, timeline, and brand standards.'}
          </Text>

          <View style={clientStyles.section}>
            <Text style={clientStyles.sectionTitle}>What you get</Text>
            <Text style={styles.bullet}>Clear deliverables from start to finish</Text>
            <Text style={styles.bullet}>Consistent quality and communication</Text>
            <Text style={styles.bullet}>Practical, ready-to-use final files</Text>
          </View>

          {!orderable ? (
            <View style={[clientStyles.surfaceCard, styles.unavailableCard]}>
              <Text style={styles.unavailableTitle}>Currently unavailable</Text>
              <Text style={styles.unavailableBody}>
                This service is not accepting new orders right now. Existing orders for this service
                are not affected.
              </Text>
            </View>
          ) : (
            <View style={clientStyles.section}>
              <Text style={clientStyles.sectionTitle}>Project brief</Text>
            <Text style={styles.formHint}>
              Each submission creates a new order. Tell us about your project in at least 20 characters.
            </Text>
              <CustomInput
                label="Project brief"
                value={projectBrief}
                onChangeText={setProjectBrief}
                placeholder="Describe your goals, timeline, and references…"
                multiline
                error={fieldErrors.projectBrief ?? briefError ?? undefined}
              />
              <CustomButton
                title="Submit project brief"
                onPress={onSubmitBrief}
                loading={submitting}
                disabled={submitting || !canSubmit}
                fullWidth
              />
              {!isAuthenticated ? (
                <Text style={styles.signInHint}>Sign in to submit your project brief.</Text>
              ) : null}
            </View>
          )}
        </View>
      </ScrollView>
    </CampanaBackground>
  );
};

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  label: { ...theme.typography.overline, marginBottom: theme.spacing.xs },
  titleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  title: { ...theme.typography.titleLarge, flexShrink: 1 },
  price: { fontSize: 17, fontWeight: '500', color: theme.colors.textMuted, marginBottom: theme.spacing.sm },
  body: { ...theme.typography.bodyMuted, lineHeight: 24 },
  bullet: { ...theme.typography.bodyMuted, marginBottom: theme.spacing.xs, paddingLeft: theme.spacing.sm },
  unavailableCard: { marginTop: theme.spacing.md },
  unavailableTitle: { ...theme.typography.h2, fontSize: 17, marginBottom: theme.spacing.sm },
  unavailableBody: { ...theme.typography.bodyMuted, lineHeight: 22 },
  formHint: { ...theme.typography.caption, marginBottom: theme.spacing.md },
  signInHint: { ...theme.typography.caption, textAlign: 'center', marginTop: theme.spacing.md },
});

export default ServiceDetailScreen;
