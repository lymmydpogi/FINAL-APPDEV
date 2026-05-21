import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme/tokens';

type Props = {
  label: string;
};

/** Shown on inactive / non-orderable services in list and detail. */
export default function ServiceStatusBadge({ label }: Props) {
  return (
    <View style={styles.pill}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    borderWidth: 1,
    borderColor: theme.colors.errorBorder,
    backgroundColor: theme.colors.errorBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  text: { fontSize: 12, fontWeight: '600', color: theme.colors.error },
});
