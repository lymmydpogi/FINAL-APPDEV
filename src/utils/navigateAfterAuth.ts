import type { StackNavigationProp } from '@react-navigation/stack';

import type { RootStackParamList } from '../types/navigation';
import type { SessionPayload } from '../types/redux';
import { needsEmailVerification } from './authSession';
import ROUTES from './routes';

export function navigateAfterAuth(
  navigation: StackNavigationProp<RootStackParamList>,
  session: SessionPayload,
  returnTo?: { name: typeof ROUTES.SERVICE_DETAIL; params: RootStackParamList[typeof ROUTES.SERVICE_DETAIL] },
) {
  if (needsEmailVerification(session)) {
    navigation.replace(ROUTES.VERIFY_EMAIL_PENDING, {
      email: session.user.email ?? undefined,
    });
    return;
  }

  if (returnTo) {
    navigation.navigate(returnTo.name, returnTo.params);
    return;
  }

  if (navigation.canGoBack()) {
    navigation.goBack();
  } else {
    navigation.navigate(ROUTES.MAIN_TABS);
  }
}
