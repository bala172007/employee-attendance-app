/**
 * screens/DashboardScreen.tsx
 * Main attendance dashboard.
 *
 * Features:
 *  • Live clock ticker (updates every second)
 *  • Check-In: requests location permission → gets GPS → saves to AsyncStorage
 *  • Check-Out: same GPS flow → updates today's record with checkout data
 *  • Button state machine: Not Checked In → Checked In → Completed
 *  • Today's attendance detail card with all captured fields
 *  • Pull-to-refresh reloads from AsyncStorage
 *  • Logout clears storage and navigates back to Login
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';  
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../components/CustomButton';
import Loading      from '../components/Loading';
import { DashboardScreenNavigationProp }           from '../types/navigation';
import { AttendanceRecord, AttendanceData, AttendanceStatus } from '../types/attendance';
import {
  getAttendance,
  saveAttendance,
  updateAttendance,
  getEmployee,
  clearStorage,
} from '../services/storageService';
import { requestPermission, getCurrentLocation } from '../services/locationService';
import {
  getCurrentDate,
  getCurrentTime,
  getFormattedDisplayDate,
} from '../utils/dateTime';
import {
  COLORS, SPACING, FONT_SIZES, BORDER_RADIUS,
  STATUS, MESSAGES, EMPLOYEE_NAME,
} from '../utils/constants';

// ─── Status badge colour map ──────────────────────────────────────────────────

const STATUS_COLORS: Record<AttendanceStatus, { bg: string; fg: string }> = {
  [STATUS.NOT_CHECKED_IN]: { bg: '#FEF3C7', fg: '#92400E' },
  [STATUS.CHECKED_IN]:     { bg: '#D1FAE5', fg: '#065F46' },
  [STATUS.COMPLETED]:      { bg: '#DBEAFE', fg: '#1E40AF' },
};

// ─── Component ────────────────────────────────────────────────────────────────

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<DashboardScreenNavigationProp>();

  // ── State ───────────────────────────────────────────────────────────────
  const [employeeId, setEmployeeId]       = useState('');
  const [todayRecord, setTodayRecord]     = useState<AttendanceRecord | null>(null);
  const [currentTime, setCurrentTime]     = useState(getCurrentTime());
  const [loading, setLoading]             = useState(false);
  const [loadingMsg, setLoadingMsg]       = useState('');
  const [refreshing, setRefreshing]       = useState(false);
  const [initialLoad, setInitialLoad]     = useState(true);

  // ── Derived state ────────────────────────────────────────────────────────
  const status: AttendanceStatus = todayRecord?.status ?? STATUS.NOT_CHECKED_IN;
  const canCheckIn  = status === STATUS.NOT_CHECKED_IN;
  const canCheckOut = status === STATUS.CHECKED_IN;
  const badgeColor  = STATUS_COLORS[status];

  // ── Live clock ───────────────────────────────────────────────────────────
  useEffect(() => {
    const tick = setInterval(() => setCurrentTime(getCurrentTime()), 1000);
    return () => clearInterval(tick);
  }, []);

  // ── Load data on mount ───────────────────────────────────────────────────
  useEffect(() => {
    loadData().finally(() => setInitialLoad(false));
  }, []);

  const loadData = async () => {
    try {
      const emp = await getEmployee();
      if (emp) setEmployeeId(emp.employeeId);

      const stored = await getAttendance();
      const today  = getCurrentDate();

      if (stored) {
        const record = stored.attendance.find((r) => r.date === today) ?? null;
        setTodayRecord(record);
      }
    } catch (err) {
      console.error('[Dashboard] loadData:', err);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  // ── GPS helper (shared by check-in and check-out) ────────────────────────
  const fetchLocation = async () => {
    setLoadingMsg('Requesting location permission…');

    const granted = await requestPermission();
    if (!granted) {
      throw new Error('PERMISSION_DENIED');
    }

    setLoadingMsg('Fetching GPS location…');
    return getCurrentLocation(); // throws on failure
  };

  // ── CHECK-IN ─────────────────────────────────────────────────────────────
  const handleCheckIn = async () => {
    if (!canCheckIn) {
      Alert.alert('Already Checked In', MESSAGES.CANNOT_CHECK_IN_TWICE);
      return;
    }

    setLoading(true);
    try {
      const coords = await fetchLocation();

      const today     = getCurrentDate();
      const time      = getCurrentTime();
      const newRecord: AttendanceRecord = {
        date:   today,
        checkIn:{ time, latitude: coords.latitude, longitude: coords.longitude },
        status: STATUS.CHECKED_IN,
      };

      setLoadingMsg('Saving attendance…');

      const stored = await getAttendance();
      if (stored) {
        await updateAttendance(newRecord);
      } else {
        // Very first attendance entry ever
        const fresh: AttendanceData = { employeeId, attendance: [newRecord] };
        await saveAttendance(fresh);
      }

      setTodayRecord(newRecord);
      Alert.alert('✅ Success', MESSAGES.CHECK_IN_SUCCESS);
    } catch (err: any) {
      if (err?.message === 'PERMISSION_DENIED') {
        Alert.alert('Permission Denied', MESSAGES.LOCATION_PERMISSION_DENIED);
      } else {
        Alert.alert('Location Error', err?.message ?? MESSAGES.GPS_UNAVAILABLE);
      }
    } finally {
      setLoading(false);
    }
  };

  // ── CHECK-OUT ────────────────────────────────────────────────────────────
  const handleCheckOut = async () => {
    if (status === STATUS.NOT_CHECKED_IN) {
      Alert.alert('Not Checked In', MESSAGES.CANNOT_CHECK_OUT_BEFORE_CHECK_IN);
      return;
    }
    if (status === STATUS.COMPLETED) {
      Alert.alert('Already Checked Out', MESSAGES.CANNOT_CHECK_OUT_TWICE);
      return;
    }

    setLoading(true);
    try {
      const coords = await fetchLocation();
      const time   = getCurrentTime();

      const updatedRecord: AttendanceRecord = {
        ...todayRecord!,
        checkOut: { time, latitude: coords.latitude, longitude: coords.longitude },
        status:   STATUS.COMPLETED,
      };

      setLoadingMsg('Saving attendance…');
      await updateAttendance(updatedRecord);

      setTodayRecord(updatedRecord);
      Alert.alert('✅ Success', MESSAGES.CHECK_OUT_SUCCESS);
    } catch (err: any) {
      if (err?.message === 'PERMISSION_DENIED') {
        Alert.alert('Permission Denied', MESSAGES.LOCATION_PERMISSION_DENIED);
      } else {
        Alert.alert('Location Error', err?.message ?? MESSAGES.GPS_UNAVAILABLE);
      }
    } finally {
      setLoading(false);
    }
  };

  // ── LOGOUT ───────────────────────────────────────────────────────────────
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await clearStorage();
            navigation.navigate('Login');
          },
        },
      ]
    );
  };

  // ── Hint text below action buttons ──────────────────────────────────────
  const hintText =
    status === STATUS.NOT_CHECKED_IN
      ? 'Tap Check In to start your workday.'
      : status === STATUS.CHECKED_IN
      ? 'Tap Check Out when your shift ends.'
      : '✔  Your attendance for today is complete.';

  // ── Render ──────────────────────────────────────────────────────────────
  if (initialLoad) {
    return <Loading visible message="Loading dashboard…" />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
      >
        {/* ── Welcome Card ─────────────────────────────────────── */}
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeRow}>
            <View style={styles.welcomeText}>
              <Text style={styles.welcomeGreeting}>Welcome back,</Text>
              <Text style={styles.welcomeName}>{EMPLOYEE_NAME}</Text>
              <Text style={styles.welcomeId}>ID: {employeeId}</Text>
            </View>
            <View style={styles.avatar}>
              <Text style={styles.avatarEmoji}>👤</Text>
            </View>
          </View>

          {/* Status badge */}
          <View style={[styles.badge, { backgroundColor: badgeColor.bg }]}>
            <Text style={[styles.badgeText, { color: badgeColor.fg }]}>
              ● {status}
            </Text>
          </View>
        </View>

        {/* ── Date & Time Card ─────────────────────────────────── */}
        <View style={styles.card}>
          <View style={styles.dtRow}>
            <View style={styles.dtBlock}>
              <Text style={styles.dtLabel}>📅  Today's Date</Text>
              <Text style={styles.dtDate}>{getFormattedDisplayDate()}</Text>
            </View>
            <View style={[styles.dtBlock, styles.dtRight]}>
              <Text style={styles.dtLabel}>🕐  Current Time</Text>
              <Text style={styles.dtTime}>{currentTime}</Text>
            </View>
          </View>
        </View>

        {/* ── Attendance Actions Card ───────────────────────────── */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Mark Attendance</Text>

          <View style={styles.btnRow}>
            <CustomButton
              title="✅  Check In"
              onPress={handleCheckIn}
              disabled={!canCheckIn}
              variant="success"
              style={styles.halfBtn}
            />
            <View style={styles.btnGap} />
            <CustomButton
              title="🔴  Check Out"
              onPress={handleCheckOut}
              disabled={!canCheckOut}
              variant="danger"
              style={styles.halfBtn}
            />
          </View>

          <Text style={styles.hintText}>{hintText}</Text>
        </View>

        {/* ── Today's Attendance Detail Card ───────────────────── */}
        {todayRecord && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>📋  Today's Attendance</Text>

            <DetailRow label="Date" value={todayRecord.date} />
            <Divider />

            {/* Check-In section */}
            {todayRecord.checkIn && (
              <>
                <Text style={styles.subTitle}>Check-In</Text>
                <DetailRow
                  label="⏰  Time"
                  value={todayRecord.checkIn.time}
                  valueColor={COLORS.success}
                />
                <DetailRow
                  label="📍  Latitude"
                  value={String(todayRecord.checkIn.latitude)}
                />
                <DetailRow
                  label="📍  Longitude"
                  value={String(todayRecord.checkIn.longitude)}
                />
              </>
            )}

            {/* Check-Out section */}
            {todayRecord.checkOut && (
              <>
                <Divider />
                <Text style={styles.subTitle}>Check-Out</Text>
                <DetailRow
                  label="⏰  Time"
                  value={todayRecord.checkOut.time}
                  valueColor={COLORS.error}
                />
                <DetailRow
                  label="📍  Latitude"
                  value={String(todayRecord.checkOut.latitude)}
                />
                <DetailRow
                  label="📍  Longitude"
                  value={String(todayRecord.checkOut.longitude)}
                />
              </>
            )}

            {/* Status row */}
            <Divider />
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status</Text>
              <View style={[styles.inlineBadge, { backgroundColor: badgeColor.bg }]}>
                <Text style={[styles.inlineBadgeText, { color: badgeColor.fg }]}>
                  {status}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* ── Logout ───────────────────────────────────────────── */}
        <CustomButton
          title="Sign Out"
          onPress={handleLogout}
          variant="outline"
          style={styles.logoutBtn}
        />
      </ScrollView>

      <Loading visible={loading} message={loadingMsg} />
    </SafeAreaView>
  );
};

