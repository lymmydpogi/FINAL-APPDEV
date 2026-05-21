export const colors = {
  background: '#020617',
  backgroundElevated: '#0f172a',
  backgroundInput: '#020617',

  surface: '#0f172a',
  surfaceBorder: '#1f2937',
  surfaceBorderMuted: '#1e293b',

  primary: '#38bdf8',
  primaryLight: '#7dd3fc',
  primaryMuted: '#bae6fd',
  secondary: '#6366f1',
  accentSoft: '#a5b4fc',

  text: '#e5e7eb',
  textStrong: '#f8fafc',
  textMuted: '#9ca3af',
  textSubtle: '#6b7280',
  textLabel: '#cbd5e1',

  success: '#166534',
  successBorder: '#14532d',
  successText: '#86efac',

  error: '#fca5a5',
  errorBg: 'rgba(185, 28, 28, 0.25)',
  errorBorder: 'rgba(248, 113, 113, 0.35)',

  overlay: 'rgba(15, 23, 42, 0.96)',
  focusRing: 'rgba(56, 189, 248, 0.35)',
  shadow: 'rgba(15, 23, 42, 0.9)',

  /** On primary gradient buttons */
  onPrimary: '#020617',
} as const;

export const gradients = {
  primaryButton: ['#38bdf8', '#6366f1'] as [string, string],
  cardSubtle: ['rgba(56,189,248,0.08)', 'rgba(15,23,42,0.96)'] as [string, string],
};
