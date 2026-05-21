import { StyleSheet } from 'react-native';

import { colors, gradients } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';

/** Campana Designs — dark premium mobile design system */
export const theme = {
  colors: {
    ...colors,
    /** Legacy aliases */
    accent: colors.primary,
    accentSoft: colors.primaryLight,
    accentSecondary: colors.secondary,
    accentMuted: 'rgba(56, 189, 248, 0.12)',
    border: colors.surfaceBorder,
    borderStrong: colors.focusRing,
    divider: colors.surfaceBorderMuted,
    textSecondary: colors.textLabel,
    surfaceHover: '#1e293b',
    white: colors.textStrong,
    pillBg: colors.backgroundInput,
    successBg: 'rgba(22, 101, 52, 0.35)',
    orbCyan: 'transparent',
    orbIndigo: 'transparent',
  },
  gradients,
  spacing: {
    ...spacing,
    /** Extra bottom scroll padding */
    xxl: 40,
  },
  radius: {
    sm: spacing.radiusInput,
    md: spacing.radiusCard,
    lg: spacing.radiusCard,
    pill: spacing.radiusPill,
  },
  layout: {
    maxContentWidth: 520,
  },
  typography,
  shadows: {
    card: {},
    button: {},
  },
} as const;

export const commonStyles = StyleSheet.create({
  maxWidthCenter: {
    width: '100%',
    maxWidth: theme.layout.maxContentWidth,
    alignSelf: 'center',
  },
});

export const clientStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  scrollContent: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  pageHeader: {
    marginBottom: theme.spacing.xl,
  },
  section: {
    paddingTop: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.surfaceBorderMuted,
  },
  sectionTitle: {
    ...theme.typography.overline,
    marginBottom: theme.spacing.md,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm + 2,
    gap: theme.spacing.sm,
  },
  listItem: {
    paddingVertical: theme.spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.surfaceBorderMuted,
  },
  surfaceCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    borderRadius: theme.spacing.radiusCard,
    padding: theme.spacing.cardPadding,
  },
});
