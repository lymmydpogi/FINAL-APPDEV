import React, { type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { theme } from '../theme/tokens';

type CardProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
  /** Flat elevated surface (no gradient, no shadow) */
  elevated?: boolean;
};

const Card = ({ children, style, padded = true, elevated = false }: CardProps) => (
  <View style={[styles.card, elevated && styles.elevated, padded && styles.padded, style]}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: 'transparent',
  },
  elevated: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    borderRadius: theme.spacing.radiusCard,
  },
  padded: {
    padding: theme.spacing.cardPadding,
  },
});

export default Card;
