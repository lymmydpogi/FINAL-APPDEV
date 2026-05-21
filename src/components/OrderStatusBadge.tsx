import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { orderStatusBadgeColors } from '../utils/orderStatusColors';

type Props = {
  status: string;
};

export default function OrderStatusBadge({ status }: Props) {
  const colors = orderStatusBadgeColors(status);

  return (
    <View style={[styles.pill, { borderColor: colors.border, backgroundColor: colors.background }]}>
      <Text style={[styles.text, { color: colors.text }]}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  text: { fontSize: 12, fontWeight: '600' },
});
