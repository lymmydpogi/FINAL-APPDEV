import { StyleSheet } from 'react-native';
import type { StackNavigationOptions } from '@react-navigation/stack';

import HeaderBack from '../components/HeaderBack';
import { theme } from '../theme/tokens';

export const appStackScreenOptions: StackNavigationOptions = {
  headerStyle: {
    backgroundColor: theme.colors.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.surfaceBorder,
  },
  headerTintColor: theme.colors.textStrong,
  headerTitleStyle: { ...theme.typography.h2, fontSize: 18 },
  headerShadowVisible: false,
  headerBackTitle: '',
  headerLeft: ({ canGoBack, onPress, tintColor }) =>
    canGoBack ? (
      <HeaderBack onPress={onPress} tintColor={tintColor ?? theme.colors.textStrong} />
    ) : null,
};
