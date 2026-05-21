import React, { type ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CampanaBackground from './CampanaBackground';
import { commonStyles, theme } from '../theme/tokens';

type ScreenLayoutProps = {
  children: ReactNode;
  scroll?: boolean;
  centered?: boolean;
  /** Plain full-screen background (no decorative layers) */
  ambient?: boolean;
  style?: StyleProp<ViewStyle>;
};

const ScreenLayout = ({
  children,
  scroll = false,
  centered = false,
  ambient = false,
  style,
}: ScreenLayoutProps) => {
  const inner = (
    <View style={[styles.inner, centered && styles.centered, commonStyles.maxWidthCenter, style]}>
      {children}
    </View>
  );

  if (scroll && ambient) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={[styles.scrollGrow, centered && styles.centered]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <CampanaBackground style={styles.flexGrow}>
              {inner}
            </CampanaBackground>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  const body = ambient ? <CampanaBackground>{inner}</CampanaBackground> : inner;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {scroll ? (
          <ScrollView
            contentContainerStyle={[styles.scroll, centered && styles.centered]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {body}
          </ScrollView>
        ) : (
          body
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  flex: {
    flex: 1,
  },
  flexGrow: {
    flexGrow: 1,
    minHeight: 400,
  },
  inner: {
    flex: 1,
    paddingHorizontal: theme.spacing.screenPadding,
    paddingVertical: theme.spacing.md,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.screenPadding,
    paddingVertical: theme.spacing.md,
  },
  scrollGrow: {
    flexGrow: 1,
  },
  centered: {
    justifyContent: 'center',
  },
});

export default ScreenLayout;
