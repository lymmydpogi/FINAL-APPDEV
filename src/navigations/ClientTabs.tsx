import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Briefcase, Home, Info, Mail } from 'lucide-react-native';
import { StyleSheet } from 'react-native';

import AboutScreen from '../screens/client/AboutScreen';
import ContactScreen from '../screens/client/ContactScreen';
import LandingScreen from '../screens/client/LandingScreen';
import ServicesScreen from '../screens/client/ServicesScreen';
import ClientHeaderAuth from '../components/ClientHeaderAuth';
import { TabIcon } from '../components/CampanaIcons';
import type { ClientTabParamList } from '../types/navigation';
import { theme } from '../theme/tokens';
import { ROUTES } from '../utils';

const Tab = createBottomTabNavigator<ClientTabParamList>();

const ClientTabs = () => (
  <Tab.Navigator
    screenOptions={({ navigation }) => ({
      headerStyle: {
        backgroundColor: theme.colors.background,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: theme.colors.surfaceBorder,
      },
      headerTintColor: theme.colors.textStrong,
      headerTitleStyle: { fontSize: 17, fontWeight: '600', color: theme.colors.textStrong },
      headerShadowVisible: false,
      headerRight: () => <ClientHeaderAuth navigation={navigation} />,
      tabBarStyle: styles.tabBar,
      tabBarActiveTintColor: theme.colors.primary,
      tabBarInactiveTintColor: theme.colors.textMuted,
      tabBarLabelStyle: styles.tabLabel,
      tabBarHideOnKeyboard: true,
    })}
  >
    <Tab.Screen
      name={ROUTES.TAB_HOME}
      component={LandingScreen}
      options={{
        title: 'Home',
        tabBarIcon: ({ color, focused }) => <TabIcon icon={Home} color={color} focused={focused} />,
      }}
    />
    <Tab.Screen
      name={ROUTES.TAB_SERVICES}
      component={ServicesScreen}
      options={{
        title: 'Services',
        tabBarIcon: ({ color, focused }) => (
          <TabIcon icon={Briefcase} color={color} focused={focused} />
        ),
      }}
    />
    <Tab.Screen
      name={ROUTES.TAB_ABOUT}
      component={AboutScreen}
      options={{
        title: 'About',
        tabBarIcon: ({ color, focused }) => <TabIcon icon={Info} color={color} focused={focused} />,
      }}
    />
    <Tab.Screen
      name={ROUTES.TAB_CONTACT}
      component={ContactScreen}
      options={{
        title: 'Contact',
        tabBarIcon: ({ color, focused }) => <TabIcon icon={Mail} color={color} focused={focused} />,
      }}
    />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: theme.colors.backgroundElevated,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.surfaceBorder,
    height: 60,
    paddingBottom: 4,
    paddingTop: 4,
  },
  tabLabel: { fontSize: 11, fontWeight: '500', marginBottom: 2 },
});

export default ClientTabs;
