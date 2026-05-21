import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import { Card, CustomButton, CustomInput, ScreenLayout } from '../../components';
import { register as registerApi } from '../../services/authApi';
import type { RootStackParamList } from '../../types/navigation';
import { commonStyles, theme } from '../../theme/tokens';
import { BRAND_NAME, IMG, ROUTES } from '../../utils';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const onRegister = async () => {
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== passwordConfirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await registerApi({
        email: email.trim(),
        password,
        passwordConfirm,
        name: name.trim() || undefined,
      });
      navigation.replace(ROUTES.VERIFY_EMAIL_PENDING, {
        email: email.trim(),
        verifyUrl: data.verification?.api ?? data.verification?.web,
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenLayout scroll ambient>
      <View style={[styles.container, commonStyles.maxWidthCenter]}>
        <Image source={IMG.LOGO} style={styles.logo} resizeMode="contain" />
        <Text style={styles.brand}>{BRAND_NAME}</Text>
        <Text style={styles.overline}>New client</Text>
        <Text style={styles.caption}>Create your account — we will email you to verify.</Text>

        <Card elevated style={styles.card}>
          <CustomInput label="Name" placeholder="Optional" value={name} onChangeText={setName} />
          <CustomInput label="Email" placeholder="you@example.com" value={email} onChangeText={setEmail} />
          <CustomInput
            label="Password"
            placeholder="Min. 8 characters"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <CustomInput
            label="Confirm password"
            placeholder="Repeat password"
            value={passwordConfirm}
            onChangeText={setPasswordConfirm}
            secureTextEntry
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <CustomButton
            title="Register"
            onPress={onRegister}
            loading={loading}
            disabled={loading}
            fullWidth
          />
        </Card>

        <TouchableOpacity style={styles.back} onPress={() => navigation.navigate(ROUTES.LOGIN)}>
          <Text style={styles.link}>Already have an account? Sign in</Text>
        </TouchableOpacity>
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%', paddingBottom: theme.spacing.xl },
  logo: { width: 100, height: 40, alignSelf: 'center', marginBottom: theme.spacing.md },
  brand: { ...theme.typography.brand, textAlign: 'center' },
  overline: { ...theme.typography.overline, textAlign: 'center', marginBottom: theme.spacing.xs },
  caption: { ...theme.typography.caption, textAlign: 'center', marginBottom: theme.spacing.lg, marginTop: theme.spacing.xs },
  card: { marginBottom: theme.spacing.md },
  error: { color: theme.colors.error, textAlign: 'center', marginBottom: theme.spacing.md },
  back: { marginTop: theme.spacing.lg, alignItems: 'center' },
  link: { color: theme.colors.primaryLight, fontWeight: '600' },
});

export default Register;
