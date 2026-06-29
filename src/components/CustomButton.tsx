// src/components/CustomButton.tsx

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native';

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({ title, disabled, style, ...props }) => {
  return (
    <TouchableOpacity 
      style={[styles.button, disabled && styles.disabledButton, style]} 
      disabled={disabled}
      {...props}
    >
      <Text style={[styles.text, disabled && styles.disabledText]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF', // iOS Blue
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
    elevation: 2, // Shadow for Android
    shadowColor: '#000', // Shadows for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  disabledButton: {
    backgroundColor: '#E5E5EA',
    elevation: 0,
    shadowOpacity: 0,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabledText: {
    color: '#8E8E93',
  },
});

export default CustomButton;