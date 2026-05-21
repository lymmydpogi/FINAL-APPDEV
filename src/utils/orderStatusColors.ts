import { ORDER_STATUS } from '../constants/orderStatus';
import { colors } from '../theme/colors';

export type StatusBadgeColors = {
  text: string;
  border: string;
  background: string;
};

export function orderStatusBadgeColors(status: string): StatusBadgeColors {
  switch (status) {
    case ORDER_STATUS.PENDING:
      return {
        text: colors.primary,
        border: 'rgba(56, 189, 248, 0.45)',
        background: 'rgba(56, 189, 248, 0.12)',
      };
    case ORDER_STATUS.APPROVED:
      return {
        text: '#86efac',
        border: colors.successBorder,
        background: 'rgba(22, 101, 52, 0.35)',
      };
    case ORDER_STATUS.IN_PROGRESS:
      return {
        text: '#fbbf24',
        border: 'rgba(251, 191, 36, 0.4)',
        background: 'rgba(251, 191, 36, 0.12)',
      };
    case ORDER_STATUS.COMPLETED:
      return {
        text: colors.secondary,
        border: 'rgba(99, 102, 241, 0.45)',
        background: 'rgba(99, 102, 241, 0.12)',
      };
    case ORDER_STATUS.CANCELLED:
    case ORDER_STATUS.REJECTED:
      return {
        text: colors.error,
        border: colors.errorBorder,
        background: colors.errorBg,
      };
    default:
      return {
        text: colors.textMuted,
        border: colors.surfaceBorder,
        background: colors.backgroundElevated,
      };
  }
}
