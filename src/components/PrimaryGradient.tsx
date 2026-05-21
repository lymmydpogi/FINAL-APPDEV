import React, { type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { gradients } from '../theme/colors';
import { spacing } from '../theme/spacing';

type Props = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  borderRadius?: number;
};

/** Cyan → indigo gradient — primary CTAs only */
export default function PrimaryGradient({
  children,
  style,
  borderRadius = spacing.radiusInput,
}: Props) {
  const [start, end] = gradients.primaryButton;

  return (
    <View style={[styles.wrap, { borderRadius }, style]}>
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill} preserveAspectRatio="none">
        <Defs>
          <LinearGradient id="campanaPrimary" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={start} />
            <Stop offset="100%" stopColor={end} />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#campanaPrimary)" rx={borderRadius} ry={borderRadius} />
      </Svg>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: 'hidden',
    position: 'relative',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
