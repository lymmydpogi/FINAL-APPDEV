import React from 'react';
import { StyleSheet, View } from 'react-native';

import { theme } from '../theme/tokens';
import type { SvgIcon } from '../types/svgIcon';

const TAB_ICON_SIZE = 22;

type TabIconProps = {
  icon: SvgIcon;
  color: string;
  focused: boolean;
};

export function TabIcon({ icon: Icon, color, focused }: TabIconProps) {
  return (
    <Icon
      size={TAB_ICON_SIZE}
      color={color}
      strokeWidth={focused ? 2.25 : 1.75}
      style={{ opacity: focused ? 1 : 0.65 }}
    />
  );
}

export function ChipIcon({ icon: Icon, color = theme.colors.primary }: { icon: SvgIcon; color?: string }) {
  return <Icon size={16} color={color} strokeWidth={1.75} />;
}

const rowIconStyles = StyleSheet.create({
  wrap: {
    width: 28,
    marginRight: theme.spacing.md,
    alignItems: 'center',
  },
});

export function ServiceRowIcon({ icon: Icon }: { icon: SvgIcon }) {
  return (
    <View style={rowIconStyles.wrap}>
      <Icon size={22} color={theme.colors.primaryLight} strokeWidth={1.75} />
    </View>
  );
}
