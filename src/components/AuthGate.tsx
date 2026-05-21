import React, { type ReactNode, useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useAuth } from '../hooks/useAuth';
import { navigationRef } from '../navigations/navigationRef';
import { theme } from '../theme/tokens';
import { ROUTES } from '../utils';

/**
 * Blocks children until auth bootstrap finishes.
 * Redirects unverified clients to VerifyEmailPending (via navigationRef — this
 * component sits above the stack, so useNavigation cannot be used here).
 */
export default function AuthGate({ children }: { children: ReactNode }) {
  const { isBootstrapping, isAuthenticated, needsVerification } = useAuth();

  useEffect(() => {
    if (isBootstrapping || !isAuthenticated || !needsVerification) {
      return;
    }

    const redirectIfNeeded = () => {
      if (!navigationRef.isReady()) {
        return;
      }
      const name = navigationRef.getCurrentRoute()?.name;
      if (name === ROUTES.VERIFY_EMAIL_PENDING || name === ROUTES.VERIFY_EMAIL) {
        return;
      }
      navigationRef.navigate(ROUTES.VERIFY_EMAIL_PENDING);
    };

    redirectIfNeeded();
    const unsubscribe = navigationRef.addListener('state', redirectIfNeeded);
    return unsubscribe;
  }, [isBootstrapping, isAuthenticated, needsVerification]);

  if (isBootstrapping) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
});