// ─── Small helper components (private to this file) ───────────────────────────

interface DetailRowProps {
  label: string;
  value: string;
  valueColor?: string;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value, valueColor }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text
      style={[styles.detailValue, valueColor ? { color: valueColor } : undefined]}
      numberOfLines={1}
    >
      {value}
    </Text>
  </View>
);

const Divider: React.FC = () => <View style={styles.divider} />;

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex:            1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    padding:       SPACING.md,
    paddingBottom: SPACING.xxl,
  },

  // Welcome card (blue)
  welcomeCard: {
    backgroundColor: COLORS.primary,
    borderRadius:    BORDER_RADIUS.lg,
    padding:         SPACING.lg,
    marginBottom:    SPACING.md,
    shadowColor:     COLORS.primary,
    shadowOffset:    { width: 0, height: 6 },
    shadowOpacity:   0.32,
    shadowRadius:    12,
    elevation:       8,
  },
  welcomeRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'flex-start',
  },
  welcomeText: { flex: 1 },
  welcomeGreeting: {
    fontSize: FONT_SIZES.sm,
    color:    'rgba(255,255,255,0.72)',
  },
  welcomeName: {
    fontSize:   FONT_SIZES.xl,
    fontWeight: '800',
    color:      COLORS.white,
    marginTop:  2,
  },
  welcomeId: {
    fontSize:  FONT_SIZES.sm,
    color:     'rgba(255,255,255,0.65)',
    marginTop: 4,
  },
  avatar: {
    width:           52,
    height:          52,
    borderRadius:    26,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth:     2,
    borderColor:     'rgba(255,255,255,0.36)',
    justifyContent:  'center',
    alignItems:      'center',
  },
  avatarEmoji: { fontSize: 26 },
  badge: {
    alignSelf:        'flex-start',
    borderRadius:     BORDER_RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical:  SPACING.xs,
    marginTop:        SPACING.md,
  },
  badgeText: {
    fontSize:   FONT_SIZES.sm,
    fontWeight: '700',
  },

  // Generic white card
  card: {
    backgroundColor: COLORS.white,
    borderRadius:    BORDER_RADIUS.lg,
    padding:         SPACING.lg,
    marginBottom:    SPACING.md,
    shadowColor:     '#000',
    shadowOffset:    { width: 0, height: 2 },
    shadowOpacity:   0.07,
    shadowRadius:    8,
    elevation:       3,
  },
  sectionTitle: {
    fontSize:     FONT_SIZES.lg,
    fontWeight:   '700',
    color:        COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  subTitle: {
    fontSize:     FONT_SIZES.md,
    fontWeight:   '700',
    color:        COLORS.primary,
    marginTop:    SPACING.sm,
    marginBottom: SPACING.xs,
  },

  // Date / Time row
  dtRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
  },
  dtBlock: { flex: 1 },
  dtRight: { alignItems: 'flex-end' },
  dtLabel: {
    fontSize:     FONT_SIZES.xs,
    color:        COLORS.text.secondary,
    fontWeight:   '500',
    marginBottom: 4,
  },
  dtDate: {
    fontSize:   FONT_SIZES.sm,
    fontWeight: '600',
    color:      COLORS.text.primary,
  },
  dtTime: {
    fontSize:   FONT_SIZES.xl,
    fontWeight: '800',
    color:      COLORS.primary,
  },

  // Action buttons
  btnRow: {
    flexDirection: 'row',
    marginBottom:  SPACING.md,
  },
  halfBtn: { flex: 1 },
  btnGap:  { width: SPACING.sm },
  hintText: {
    fontSize:   FONT_SIZES.xs,
    color:      COLORS.text.secondary,
    textAlign:  'center',
    fontStyle:  'italic',
  },

  // Detail rows inside today's card
  detailRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    paddingVertical: SPACING.xs,
  },
  detailLabel: {
    fontSize:   FONT_SIZES.sm,
    color:      COLORS.text.secondary,
    fontWeight: '500',
  },
  detailValue: {
    fontSize:   FONT_SIZES.sm,
    color:      COLORS.text.primary,
    fontWeight: '600',
    maxWidth:   '58%',
    textAlign:  'right',
  },
  divider: {
    height:          1,
    backgroundColor: COLORS.lightGray,
    marginVertical:  SPACING.sm,
  },
  inlineBadge: {
    borderRadius:      BORDER_RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical:   3,
  },
  inlineBadgeText: {
    fontSize:   FONT_SIZES.xs,
    fontWeight: '700',
  },

  // Logout
  logoutBtn: { marginTop: SPACING.sm },
});

export default DashboardScreen;
