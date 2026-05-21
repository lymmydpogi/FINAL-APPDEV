import { CommonActions } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';

import type { RootStackParamList } from '../types/navigation';
import ROUTES from './routes';

/** After create: drop Service detail; back from order detail goes to My orders. */
export function resetToOrderDetailAfterCreate(
  navigation: NavigationProp<RootStackParamList>,
  orderId: number,
) {
  navigation.dispatch(
    CommonActions.reset({
      index: 2,
      routes: [
        { name: ROUTES.MAIN_TABS },
        { name: ROUTES.MY_ORDERS },
        { name: ROUTES.ORDER_DETAIL, params: { orderId } },
      ],
    }),
  );
}
