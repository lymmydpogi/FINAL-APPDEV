import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const CustomTextInput = ({ value, onChangeText, placeholder, style }) => {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      style={[styles.input, style]}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginVertical: 10,
    width: '80%',
    fontSize: 16,
  },
});

export default CustomTextInput;
