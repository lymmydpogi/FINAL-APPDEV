import React, { useCallback } from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';

import { CustomButton, ScreenLayout } from '../../components';
import { authUserRefresh } from '../../app/actions';
import { getMe } from '../../services/profileApi';
import type { RootStackParamList } from '../../types/navigation';
import { theme } from '../../theme/tokens';
import { ROUTES } from '../../utils';

const VerifyEmailPendingScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, typeof ROUTES.VERIFY_EMAIL_PENDING>>();
  const dispatch = useDispatch();
  const email = route.params?.email ?? 'your email';
  const verifyUrl = route.params?.verifyUrl;

  const onOpenLink = () => {
    if (verifyUrl) {
      Linking.openURL(verifyUrl);
    }
  };

  const onContinue = useCallback(async () => {
    try {
      const user = await getMe();
      dispatch(authUserRefresh(user));
      if (user.isVerified) {
        navigation.replace(ROUTES.MAIN_TABS);
      }
    } catch {
      navigation.navigate(ROUTES.LOGIN);
    }
  }, [dispatch, navigation]);

  return (
    <ScreenLayout scroll centered>
      <View style={styles.card}>
        <Text style={styles.title}>Verify your email</Text>
        <Text style={styles.body}>
          We sent a verification link to {email}. Open it on this device, then tap “I verified my email”.
        </Text>
        {verifyUrl ? (
          <CustomButton title="Open verification link" onPress={onOpenLink} style={styles.btn} />
        ) : null}
        <CustomButton title="I verified my email" variant="outline" onPress={onContinue} />
        <CustomButton
          title="Back to sign in"
          variant="ghost"
          onPress={() => navigation.navigate(ROUTES.LOGIN)}
          style={styles.btn}
        />
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
  },
  title: { ...theme.typography.title, marginBottom: theme.spacing.md },
  body: { ...theme.typography.body, color: theme.colors.textMuted, lineHeight: 22, marginBottom: theme.spacing.lg },
  btn: { marginTop: theme.spacing.sm },
});

export default VerifyEmailPendingScreen;
