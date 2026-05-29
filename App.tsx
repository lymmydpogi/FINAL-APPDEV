import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import BootstrapGate from './src/components/BootstrapGate';
import { ActivityBannerProvider } from './src/context/ActivityBannerContext';
import { ToastProvider } from './src/context/ToastContext';
import AppNav from './src/navigations/index';
import rootSaga from './src/app/sagas';
import configureStore from './src/app/reducers';
import { initializeGoogleSignIn } from './src/auth/googleSignIn';
import { getApiHostLabel, IS_USING_LOCAL_API_OVERRIDE } from './src/services/config';
import { theme } from './src/theme/tokens';

const { store, persistor, runSaga } = configureStore();
runSaga(rootSaga);

const App = () => {
  useEffect(() => {
    initializeGoogleSignIn();
    if (__DEV__) {
      console.log(
        `[Campana API] ${getApiHostLabel()}${IS_USING_LOCAL_API_OVERRIDE ? ' (local override)' : ' (Railway production)'}`,
      );
    }
  }, []);

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <ToastProvider>
          <ActivityBannerProvider>
            <BootstrapGate persistor={persistor}>
              <View style={styles.root}>
                <AppNav />
              </View>
            </BootstrapGate>
          </ActivityBannerProvider>
        </ToastProvider>
      </SafeAreaProvider>
    </Provider>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});

export default App;
