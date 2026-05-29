import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { theme } from '../theme/tokens';

export type ActivityBannerKind =
  | 'service-new'
  | 'service-edit'
  | 'service-remove'
  | 'order-update'
  | 'order-edit';

export type ActivityBanner = {
  id: string;
  kind: ActivityBannerKind;
  title: string;
  message: string;
};

type ActivityBannerContextValue = {
  showBanner: (banner: Omit<ActivityBanner, 'id'> & { id?: string }) => void;
};

const ActivityBannerContext = createContext<ActivityBannerContextValue | null>(null);

const BANNER_MS = 12_000;
const MAX_VISIBLE = 4;

const KIND_STYLES: Record<ActivityBannerKind, { bg: string; border: string; icon: string }> = {
  'service-new': { bg: '#0369a1', border: '#38bdf8', icon: '🆕' },
  'service-edit': { bg: '#0d9488', border: '#2dd4bf', icon: '✏️' },
  'service-remove': { bg: '#b91c1c', border: '#f87171', icon: '🗑️' },
  'order-update': { bg: '#b45309', border: '#fbbf24', icon: '🔄' },
  'order-edit': { bg: '#6d28d9', border: '#a78bfa', icon: '📋' },
};

export function useActivityBanner(): ActivityBannerContextValue {
  const ctx = useContext(ActivityBannerContext);
  if (!ctx) {
    return { showBanner: () => {} };
  }
  return ctx;
}

export function ActivityBannerProvider({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  const [banners, setBanners] = useState<ActivityBanner[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const idRef = useRef(0);

  const dismiss = useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setBanners(prev => prev.filter(b => b.id !== id));
  }, []);

  const showBanner = useCallback(
    (input: Omit<ActivityBanner, 'id'> & { id?: string }) => {
      const id = input.id ?? `banner-${++idRef.current}`;
      const banner: ActivityBanner = {
        id,
        kind: input.kind,
        title: input.title,
        message: input.message,
      };

      setBanners(prev => {
        if (prev.some(b => b.id === id)) {
          return prev;
        }
        const next = [...prev, banner];
        return next.slice(-MAX_VISIBLE);
      });

      const existing = timersRef.current.get(id);
      if (existing) {
        clearTimeout(existing);
      }
      timersRef.current.set(
        id,
        setTimeout(() => dismiss(id), BANNER_MS),
      );
    },
    [dismiss],
  );

  const value = useMemo(() => ({ showBanner }), [showBanner]);

  return (
    <ActivityBannerContext.Provider value={value}>
      {children}
      {banners.length > 0 ? (
        <View
          pointerEvents="box-none"
          style={[styles.stack, { top: insets.top + theme.spacing.xs }]}
        >
          {banners.map(banner => {
            const palette = KIND_STYLES[banner.kind] ?? KIND_STYLES['order-update'];
            return (
              <Pressable
                key={banner.id}
                onPress={() => dismiss(banner.id)}
                style={[styles.banner, { backgroundColor: palette.bg, borderLeftColor: palette.border }]}
                accessibilityRole="alert"
              >
                <Text style={styles.icon}>{palette.icon}</Text>
                <View style={styles.body}>
                  <Text style={styles.title}>{banner.title}</Text>
                  <Text style={styles.message} numberOfLines={3}>
                    {banner.message}
                  </Text>
                  <Text style={styles.hint}>Tap to dismiss</Text>
                </View>
                <Text style={styles.close}>×</Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}
    </ActivityBannerContext.Provider>
  );
}

const styles = StyleSheet.create({
  stack: {
    position: 'absolute',
    left: theme.spacing.md,
    right: theme.spacing.md,
    zIndex: 10000,
    elevation: 10000,
    gap: theme.spacing.sm,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderLeftWidth: 4,
    ...theme.shadows.card,
  },
  icon: {
    fontSize: 20,
    marginTop: 2,
  },
  body: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    color: '#f8fafc',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  message: {
    color: '#e2e8f0',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  hint: {
    marginTop: 6,
    color: 'rgba(248, 250, 252, 0.65)',
    fontSize: 11,
    fontWeight: '500',
  },
  close: {
    color: 'rgba(248, 250, 252, 0.8)',
    fontSize: 22,
    lineHeight: 22,
    paddingHorizontal: 4,
  },
});
