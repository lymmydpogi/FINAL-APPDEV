import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import { theme } from '../theme/tokens';

export type CustomInputProps = {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  multiline?: boolean;
  editable?: boolean;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
};

const CustomInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  multiline,
  editable = true,
  error,
  containerStyle,
  inputStyle,
}: CustomInputProps) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textSubtle}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        editable={editable}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        textAlignVertical={multiline ? 'top' : 'center'}
        style={[
          styles.input,
          multiline && styles.multiline,
          focused && styles.inputFocused,
          !editable && styles.inputDisabled,
          error ? styles.inputError : null,
          inputStyle,
        ]}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { width: '100%', marginBottom: theme.spacing.md },
  label: {
    ...theme.typography.label,
    marginBottom: theme.spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    backgroundColor: theme.colors.backgroundInput,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.sm,
    fontSize: 16,
    color: theme.colors.text,
  },
  inputFocused: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.backgroundInput,
  },
  inputDisabled: {
    opacity: 0.7,
    backgroundColor: theme.colors.backgroundElevated,
  },
  multiline: { minHeight: 120, paddingTop: theme.spacing.md },
  inputError: { borderColor: theme.colors.error },
  error: { color: theme.colors.error, fontSize: 12, marginTop: theme.spacing.xs },
});

export default CustomInput;
