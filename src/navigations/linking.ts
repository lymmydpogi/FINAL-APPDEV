import type { LinkingOptions } from '@react-navigation/native';

import type { RootStackParamList } from '../types/navigation';
import { ROUTES } from '../utils';

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['campanadesigns://', 'https://campanadesigns.com', 'http://127.0.0.1:8000'],
  config: {
    screens: {
      [ROUTES.VERIFY_EMAIL]: {
        path: 'verify-email',
        parse: {
          token: (token: string) => token,
        },
      },
      [ROUTES.MY_ORDERS]: 'client/orders',
      [ROUTES.MESSAGES]: 'client/messages',
      [ROUTES.MAIN_TABS]: {
        screens: {
          [ROUTES.TAB_HOME]: 'client',
          [ROUTES.TAB_SERVICES]: 'client/services',
          [ROUTES.TAB_CONTACT]: 'client/contact',
        },
      },
    },
  },
};
