import type { NavigatorScreenParams } from '@react-navigation/native';

import ROUTES from '../utils/routes';

export type ServiceDetailParams = {
  slug: string;
  name?: string;
  serviceId?: number;
};

export type RootStackParamList = {
  [ROUTES.MAIN_TABS]: NavigatorScreenParams<ClientTabParamList> | undefined;
  [ROUTES.SERVICE_DETAIL]: ServiceDetailParams;
  [ROUTES.LOGIN]:
    | {
        returnTo?: {
          name: typeof ROUTES.SERVICE_DETAIL;
          params: ServiceDetailParams;
        };
      }
    | undefined;
  [ROUTES.REGISTER]: undefined;
  [ROUTES.PROFILE]: { orderSuccessMessage?: string } | undefined;
  [ROUTES.NOTIFICATIONS]: undefined;
  [ROUTES.MY_ORDERS]: undefined;
  [ROUTES.MESSAGES]: undefined;
  [ROUTES.ORDER_DETAIL]: { orderId: number };
  [ROUTES.ORDER_EDIT]: { orderId: number };
  [ROUTES.VERIFY_EMAIL_PENDING]: { email?: string; verifyUrl?: string } | undefined;
  [ROUTES.VERIFY_EMAIL]: { token: string };
};

export type ClientTabParamList = {
  [ROUTES.TAB_HOME]: undefined;
  [ROUTES.TAB_SERVICES]: undefined;
  [ROUTES.TAB_ABOUT]: undefined;
  [ROUTES.TAB_CONTACT]: undefined;
};
