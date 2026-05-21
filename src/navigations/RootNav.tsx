import { createStackNavigator } from '@react-navigation/stack';

import Login from '../screens/auth/Login';
import Register from '../screens/auth/Register';
import VerifyEmailPendingScreen from '../screens/auth/VerifyEmailPendingScreen';
import VerifyEmailScreen from '../screens/auth/VerifyEmailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ServiceDetailScreen from '../screens/client/ServiceDetailScreen';
import NotificationsScreen from '../screens/client/NotificationsScreen';
import MyOrdersScreen from '../screens/client/MyOrdersScreen';
import MessagesScreen from '../screens/client/MessagesScreen';
import OrderDetailScreen from '../screens/client/OrderDetailScreen';
import OrderEditScreen from '../screens/client/OrderEditScreen';
import type { RootStackParamList } from '../types/navigation';
import { ROUTES } from '../utils';
import AdminReplyNotifier from '../components/AdminReplyNotifier';
import ClientTabs from './ClientTabs';
import { appStackScreenOptions } from './screenOptions';

const Stack = createStackNavigator<RootStackParamList>();

const RootNav = () => (
  <>
    <AdminReplyNotifier />
    <Stack.Navigator screenOptions={appStackScreenOptions}>
    <Stack.Screen name={ROUTES.MAIN_TABS} component={ClientTabs} options={{ headerShown: false }} />
    <Stack.Screen
      name={ROUTES.SERVICE_DETAIL}
      component={ServiceDetailScreen}
      options={({ route }) => ({
        title: ('name' in (route.params ?? {}) ? route.params?.name : undefined) ?? 'Service',
      })}
    />
    <Stack.Screen name={ROUTES.LOGIN} component={Login} options={{ title: 'Sign in' }} />
    <Stack.Screen name={ROUTES.REGISTER} component={Register} options={{ title: 'Register' }} />
    <Stack.Screen
      name={ROUTES.VERIFY_EMAIL_PENDING}
      component={VerifyEmailPendingScreen}
      options={{ title: 'Verify email' }}
    />
    <Stack.Screen
      name={ROUTES.VERIFY_EMAIL}
      component={VerifyEmailScreen}
      options={{ title: 'Email verified' }}
    />
    <Stack.Screen name={ROUTES.PROFILE} component={ProfileScreen} options={{ title: 'Your profile' }} />
    <Stack.Screen
      name={ROUTES.NOTIFICATIONS}
      component={NotificationsScreen}
      options={{ title: 'Notifications' }}
    />
    <Stack.Screen name={ROUTES.MY_ORDERS} component={MyOrdersScreen} options={{ title: 'My orders' }} />
    <Stack.Screen name={ROUTES.MESSAGES} component={MessagesScreen} options={{ title: 'Messages' }} />
    <Stack.Screen
      name={ROUTES.ORDER_DETAIL}
      component={OrderDetailScreen}
      options={{ title: 'Order details' }}
    />
    <Stack.Screen name={ROUTES.ORDER_EDIT} component={OrderEditScreen} options={{ title: 'Edit order' }} />
    </Stack.Navigator>
  </>
);

export default RootNav;
