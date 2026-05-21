import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';

import { authGoogleLogin, authLogin } from '../../app/actions';
import { friendlyAuthMessage } from '../../constants/mobileAuth';
import { Card, CustomButton, CustomInput, ScreenLayout, useToast } from '../../components';
import type { RootStackParamList } from '../../types/navigation';
import type { RootState } from '../../types/redux';
import type { SessionPayload } from '../../types/redux';
import { commonStyles, theme } from '../../theme/tokens';
import { BRAND_NAME, IMG, ROUTES } from '../../utils';
import { navigateAfterAuth } from '../../utils/navigateAfterAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, typeof ROUTES.LOGIN>>();
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  const { showToast } = useToast();

  const inlineError =
    auth.isError && auth.error
      ? friendlyAuthMessage(auth.error)
      : null;

  useEffect(() => {
    if (!auth.isLoading && auth.isError && auth.error && auth.error.trim() !== '') {
      setPassword('');
    }
  }, [auth.isLoading, auth.isError, auth.error]);

  useEffect(() => {
    if (!auth.isLoading && auth.data) {
      showToast('Welcome back', 'success');
      navigateAfterAuth(
        navigation,
        auth.data as SessionPayload,
        route.params?.returnTo,
      );
    }
  }, [auth.isLoading, auth.data, navigation, route.params?.returnTo, showToast]);

  const onLogin = () => {
    if (auth.isLoading) {
      return;
    }
    if (!email.trim() || !password) {
      showToast('Enter your email and password.', 'error');
      return;
    }
    dispatch(authLogin({ username: email.trim(), password }));
  };

  return (
    <ScreenLayout scroll centered ambient>
      <View style={[styles.container, commonStyles.maxWidthCenter]}>
        <Image source={IMG.LOGO} style={styles.logo} resizeMode="contain" />
        <Text style={styles.brand}>{BRAND_NAME}</Text>
        <Text style={styles.overline}>Welcome back</Text>
        <Text style={styles.caption}>Sign in to continue</Text>

        <Card elevated style={styles.card}>
          <CustomInput
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            editable={!auth.isLoading}
          />
          <CustomInput
            label="Password"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!auth.isLoading}
          />

          {inlineError ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{inlineError}</Text>
            </View>
          ) : null}

          <CustomButton
            title="Sign in with email"
            onPress={onLogin}
            loading={auth.isLoading}
            disabled={auth.isLoading}
            fullWidth
          />

          <Text style={styles.divider}>or</Text>

          <CustomButton
            title="Continue with Google"
            variant="outline"
            onPress={() => dispatch(authGoogleLogin())}
            loading={auth.isLoading}
            disabled={auth.isLoading}
            fullWidth
          />
        </Card>

        <View style={styles.footer}>
          <Text style={styles.footerText}>No account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate(ROUTES.REGISTER)}>
            <Text style={styles.link}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%', paddingBottom: theme.spacing.xl },
  logo: { width: 120, height: 48, alignSelf: 'center', marginBottom: theme.spacing.md },
  brand: { ...theme.typography.brand, textAlign: 'center', marginBottom: theme.spacing.xs },
  overline: { ...theme.typography.overline, textAlign: 'center', marginBottom: theme.spacing.xs },
  caption: { ...theme.typography.caption, textAlign: 'center', marginBottom: theme.spacing.lg },
  card: { marginBottom: theme.spacing.lg },
  errorBox: {
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.errorBg,
    borderWidth: 1,
    borderColor: theme.colors.errorBorder,
  },
  errorText: { color: theme.colors.error, fontSize: 14, fontWeight: '500', lineHeight: 22 },
  divider: { textAlign: 'center', color: theme.colors.textMuted, marginVertical: theme.spacing.md, fontSize: 14 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: theme.spacing.lg, gap: 6 },
  footerText: { ...theme.typography.caption },
  link: { color: theme.colors.primaryLight, fontWeight: '600', fontSize: 14 },
});

export default Login;
