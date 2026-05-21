import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { theme } from '../theme/tokens';

type ToastType = 'success' | 'error' | 'info';

type ToastPayload = {
  message: string;
  type: ToastType;
  id: number;
};

type ToastContextValue = {
  showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return { showToast: () => {} };
  }
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  const [toast, setToast] = useState<ToastPayload | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-12)).current;
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idRef = useRef(0);

  const hide = useCallback(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: -8, duration: 180, useNativeDriver: true }),
    ]).start(() => setToast(null));
  }, [opacity, translateY]);

  const showToast = useCallback(
    (message: string, type: ToastType = 'info') => {
      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
      }
      idRef.current += 1;
      setToast({ message, type, id: idRef.current });
    },
    [],
  );

  useEffect(() => {
    if (!toast) {
      return;
    }
    opacity.setValue(0);
    translateY.setValue(-12);
    Animated.parallel([
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true, friction: 8 }),
      Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: true }),
    ]).start();
    hideTimer.current = setTimeout(hide, 3600);
    return () => {
      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
      }
    };
  }, [toast, hide, opacity, translateY]);

  const value = useMemo(() => ({ showToast }), [showToast]);

  const bg =
    toast?.type === 'success'
      ? styles.toastSuccess
      : toast?.type === 'error'
        ? styles.toastError
        : styles.toastInfo;

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast ? (
        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.wrap,
            { paddingTop: insets.top + theme.spacing.sm, opacity, transform: [{ translateY }] },
          ]}
        >
          <Pressable onPress={hide} style={[styles.toast, bg]}>
            <Text style={styles.toastText}>{toast.message}</Text>
            <Text style={styles.dismissHint}>Tap to dismiss</Text>
          </Pressable>
        </Animated.View>
      ) : null}
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    zIndex: 9999,
    elevation: 9999,
  },
  toast: {
    maxWidth: theme.layout.maxContentWidth,
    width: '92%',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    ...theme.shadows.card,
  },
  toastSuccess: {
    backgroundColor: theme.colors.successBg,
    borderColor: theme.colors.successBorder,
  },
  toastError: {
    backgroundColor: theme.colors.errorBg,
    borderColor: theme.colors.errorBorder,
  },
  toastInfo: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.surfaceBorder,
  },
  toastText: {
    color: theme.colors.textStrong,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
  },
  dismissHint: {
    marginTop: theme.spacing.xs,
    fontSize: 11,
    color: theme.colors.textMuted,
    fontWeight: '500',
  },
});
