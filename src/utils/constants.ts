/**
 * utils/constants.ts
 * Single source of truth for all app-wide constants.
 * Never hardcode values in screens or components; import from here.
 */

// ─── Design tokens ──────────────────────────────────────────────────────────

export const COLORS = {
  primary:       '#2563EB',
  primaryDark:   '#1D4ED8',
  primaryLight:  '#EFF6FF',
  background:    '#F3F4F6',
  white:         '#FFFFFF',
  black:         '#111827',
  gray:          '#6B7280',
  lightGray:     '#E5E7EB',
  error:         '#EF4444',
  success:       '#10B981',
  warning:       '#F59E0B',
  cardBackground:'#FFFFFF',
  border:        '#D1D5DB',
  text: {
    primary:   '#111827',
    secondary: '#6B7280',
    light:     '#9CA3AF',
  },
};

export const FONT_SIZES = {
  xs:   11,
  sm:   13,
  md:   15,
  lg:   17,
  xl:   20,
  xxl:  24,
  xxxl: 30,
};

export const SPACING = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
};

export const BORDER_RADIUS = {
  sm:   8,
  md:   12,
  lg:   16,
  xl:   24,
  full: 999,
};

// ─── AsyncStorage keys ──────────────────────────────────────────────────────

export const STORAGE_KEYS = {
  ATTENDANCE: 'attendance_data',
  EMPLOYEE:   'employee_data',
} as const;

// ─── Attendance status literals ─────────────────────────────────────────────

export const STATUS = {
  NOT_CHECKED_IN: 'Not Checked In' as const,
  CHECKED_IN:     'Checked In'     as const,
  COMPLETED:      'Completed'      as const,
};

// ─── User-facing messages ────────────────────────────────────────────────────

export const MESSAGES = {
  CHECK_IN_SUCCESS:                  'Checked In Successfully',
  CHECK_OUT_SUCCESS:                 'Checked Out Successfully',
  LOCATION_PERMISSION_DENIED:        'Location permission is required to mark attendance.',
  GPS_UNAVAILABLE:                   'Unable to fetch GPS location. Please try again.',
  STORAGE_ERROR:                     'Failed to save data. Please try again.',
  EMPLOYEE_ID_REQUIRED:              'Employee ID is required.',
  PASSWORD_REQUIRED:                 'Password is required.',
  CANNOT_CHECK_IN_TWICE:             'You have already checked in today.',
  CANNOT_CHECK_OUT_BEFORE_CHECK_IN:  'Please check in first before checking out.',
  CANNOT_CHECK_OUT_TWICE:            'You have already checked out today.',
} as const;

// ─── Static employee data (no backend) ──────────────────────────────────────

/** Display name shown on the dashboard. In a real app this comes from the API. */
export const EMPLOYEE_NAME = 'John Doe';
