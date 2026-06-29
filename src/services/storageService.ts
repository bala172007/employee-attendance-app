/**
 * services/storageService.ts
 * Reusable AsyncStorage service.
 * All reads and writes go through these functions so screens stay clean.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { AttendanceData, AttendanceRecord, Employee } from '../types/attendance';
import { STORAGE_KEYS } from '../utils/constants';

// ─── Attendance ──────────────────────────────────────────────────────────────

/**
 * Persists a complete AttendanceData object (overwrites previous value).
 */
export const saveAttendance = async (data: AttendanceData): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(data));
  } catch (error) {
    console.error('[storageService] saveAttendance:', error);
    throw new Error('Failed to save attendance data.');
  }
};

/**
 * Retrieves the stored AttendanceData, or null if nothing is saved yet.
 */
export const getAttendance = async (): Promise<AttendanceData | null> => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    return raw ? (JSON.parse(raw) as AttendanceData) : null;
  } catch (error) {
    console.error('[storageService] getAttendance:', error);
    return null;
  }
};

/**
 * Updates (or inserts) a single AttendanceRecord identified by its date.
 * If a record for that date already exists it is replaced; otherwise appended.
 */
export const updateAttendance = async (
  updatedRecord: AttendanceRecord
): Promise<void> => {
  try {
    const data = await getAttendance();
    if (!data) {
      throw new Error('No attendance data found – call saveAttendance first.');
    }

    const idx = data.attendance.findIndex(
      (r) => r.date === updatedRecord.date
    );

    if (idx !== -1) {
      data.attendance[idx] = updatedRecord;   // replace
    } else {
      data.attendance.push(updatedRecord);    // insert
    }

    await saveAttendance(data);
  } catch (error) {
    console.error('[storageService] updateAttendance:', error);
    throw new Error('Failed to update attendance record.');
  }
};

// ─── Employee ─────────────────────────────────────────────────────────────────

/**
 * Persists the logged-in employee's basic profile.
 */
export const saveEmployee = async (employee: Employee): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.EMPLOYEE, JSON.stringify(employee));
  } catch (error) {
    console.error('[storageService] saveEmployee:', error);
    throw new Error('Failed to save employee data.');
  }
};

/**
 * Retrieves the saved employee profile, or null if not found.
 */
export const getEmployee = async (): Promise<Employee | null> => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.EMPLOYEE);
    return raw ? (JSON.parse(raw) as Employee) : null;
  } catch (error) {
    console.error('[storageService] getEmployee:', error);
    return null;
  }
};

// ─── Housekeeping ─────────────────────────────────────────────────────────────

/**
 * Removes all app data from AsyncStorage (used on logout).
 */
export const clearStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.ATTENDANCE,
      STORAGE_KEYS.EMPLOYEE,
    ]);
  } catch (error) {
    console.error('[storageService] clearStorage:', error);
    throw new Error('Failed to clear storage.');
  }
};
