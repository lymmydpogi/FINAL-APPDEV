import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import PrimaryGradient from './PrimaryGradient';
import { theme } from '../theme/tokens';

type ButtonVariant = 'primary' | 'outline' | 'danger' | 'ghost';

type CustomButtonProps = {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  fullWidth?: boolean;
};

const CustomButton = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
  fullWidth = false,
}: CustomButtonProps) => {
  const isDisabled = disabled || loading;

  if (variant === 'primary') {
    return (
      <Pressable
        onPress={onPress}
        disabled={isDisabled}
        style={({ pressed }) => [
          fullWidth && styles.fullWidth,
          isDisabled && styles.disabled,
          pressed && !isDisabled && styles.pressed,
          style,
        ]}
      >
        <PrimaryGradient style={styles.gradientFill} borderRadius={theme.radius.sm}>
          <View style={styles.primaryInner}>
            {loading ? (
              <ActivityIndicator color={theme.colors.onPrimary} />
            ) : (
              <Text style={[styles.labelPrimary, textStyle]}>{title}</Text>
            )}
          </View>
        </PrimaryGradient>
      </Pressable>
    );
  }

  const spinnerColor = theme.colors.text;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        fullWidth && styles.fullWidth,
        variant === 'outline' && styles.outline,
        variant === 'ghost' && styles.ghost,
        variant === 'danger' && styles.danger,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator color={spinnerColor} />
      ) : (
        <Text
          style={[
            styles.label,
            variant === 'outline' && styles.labelOutline,
            variant === 'ghost' && styles.labelGhost,
            variant === 'danger' && styles.labelDanger,
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    alignSelf: 'stretch',
    minHeight: 48,
    paddingVertical: 12,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: { width: '100%', alignSelf: 'stretch' },
  gradientFill: { minHeight: 48, width: '100%' },
  primaryInner: {
    minHeight: 48,
    paddingVertical: 12,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  outline: {
    backgroundColor: theme.colors.backgroundElevated,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  danger: {
    backgroundColor: theme.colors.errorBg,
    borderWidth: 1,
    borderColor: theme.colors.errorBorder,
  },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.88 },
  labelPrimary: {
    color: theme.colors.onPrimary,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  label: { color: theme.colors.text, fontSize: 15, fontWeight: '600' },
  labelOutline: { color: theme.colors.text },
  labelGhost: { color: theme.colors.textMuted },
  labelDanger: { color: theme.colors.error },
});

export default CustomButton;
