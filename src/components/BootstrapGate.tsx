import React, { type ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import type { Persistor } from 'redux-persist';

import { authBootstrap } from '../app/actions';
import { theme } from '../theme/tokens';

type BootstrapGateProps = {
  persistor: Persistor;
  children: ReactNode;
};

export default function BootstrapGate({ persistor, children }: BootstrapGateProps) {
  const dispatch = useDispatch();

  return (
    <PersistGate
      persistor={persistor}
      loading={
        <View style={styles.splash}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      }
      onBeforeLift={() => {
        dispatch(authBootstrap());
      }}
    >
      {children}
    </PersistGate>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
});
