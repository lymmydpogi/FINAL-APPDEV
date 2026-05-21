import { NavigationContainer } from '@react-navigation/native';
import { useEffect } from 'react';
import { Platform, StatusBar } from 'react-native';

import AuthGate from '../components/AuthGate';
import AuthInterceptors from '../components/AuthInterceptors';
import { linking } from './linking';
import { navigationRef } from './navigationRef';
import RootNav from './RootNav';

export { navigationRef } from './navigationRef';

export default function AppNavigation() {
  useEffect(() => {
    StatusBar.setBarStyle('light-content', true);
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('#020617', true);
    }
  }, []);

  return (
    <NavigationContainer ref={navigationRef} linking={linking as never}>
      <AuthInterceptors />
      <AuthGate>
        <RootNav />
      </AuthGate>
    </NavigationContainer>
  );
}
