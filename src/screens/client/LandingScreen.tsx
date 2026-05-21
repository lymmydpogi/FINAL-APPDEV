import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { StackNavigationProp } from '@react-navigation/stack';

import CampanaBackground from '../../components/CampanaBackground';
import { ChipIcon, CustomButton } from '../../components';
import { useAuth } from '../../hooks/useAuth';
import { LANDING } from '../../constants/websiteCopy';
import type { ClientTabParamList, RootStackParamList } from '../../types/navigation';
import { clientStyles, commonStyles, theme } from '../../theme/tokens';
import { landingBadgeIcon } from '../../utils/chipIcons';
import { BRAND_NAME, IMG, ROUTES } from '../../utils';

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<ClientTabParamList, typeof ROUTES.TAB_HOME>,
  StackNavigationProp<RootStackParamList>
>;

const LandingScreen = () => {
  const navigation = useNavigation<Nav>();
  const { isAuthenticated } = useAuth();

  return (
    <CampanaBackground>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={clientStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={commonStyles.maxWidthCenter}>
          <View style={clientStyles.pageHeader}>
            <Image source={IMG.LOGO} style={styles.logo} resizeMode="contain" />
            <Text style={styles.brand}>{BRAND_NAME}</Text>
            <Text style={styles.tagLine}>{LANDING.tag}</Text>
            <Text style={styles.hero}>{LANDING.title}</Text>
            <Text style={styles.subtitle}>{LANDING.subtitle}</Text>
          </View>

          <View style={clientStyles.section}>
            <Text style={clientStyles.sectionTitle}>What we do</Text>
            {LANDING.badges.map(b => (
              <View key={b} style={clientStyles.listRow}>
                <ChipIcon icon={landingBadgeIcon(b)} />
                <Text style={styles.badgeText}>{b}</Text>
              </View>
            ))}
          </View>

          <View style={styles.actions}>
            <CustomButton
              title="Browse services"
              onPress={() => navigation.navigate(ROUTES.TAB_SERVICES)}
              fullWidth
            />
            <CustomButton
              title="Contact us"
              variant="outline"
              onPress={() => navigation.navigate(ROUTES.TAB_CONTACT)}
              style={styles.btnGap}
              fullWidth
            />
            {isAuthenticated ? (
              <CustomButton
                title="My orders"
                variant="ghost"
                onPress={() => navigation.getParent()?.navigate(ROUTES.MY_ORDERS)}
                style={styles.btnGap}
                fullWidth
              />
            ) : (
              <CustomButton
                title="Log in"
                variant="ghost"
                onPress={() => navigation.getParent()?.navigate(ROUTES.LOGIN)}
                style={styles.btnGap}
                fullWidth
              />
            )}
          </View>
        </View>
      </ScrollView>
    </CampanaBackground>
  );
};

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  logo: { width: 100, height: 40, marginBottom: theme.spacing.md },
  brand: { ...theme.typography.brand, marginBottom: theme.spacing.xs },
  tagLine: { ...theme.typography.caption, marginBottom: theme.spacing.lg },
  hero: { ...theme.typography.h1, marginBottom: theme.spacing.sm },
  subtitle: { ...theme.typography.bodyMuted },
  badgeText: { ...theme.typography.body, flex: 1 },
  actions: { marginTop: theme.spacing.xl, gap: theme.spacing.sm },
  btnGap: { marginTop: theme.spacing.sm },
});

export default LandingScreen;
