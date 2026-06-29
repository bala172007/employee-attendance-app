// src/screens/DashboardScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../components/CustomButton';
import { requestLocationPermission, getCurrentLocation } from '../services/locationService';
import { saveAttendanceRecord, getAttendanceRecords } from '../services/storageService';
import { getCurrentDate, getCurrentTime } from '../utils/dateTime';
import { APP_CONSTANTS } from '../utils/constants';

const DashboardScreen: React.FC = () => {
  const [status, setStatus] = useState(APP_CONSTANTS.STATUS_NOT_CHECKED_IN);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null);
  const [isCheckInDisabled, setIsCheckInDisabled] = useState(false);
  const [isCheckOutDisabled, setIsCheckOutDisabled] = useState(true);

  useEffect(() => {
    loadTodayAttendance();
  }, []);

  const loadTodayAttendance = async () => {
    const records = await getAttendanceRecords();
    const today = getCurrentDate();
    const todayRecord = records.find(r => r.date === today);

    if (todayRecord) {
      if (todayRecord.checkOut) {
        setStatus(APP_CONSTANTS.STATUS_CHECKED_OUT);
        setCheckInTime(todayRecord.checkIn?.time || null);
        setCheckOutTime(todayRecord.checkOut.time);
        setIsCheckInDisabled(true);
        setIsCheckOutDisabled(true);
      } else if (todayRecord.checkIn) {
        setStatus(APP_CONSTANTS.STATUS_CHECKED_IN);
        setCheckInTime(todayRecord.checkIn.time);
        setIsCheckInDisabled(true);
        setIsCheckOutDisabled(false);
      }
    }
  };

  const handleCheckIn = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Location permission is required to check in.');
      return;
    }

    const location = await getCurrentLocation();
    if (!location) {
      Alert.alert('Error', 'Unable to retrieve location.');
      return;
    }

    const time = getCurrentTime();
    const date = getCurrentDate();

    await saveAttendanceRecord({
      date,
      checkIn: { time, latitude: location.latitude, longitude: location.longitude }
    });

    setStatus(APP_CONSTANTS.STATUS_CHECKED_IN);
    setCheckInTime(time);
    setIsCheckInDisabled(true);
    setIsCheckOutDisabled(false);
    Alert.alert('Success', `Checked In Successfully\n${time}`);
  };

  const handleCheckOut = async () => {
    const location = await getCurrentLocation();
    if (!location) {
      Alert.alert('Error', 'Unable to retrieve location.');
      return;
    }

    const time = getCurrentTime();
    const date = getCurrentDate();

    await saveAttendanceRecord({
      date,
      checkOut: { time, latitude: location.latitude, longitude: location.longitude }
    });

    setStatus(APP_CONSTANTS.STATUS_CHECKED_OUT);
    setCheckOutTime(time);
    setIsCheckOutDisabled(true);
    Alert.alert('Success', `Checked Out Successfully\n${time}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.welcome}>Welcome, {APP_CONSTANTS.EMPLOYEE_NAME_STATIC}</Text>
        <Text style={styles.statusLabel}>Current Status:</Text>
        <Text style={styles.statusValue}>{status}</Text>

        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>Last Check-In: {checkInTime || '--:--'}</Text>
          <Text style={styles.timeText}>Last Check-Out: {checkOutTime || '--:--'}</Text>
        </View>

        <CustomButton 
          title="Check-In" 
          onPress={handleCheckIn} 
          disabled={isCheckInDisabled} 
        />
        <CustomButton 
          title="Check-Out" 
          onPress={handleCheckOut} 
          disabled={isCheckOutDisabled} 
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7', padding: 16 },
  card: { 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 12, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 10, 
    elevation: 5, 
    marginTop: 20 
  },
  welcome: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, color: '#333' },
  statusLabel: { fontSize: 16, color: '#666', marginTop: 10 },
  statusValue: { fontSize: 18, fontWeight: '600', color: '#007AFF', marginBottom: 20 },
  timeContainer: { marginBottom: 30, padding: 14, backgroundColor: '#F9F9F9', borderRadius: 8 },
  timeText: { fontSize: 14, color: '#555', marginVertical: 4 },
});

export default DashboardScreen;