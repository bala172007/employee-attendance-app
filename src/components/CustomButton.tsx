/**
 * components/CustomButton.tsx
 * Reusable button with primary / success / danger / outline variants.
 * Handles disabled and loading states internally.
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { COLORS, BORDER_RADIUS, FONT_SIZES, SPACING } from '../utils/constants';

// ─── Props ────────────────────────────────────────────────────────────────────

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'success' | 'danger' | 'outline';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

// ─── Component ────────────────────────────────────────────────────────────────

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  disabled  = false,
  loading   = false,
  variant   = 'primary',
  style,
  textStyle,
}) => {
  const isDisabled = disabled || loading;

  // Map variant → background style
  const variantStyle = {
    primary: styles.primaryBg,
    success: styles.successBg,
    danger:  styles.dangerBg,
    outline: styles.outlineBg,
  }[variant];

  // Spinner / text colour differs for outline buttons
  const spinnerColor = variant === 'outline' ? COLORS.primary : COLORS.white;
  const labelStyle   = variant === 'outline' ? styles.outlineLabel : styles.label;

  return (
    <TouchableOpacity
      style={[styles.base, variantStyle, isDisabled && styles.disabled, style]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={spinnerColor} size="small" />
      ) : (
        <Text style={[labelStyle, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  base: {
    height:           52,
    borderRadius:     BORDER_RADIUS.md,
    justifyContent:   'center',
    alignItems:       'center',
    paddingHorizontal: SPACING.lg,
  },
  primaryBg: { backgroundColor: COLORS.primary },
  successBg: { backgroundColor: COLORS.success },
  dangerBg:  { backgroundColor: COLORS.error },
  outlineBg: {
    backgroundColor: 'transparent',
    borderWidth:     2,
    borderColor:     COLORS.primary,
  },
  disabled: { opacity: 0.42 },
  label: {
    color:          COLORS.white,
    fontSize:       FONT_SIZES.md,
    fontWeight:     '700',
    letterSpacing:  0.4,
  },
  outlineLabel: {
    color:          COLORS.primary,
    fontSize:       FONT_SIZES.md,
    fontWeight:     '700',
    letterSpacing:  0.4,
  },
});

export default CustomButton;
