/**
 * components/Loading.tsx
 * Full-screen semi-transparent modal that blocks interaction while async work runs.
 * Accepts a custom message string so context is always clear to the user.
 */

import React from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  Modal,
} from 'react-native';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../utils/constants';

// ─── Props ────────────────────────────────────────────────────────────────────

interface LoadingProps {
  visible: boolean;
  message?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

const Loading: React.FC<LoadingProps> = ({
  visible,
  message = 'Please wait…',
}) => (
  <Modal
    transparent
    animationType="fade"
    visible={visible}
    statusBarTranslucent
  >
    <View style={styles.overlay}>
      <View style={styles.card}>
        <ActivityIndicator color={COLORS.primary} size="large" />
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  </Modal>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  overlay: {
    flex:            1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent:  'center',
    alignItems:      'center',
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius:    BORDER_RADIUS.lg,
    padding:         SPACING.xl,
    alignItems:      'center',
    shadowColor:     '#000',
    shadowOffset:    { width: 0, height: 6 },
    shadowOpacity:   0.2,
    shadowRadius:    14,
    elevation:       10,
    minWidth:        170,
  },
  message: {
    marginTop:  SPACING.md,
    fontSize:   FONT_SIZES.sm,
    color:      COLORS.text.secondary,
    fontWeight: '500',
    textAlign:  'center',
  },
});

export default Loading;
