import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { theme } from '../theme/tokens';

type HeaderBackProps = {
  onPress?: () => void;
  tintColor?: string;
};

const HeaderBack = ({ onPress, tintColor = theme.colors.text }: HeaderBackProps) => {
  if (!onPress) {
    return null;
  }

  return (
    <TouchableOpacity onPress={onPress} style={styles.hit} accessibilityLabel="Go back">
      <Text style={[styles.icon, { color: tintColor }]}>‹</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  hit: {
    marginLeft: 8,
    paddingHorizontal: 8,
  },
  icon: {
    fontSize: 28,
    fontWeight: '300',
  },
});

export default HeaderBack;
