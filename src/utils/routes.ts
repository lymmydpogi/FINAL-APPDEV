/** Screen names — aligned with WEBAPP client routes. */
const ROUTES = {
  MAIN_TABS: 'MainTabs',
  SERVICE_DETAIL: 'ServiceDetail',
  LOGIN: 'Login',
  REGISTER: 'Register',
  PROFILE: 'Profile',
  MY_ORDERS: 'MyOrders',
  NOTIFICATIONS: 'Notifications',
  ORDER_DETAIL: 'OrderDetail',
  ORDER_EDIT: 'OrderEdit',
  VERIFY_EMAIL_PENDING: 'VerifyEmailPending',
  VERIFY_EMAIL: 'VerifyEmail',

  TAB_HOME: 'TabHome',
  TAB_SERVICES: 'TabServices',
  MESSAGES: 'Messages',
  TAB_ABOUT: 'TabAbout',
  TAB_CONTACT: 'TabContact',
} as const;

export type RouteName = (typeof ROUTES)[keyof typeof ROUTES];

export default ROUTES;
