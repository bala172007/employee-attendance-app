/**
 * types/attendance.ts
 * Centralised TypeScript interfaces for the Attendance domain.
 */

/** GPS coordinates captured at check-in / check-out. */
export interface LocationData {
  latitude: number;
  longitude: number;
}

/** Data captured when an employee checks in. */
export interface CheckInData {
  time: string;       // "09:05 AM"
  latitude: number;
  longitude: number;
}

/** Data captured when an employee checks out. */
export interface CheckOutData {
  time: string;       // "06:15 PM"
  latitude: number;
  longitude: number;
}

/** The three possible states of a daily attendance record. */
export type AttendanceStatus = 'Not Checked In' | 'Checked In' | 'Completed';

/** A single day's attendance record. */
export interface AttendanceRecord {
  date: string;              // "YYYY-MM-DD"
  checkIn?: CheckInData;
  checkOut?: CheckOutData;
  status: AttendanceStatus;
}

/** Top-level structure stored in AsyncStorage. */
export interface AttendanceData {
  employeeId: string;
  attendance: AttendanceRecord[];
}

/** Minimal employee profile saved on login. */
export interface Employee {
  employeeId: string;
  name: string;
}
