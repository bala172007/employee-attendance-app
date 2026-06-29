/**
 * utils/validators.ts
 * Pure validation functions for all form fields.
 * Return error strings so they can be displayed directly under inputs.
 */

import { MESSAGES } from './constants';

/**
 * Validates the Employee ID field.
 * Returns a non-empty error string on failure, or '' on success.
 */
export const validateEmployeeId = (value: string): string => {
  if (!value || value.trim().length === 0) {
    return MESSAGES.EMPLOYEE_ID_REQUIRED;
  }
  return '';
};

/**
 * Validates the Password field.
 * Returns a non-empty error string on failure, or '' on success.
 */
export const validatePassword = (value: string): string => {
  if (!value || value.trim().length === 0) {
    return MESSAGES.PASSWORD_REQUIRED;
  }
  return '';
};

/**
 * Validates the full login form in one call.
 * Returns field-level errors plus a convenience `isValid` flag.
 */
export const validateLoginForm = (
  employeeId: string,
  password: string
): {
  employeeIdError: string;
  passwordError: string;
  isValid: boolean;
} => {
  const employeeIdError = validateEmployeeId(employeeId);
  const passwordError   = validatePassword(password);
  return {
    employeeIdError,
    passwordError,
    isValid: !employeeIdError && !passwordError,
  };
};
