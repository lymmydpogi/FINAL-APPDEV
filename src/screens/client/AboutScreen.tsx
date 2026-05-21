import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { StackNavigationProp } from '@react-navigation/stack';

import CampanaBackground from '../../components/CampanaBackground';
import { ChipIcon, CustomButton } from '../../components';
import { ABOUT } from '../../constants/websiteCopy';
import type { ClientTabParamList, RootStackParamList } from '../../types/navigation';
import { clientStyles, commonStyles, theme } from '../../theme/tokens';
import { aboutValueIcon } from '../../utils/chipIcons';
import { ROUTES } from '../../utils';

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<ClientTabParamList, typeof ROUTES.TAB_ABOUT>,
  StackNavigationProp<RootStackParamList>
>;

const AboutScreen = () => {
  const navigation = useNavigation<Nav>();

  return (
    <CampanaBackground>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={clientStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={commonStyles.maxWidthCenter}>
          <View style={clientStyles.pageHeader}>
            <Text style={styles.title}>{ABOUT.title}</Text>
            <Text style={styles.tag}>{ABOUT.tag}</Text>
          </View>

          <Text style={styles.body}>{ABOUT.body}</Text>

          <View style={clientStyles.section}>
            <Text style={clientStyles.sectionTitle}>Values</Text>
            {ABOUT.values.map(v => (
              <View key={v} style={clientStyles.listRow}>
                <ChipIcon icon={aboutValueIcon(v)} />
                <Text style={styles.valueText}>{v}</Text>
              </View>
            ))}
          </View>

          <CustomButton
            title="Start a conversation"
            onPress={() => navigation.navigate(ROUTES.TAB_CONTACT)}
            fullWidth
            style={styles.cta}
          />
        </View>
      </ScrollView>
    </CampanaBackground>
  );
};

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  title: { ...theme.typography.titleLarge, marginBottom: theme.spacing.sm },
  tag: { ...theme.typography.bodyMuted },
  body: { ...theme.typography.bodyMuted, lineHeight: 24 },
  valueText: { ...theme.typography.body, flex: 1 },
  cta: { marginTop: theme.spacing.xl },
});

export default AboutScreen;
