import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import { CustomButton, ScreenLayout } from '../../components';
import { verifyEmailToken } from '../../services/verifyEmailApi';
import type { RootStackParamList } from '../../types/navigation';
import { theme } from '../../theme/tokens';
import { ROUTES } from '../../utils';

const VerifyEmailScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, typeof ROUTES.VERIFY_EMAIL>>();
  const token = route.params.token;

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const msg = await verifyEmailToken(token);
        if (!cancelled) {
          setMessage(msg);
          setSuccess(true);
        }
      } catch (e: unknown) {
        if (!cancelled) {
          setMessage(e instanceof Error ? e.message : 'Verification failed');
          setSuccess(false);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <ScreenLayout scroll centered>
      <View style={styles.card}>
        {loading ? <ActivityIndicator color={theme.colors.primary} size="large" /> : null}
        {!loading ? (
          <>
            <Text style={styles.title}>{success ? 'Email verified' : 'Verification failed'}</Text>
            <Text style={styles.body}>{message}</Text>
            <CustomButton
              title="Go to sign in"
              onPress={() => navigation.navigate(ROUTES.LOGIN)}
              style={styles.btn}
            />
          </>
        ) : null}
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  title: { ...theme.typography.title, marginBottom: theme.spacing.md, textAlign: 'center' },
  body: { ...theme.typography.body, color: theme.colors.textMuted, textAlign: 'center', marginBottom: theme.spacing.lg },
  btn: { marginTop: theme.spacing.md },
});

export default VerifyEmailScreen;
