// src/types/attendance.ts

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface CheckInOutData {
  time: string;
  latitude: number;
  longitude: number;
}

export interface DailyAttendance {
  date: string;
  checkIn?: CheckInOutData;
  checkOut?: CheckInOutData;
}

export interface EmployeeRecord {
  employeeId: string;
  attendance: DailyAttendance[];
}