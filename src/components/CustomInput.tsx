/**
 * components/CustomInput.tsx
 * Reusable labelled input field.
 * Features: focus border highlight, inline error message, password visibility toggle.
 */

import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
} from 'react-native';
import { COLORS, BORDER_RADIUS, FONT_SIZES, SPACING } from '../utils/constants';

// ─── Props ────────────────────────────────────────────────────────────────────

interface CustomInputProps extends TextInputProps {
  /** Label displayed above the input. */
  label: string;
  /** Validation error message shown below the input. */
  errorMessage?: string;
  /** When true the input masks characters and shows an eye toggle. */
  secureTextEntry?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  errorMessage,
  secureTextEntry = false,
  ...rest
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {/* Label */}
      <Text style={styles.label}>{label}</Text>

      {/* Input row */}
      <View
        style={[
          styles.row,
          isFocused    && styles.rowFocused,
          !!errorMessage && styles.rowError,
        ]}
      >
        <TextInput
          {...rest}
          style={styles.input}
          secureTextEntry={secureTextEntry && !isVisible}
          placeholderTextColor={COLORS.gray}
          onFocus={() => setIsFocused(true)}
          //onBlur={() => setIsFocused(false)}
          autoCapitalize="none"
          autoCorrect={false}
        />

        {/* Eye icon – only for password fields */}
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsVisible((v) => !v)}
            style={styles.eyeBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.eyeIcon}>{isVisible ? '🙈' : '👁️'}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Error message */}
      {!!errorMessage && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize:     FONT_SIZES.sm,
    fontWeight:   '600',
    color:        COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  row: {
    flexDirection:    'row',
    alignItems:       'center',
    backgroundColor:  COLORS.white,
    borderWidth:      1.5,
    borderColor:      COLORS.border,
    borderRadius:     BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
  },
  rowFocused: {
    borderColor:   COLORS.primary,
    shadowColor:   COLORS.primary,
    shadowOffset:  { width: 0, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius:  4,
    elevation:     2,
  },
  rowError: {
    borderColor: COLORS.error,
  },
  input: {
    flex:     1,
    height:   52,
    fontSize: FONT_SIZES.md,
    color:    COLORS.text.primary,
  },
  eyeBtn: {
    paddingLeft: SPACING.xs,
  },
  eyeIcon: {
    fontSize: 18,
  },
  errorText: {
    fontSize:   FONT_SIZES.xs,
    color:      COLORS.error,
    marginTop:  SPACING.xs,
    marginLeft: SPACING.xs,
  },
});

export default CustomInput;
