// src/services/storageService.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { DailyAttendance } from '../types/attendance';
import { APP_CONSTANTS } from '../utils/constants';

export const saveAttendanceRecord = async (newRecord: DailyAttendance): Promise<void> => {
  try {
    const existingData = await AsyncStorage.getItem(APP_CONSTANTS.STORAGE_KEY);
    let records: DailyAttendance[] = existingData ? JSON.parse(existingData) : [];
    
    // Check if a record already exists for today
    const todayIndex = records.findIndex(r => r.date === newRecord.date);
    
    if (todayIndex >= 0) {
      // Merge the new data (like checkOut) into today's existing record
      records[todayIndex] = { ...records[todayIndex], ...newRecord };
    } else {
      // Add a brand new record for today
      records.push(newRecord);
    }

    await AsyncStorage.setItem(APP_CONSTANTS.STORAGE_KEY, JSON.stringify(records));
  } catch (error) {
    console.error("Error saving attendance", error);
    throw error;
  }
};

export const getAttendanceRecords = async (): Promise<DailyAttendance[]> => {
  try {
    const data = await AsyncStorage.getItem(APP_CONSTANTS.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error fetching attendance records", error);
    return [];
  }
};