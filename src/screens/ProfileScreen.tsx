import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Camera, ChevronRight, Package } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { launchImageLibrary } from 'react-native-image-picker';
import { useDispatch } from 'react-redux';

import CampanaBackground from '../components/CampanaBackground';
import { CustomButton, CustomInput, useToast } from '../components';
import { authLogout, authUserRefresh } from '../app/actions';
import { useAuth } from '../hooks/useAuth';
import { getMe, updateProfileWithAvatar } from '../services/authApi';
import type { RootStackParamList } from '../types/navigation';
import { clientStyles, commonStyles, theme } from '../theme/tokens';
import { extractProfileErrorMessage } from '../utils/authErrorMessage';
import { displayNameFromUser } from '../utils/format';
import { ROUTES } from '../utils';

function formatJoined(iso?: string | null): string {
  if (!iso) {
    return '—';
  }
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return '—';
  }
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const ProfileScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, typeof ROUTES.PROFILE>>();
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [joined, setJoined] = useState('—');
  const [localAvatarUri, setLocalAvatarUri] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(
    route.params?.orderSuccessMessage ?? null,
  );

  useEffect(() => {
    if (route.params?.orderSuccessMessage) {
      setSuccessBanner(route.params.orderSuccessMessage);
    }
  }, [route.params?.orderSuccessMessage]);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const user = await getMe();
      setFirstName(user.firstName ?? '');
      setLastName(user.lastName ?? '');
      setEmail(user.email ?? '');
      setAvatarUrl(user.avatarUrl ?? null);
      setJoined(formatJoined(user.createdAt));
      dispatch(authUserRefresh(user));
    } catch (e: unknown) {
      setError(extractProfileErrorMessage(e, "We couldn't load your profile. Please try again."));
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigation.replace(ROUTES.LOGIN);
      return;
    }
    loadProfile();
  }, [loadProfile, isAuthenticated, navigation]);

  const onPickPhoto = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, response => {
      if (response.didCancel || response.errorCode) {
        return;
      }
      const asset = response.assets?.[0];
      if (asset?.uri) {
        setLocalAvatarUri(asset.uri);
      }
    });
  };

  const onSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const user = await updateProfileWithAvatar(
        {
          firstName: firstName.trim() || null,
          lastName: lastName.trim() || null,
        },
        localAvatarUri
          ? {
              uri: localAvatarUri,
              type: 'image/jpeg',
              fileName: 'avatar.jpg',
            }
          : undefined,
      );
      dispatch(authUserRefresh(user));
      setAvatarUrl(user.avatarUrl ?? null);
      setLocalAvatarUri(null);
      showToast('Profile updated successfully.', 'success');
    } catch (e: unknown) {
      setError(extractProfileErrorMessage(e, "We couldn't save your changes. Please try again."));
    } finally {
      setSaving(false);
    }
  };

  const displayName = displayNameFromUser({ firstName, lastName, name: null }) || 'Client';
  const initial = (firstName || email || '?').charAt(0).toUpperCase();
  const imageSource = localAvatarUri ? { uri: localAvatarUri } : avatarUrl ? { uri: avatarUrl } : null;

  return (
    <CampanaBackground>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={clientStyles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={commonStyles.maxWidthCenter}>
          <Text style={styles.intro}>
            Update your details and profile picture to keep your account current.
          </Text>

          {successBanner ? (
            <View style={styles.successBox}>
              <Text style={styles.successText}>{successBanner}</Text>
            </View>
          ) : null}

          {loading ? (
            <ActivityIndicator color={theme.colors.textMuted} style={styles.loader} />
          ) : (
            <>
              <View style={styles.identityRow}>
                <Pressable onPress={onPickPhoto} style={styles.avatarPress}>
                  {imageSource ? (
                    <Image source={imageSource} style={styles.avatarImage} />
                  ) : (
                    <View style={styles.avatarFallback}>
                      <Text style={styles.avatarInitial}>{initial}</Text>
                    </View>
                  )}
                  <View style={styles.cameraBadge}>
                    <Camera size={14} color={theme.colors.onPrimary} strokeWidth={2} />
                  </View>
                </Pressable>
                <View style={styles.identityText}>
                  <Text style={styles.displayName}>{displayName}</Text>
                  <Text style={styles.metaEmail}>{email}</Text>
                  <Text style={styles.metaJoined}>Joined {joined}</Text>
                  <Pressable onPress={onPickPhoto} hitSlop={8}>
                    <Text style={styles.changePhotoLink}>Change photo</Text>
                  </Pressable>
                </View>
              </View>

              <View style={clientStyles.section}>
                <Text style={clientStyles.sectionTitle}>Account details</Text>
                <View style={styles.nameRow}>
                  <View style={styles.nameCol}>
                    <CustomInput label="First name" value={firstName} onChangeText={setFirstName} />
                  </View>
                  <View style={styles.nameCol}>
                    <CustomInput label="Last name" value={lastName} onChangeText={setLastName} />
                  </View>
                </View>
                <CustomInput
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  editable={false}
                  containerStyle={styles.emailField}
                />
                <Text style={styles.emailHint}>Email is managed by your sign-in method.</Text>
                {error ? <Text style={styles.error}>{error}</Text> : null}
                <CustomButton title="Save changes" onPress={onSave} loading={saving} fullWidth />
              </View>

              <View style={clientStyles.section}>
                <Text style={clientStyles.sectionTitle}>Orders</Text>
                <Pressable
                  style={({ pressed }) => [styles.menuRow, pressed && styles.menuRowPressed]}
                  onPress={() =>
                    navigation.navigate(ROUTES.MY_ORDERS)
                  }
                >
                  <Package size={20} color={theme.colors.textMuted} strokeWidth={1.75} />
                  <Text style={styles.menuLabel}>My orders</Text>
                  <ChevronRight size={18} color={theme.colors.textMuted} strokeWidth={1.75} />
                </Pressable>
              </View>

              <View style={clientStyles.section}>
                <CustomButton
                  title="Log out"
                  variant="outline"
                  onPress={() => {
                    Alert.alert('Log out', 'Sign out of your Campana Designs account?', [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Log out',
                        style: 'destructive',
                        onPress: () => dispatch(authLogout()),
                      },
                    ]);
                  }}
                  fullWidth
                />
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </CampanaBackground>
  );
};

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  intro: { ...theme.typography.bodyMuted, marginBottom: theme.spacing.lg, lineHeight: 22 },
  loader: { marginVertical: theme.spacing.xxl },
  successBox: {
    borderWidth: 1,
    borderColor: theme.colors.successBorder,
    backgroundColor: theme.colors.successBg,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  successText: { color: theme.colors.successText, fontSize: 14, lineHeight: 20 },
  identityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  avatarPress: { position: 'relative' },
  avatarImage: { width: 72, height: 72, borderRadius: 36 },
  avatarFallback: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: { fontSize: 28, fontWeight: '600', color: theme.colors.textMuted },
  cameraBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  identityText: { flex: 1, minWidth: 0 },
  displayName: { ...theme.typography.h2, fontSize: 18, marginBottom: 2 },
  metaEmail: { fontSize: 14, color: theme.colors.textMuted },
  metaJoined: { fontSize: 13, color: theme.colors.textMuted, marginTop: 2, marginBottom: theme.spacing.sm },
  changePhotoLink: { fontSize: 14, fontWeight: '500', color: theme.colors.primaryLight },
  nameRow: { flexDirection: 'row', gap: theme.spacing.sm },
  nameCol: { flex: 1 },
  emailField: { opacity: 0.9 },
  emailHint: { ...theme.typography.caption, marginTop: -theme.spacing.sm, marginBottom: theme.spacing.md },
  error: { color: theme.colors.error, marginBottom: theme.spacing.md, fontSize: 14 },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  menuRowPressed: { opacity: 0.7 },
  menuLabel: { flex: 1, fontSize: 16, fontWeight: '500', color: theme.colors.text },
});

export default ProfileScreen;
