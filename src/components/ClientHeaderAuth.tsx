import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Bell, ClipboardList, MessageCircle } from 'lucide-react-native';

import { useChatUnread } from '../hooks/useChatUnread';
import { useNotificationUnread } from '../hooks/useNotificationUnread';
import { useAuth } from '../hooks/useAuth';
import { theme } from '../theme/tokens';
import { ROUTES } from '../utils';

type Nav = {
  getParent: () => { navigate: (name: string, params?: object) => void } | undefined;
};

export default function ClientHeaderAuth({ navigation }: { navigation: Nav }) {
  const { isAuthenticated, user } = useAuth();
  const { count: unreadCount } = useNotificationUnread();
  const { count: chatUnread } = useChatUnread();

  const stackNav = () => navigation.getParent();

  if (!isAuthenticated) {
    return (
      <Pressable onPress={() => stackNav()?.navigate(ROUTES.LOGIN)} style={styles.iconBtn}>
        <Text style={styles.link}>Log in</Text>
      </Pressable>
    );
  }

  const initial = (user?.firstName || user?.email || '?').charAt(0).toUpperCase();

  return (
    <View style={styles.row}>
      <Pressable
        onPress={() => stackNav()?.navigate(ROUTES.NOTIFICATIONS)}
        style={styles.iconBtn}
        accessibilityLabel="Notifications"
      >
        <Bell size={22} color={theme.colors.textStrong} strokeWidth={1.75} />
        {unreadCount > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : String(unreadCount)}</Text>
          </View>
        ) : null}
      </Pressable>

      <Pressable
        onPress={() => stackNav()?.navigate(ROUTES.MESSAGES)}
        style={styles.iconBtn}
        accessibilityLabel="Messages"
      >
        <MessageCircle size={22} color={theme.colors.textStrong} strokeWidth={1.75} />
        {chatUnread > 0 ? <View style={styles.chatDot} /> : null}
      </Pressable>

      <Pressable
        onPress={() => stackNav()?.navigate(ROUTES.MY_ORDERS)}
        style={styles.iconBtn}
        accessibilityLabel="My orders"
      >
        <ClipboardList size={22} color={theme.colors.textStrong} strokeWidth={1.75} />
      </Pressable>

      <Pressable
        onPress={() => stackNav()?.navigate(ROUTES.PROFILE)}
        style={styles.iconBtn}
        accessibilityLabel="Your profile"
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginRight: theme.spacing.xs },
  iconBtn: { paddingHorizontal: theme.spacing.sm, paddingVertical: theme.spacing.xs },
  link: { color: theme.colors.primaryLight, fontWeight: '500', fontSize: 15 },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: theme.colors.primary, fontWeight: '600', fontSize: 12 },
  badge: {
    position: 'absolute',
    top: 2,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: { color: theme.colors.background, fontSize: 9, fontWeight: '700' },
  chatDot: {
    position: 'absolute',
    top: 6,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
    borderWidth: 1,
    borderColor: theme.colors.background,
  },
});
