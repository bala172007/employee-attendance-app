/**
 * screens/LoginScreen.tsx
 * Employee login screen.
 *
 * – Validates Employee ID and Password (both required; any non-empty value accepted).
 * – Saves employee profile to AsyncStorage on success.
 * – Navigates to Dashboard after successful login.
 * – No backend – authentication is purely client-side.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';  
import { useNavigation } from '@react-navigation/native';
import CustomButton   from '../components/CustomButton';
import CustomInput    from '../components/CustomInput';
import Loading        from '../components/Loading';
import { LoginScreenNavigationProp } from '../types/navigation';
import { validateLoginForm }         from '../utils/validators';
import { saveEmployee }              from '../services/storageService';
import {
  COLORS,
  SPACING,
  FONT_SIZES,
  BORDER_RADIUS,
  EMPLOYEE_NAME,
  MESSAGES,
} from '../utils/constants';

// ─── Component ────────────────────────────────────────────────────────────────

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  // ── Form state ──────────────────────────────────────────────────────────
  const [employeeId, setEmployeeId]           = useState('');
  const [password, setPassword]               = useState('');
  const [employeeIdError, setEmployeeIdError] = useState('');
  const [passwordError, setPasswordError]     = useState('');
  const [loading, setLoading]                 = useState(false);

  // ── Handlers ────────────────────────────────────────────────────────────

  const handleLogin = async () => {
    // 1. Validate
    const { employeeIdError: idErr, passwordError: pwErr, isValid } =
      validateLoginForm(employeeId, password);

    setEmployeeIdError(idErr);
    setPasswordError(pwErr);
    if (!isValid) return;

    // 2. Persist & navigate
    setLoading(true);
    try {
      await saveEmployee({ employeeId: employeeId.trim(), name: EMPLOYEE_NAME });
      navigation.navigate('Dashboard');
    } catch {
      Alert.alert('Error', MESSAGES.STORAGE_ERROR);
    } finally {
      setLoading(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.safeArea}>
    
      
      <ScrollView
      contentContainerStyle={styles.scroll}
      keyboardShouldPersistTaps="always"
      keyboardDismissMode="none"
      showsVerticalScrollIndicator={false}
      scrollEnabled={true}
        >
          {/* ── Logo / Branding ──────────────────────────────────── */}
          <View style={styles.logoSection}>
            <View style={styles.logoBubble}>
              <Text style={styles.logoEmoji}>🏢</Text>
            </View>
            <Text style={styles.appName}>AttendTrack</Text>
            <Text style={styles.tagline}>Employee Attendance System</Text>
          </View>

          {/* ── Login Card ───────────────────────────────────────── */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Welcome Back</Text>
            <Text style={styles.cardSubtitle}>
              Sign in to your employee account
            </Text>

            <CustomInput
              label="Employee ID"
              placeholder="e.g. EMP001"
              value={employeeId}
              onChangeText={(t) => {
                setEmployeeId(t);
                if (employeeIdError) setEmployeeIdError('');
              }}
              errorMessage={employeeIdError}
              returnKeyType="next"
            />

            <CustomInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                if (passwordError) setPasswordError('');
              }}
              errorMessage={passwordError}
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />

            <CustomButton
              title="Sign In"
              onPress={handleLogin}
              loading={loading}
              style={styles.signInBtn}
            />
          </View>

          {/* ── Footer ───────────────────────────────────────────── */}
          <Text style={styles.footer}>
            © 2026 AttendTrack · All rights reserved
          </Text>
        </ScrollView>
      

      {/* Global loading overlay */}
      <Loading visible={loading} message="Signing in…" />
    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex:            1,
    backgroundColor: COLORS.primary,
  },
  flex: { flex: 1 },
  scroll: {
    flexGrow:          1,
    justifyContent:    'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical:   SPACING.xl,
  },

  // Branding
  logoSection: {
    alignItems:   'center',
    marginBottom: SPACING.xl,
  },
  logoBubble: {
    width:           90,
    height:          90,
    borderRadius:    BORDER_RADIUS.xl,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth:     2,
    borderColor:     'rgba(255,255,255,0.38)',
    justifyContent:  'center',
    alignItems:      'center',
    marginBottom:    SPACING.md,
  },
  logoEmoji: {
    fontSize: 42,
  },
  appName: {
    fontSize:      FONT_SIZES.xxxl,
    fontWeight:    '800',
    color:         COLORS.white,
    letterSpacing: 1,
  },
  tagline: {
    fontSize:   FONT_SIZES.sm,
    color:      'rgba(255,255,255,0.72)',
    marginTop:  SPACING.xs,
    fontWeight: '500',
  },

  // Card
  card: {
    backgroundColor: COLORS.white,
    borderRadius:    BORDER_RADIUS.xl,
    padding:         SPACING.xl,
    shadowColor:     '#000',
    shadowOffset:    { width: 0, height: 8 },
    shadowOpacity:   0.14,
    shadowRadius:    20,
    elevation:       10,
  },
  cardTitle: {
    fontSize:     FONT_SIZES.xxl,
    fontWeight:   '800',
    color:        COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  cardSubtitle: {
    fontSize:     FONT_SIZES.sm,
    color:        COLORS.text.secondary,
    marginBottom: SPACING.lg,
  },
  signInBtn: {
    marginTop: SPACING.sm,
  },

  // Footer
  footer: {
    textAlign:  'center',
    color:      'rgba(255,255,255,0.55)',
    fontSize:   FONT_SIZES.xs,
    marginTop:  SPACING.xl,
  },
});

export default LoginScreen;
