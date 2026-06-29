/**
 * utils/dateTime.ts
 * Pure date / time utility functions.
 * All screens and services use these helpers instead of calling Date() directly.
 */

/**
 * Returns today's date formatted as YYYY-MM-DD.
 * Example: "2026-06-27"
 */
export const getCurrentDate = (): string => {
  const now = new Date();
  return formatDate(now);
};

/**
 * Returns the current time formatted as HH:MM AM/PM.
 * Example: "09:05 AM"
 */
export const getCurrentTime = (): string => {
  return formatTime(new Date());
};

/**
 * Formats a Date object to YYYY-MM-DD string.
 */
export const formatDate = (date: Date): string => {
  const year  = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day   = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Formats a Date object to "HH:MM AM/PM" string.
 */
export const formatTime = (date: Date): string => {
  let hours      = date.getHours();
  const minutes  = String(date.getMinutes()).padStart(2, '0');
  const meridiem = hours >= 12 ? 'PM' : 'AM';
  hours          = hours % 12 || 12;   // 0 → 12, 13 → 1, etc.
  return `${String(hours).padStart(2, '0')}:${minutes} ${meridiem}`;
};

/**
 * Returns a long, human-readable date string for display purposes.
 * Example: "Saturday, June 27, 2026"
 */
export const getFormattedDisplayDate = (): string => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year:    'numeric',
    month:   'long',
    day:     'numeric',
  });
};
