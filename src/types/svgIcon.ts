import type { ComponentType } from 'react';
import type { SvgProps } from 'react-native-svg';

/** Lucide / react-native-svg icon — renders without bundling TTF fonts. */
export type SvgIcon = ComponentType<
  SvgProps & {
    size?: string | number;
    strokeWidth?: number;
    color?: string;
    absoluteStrokeWidth?: boolean;
  }
>;
