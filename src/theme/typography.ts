import { colors } from './colors';

/** System fonts only — minimal hierarchy */
export const typography = {
  h1: {
    fontSize: 30,
    fontWeight: '700' as const,
    color: colors.textStrong,
    letterSpacing: -0.4,
    lineHeight: 38,
  },
  h2: {
    fontSize: 21,
    fontWeight: '600' as const,
    color: colors.textStrong,
    letterSpacing: -0.2,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    color: colors.text,
    lineHeight: 24,
  },
  bodyMuted: {
    fontSize: 15,
    fontWeight: '400' as const,
    color: colors.textMuted,
    lineHeight: 22,
  },
  caption: {
    fontSize: 13,
    fontWeight: '400' as const,
    color: colors.textMuted,
    lineHeight: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: colors.textLabel,
    lineHeight: 18,
  },
  overline: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: colors.textSubtle,
    letterSpacing: 0.6,
    textTransform: 'uppercase' as const,
    lineHeight: 16,
  },
  /** Compact brand line (logo area) */
  brand: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: colors.textStrong,
    letterSpacing: 0.4,
  },
  /** @deprecated use h1 */
  hero: {
    fontSize: 30,
    fontWeight: '700' as const,
    color: colors.textStrong,
    letterSpacing: -0.4,
    lineHeight: 38,
  },
  /** @deprecated use h2 */
  title: {
    fontSize: 21,
    fontWeight: '600' as const,
    color: colors.textStrong,
    letterSpacing: -0.2,
    lineHeight: 28,
  },
  titleLarge: {
    fontSize: 24,
    fontWeight: '600' as const,
    color: colors.textStrong,
    letterSpacing: -0.3,
    lineHeight: 32,
  },
} as const;
