/**
 * services/locationService.ts
 * Reusable service for Expo Location.
 * Handles permission requests, GPS fetching, and maps errors to user-friendly messages.
 */

import * as Location from 'expo-location';
import { LocationData } from '../types/attendance';

// ─── Permission ───────────────────────────────────────────────────────────────

/**
 * Requests foreground location permission from the OS.
 * Returns true if granted, false if denied or if the request fails.
 */
export const requestPermission = async (): Promise<boolean> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === Location.PermissionStatus.GRANTED;
  } catch (error) {
    console.error('[locationService] requestPermission:', error);
    return false;
  }
};

// ─── GPS ─────────────────────────────────────────────────────────────────────

/**
 * Returns the device's current GPS coordinates.
 *
 * Throws a descriptive Error if:
 *  – location permission has not been granted
 *  – GPS is unavailable or the request times out
 */
export const getCurrentLocation = async (): Promise<LocationData> => {
  // Re-check permission status before attempting to read GPS.
  const { status } = await Location.getForegroundPermissionsAsync();

  if (status !== Location.PermissionStatus.GRANTED) {
    throw new Error('Location permission is required.');
  }

  try {
    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    return {
      // Round to 6 decimal places for clean storage.
      latitude:  parseFloat(position.coords.latitude.toFixed(6)),
      longitude: parseFloat(position.coords.longitude.toFixed(6)),
    };
  } catch (error: any) {
    console.error('[locationService] getCurrentLocation:', error);

    // Map known Expo Location error codes to friendly strings.
    const message: string = error?.message ?? '';

    if (message.includes('unavailable')) {
      throw new Error('Location is currently unavailable. Please enable GPS and try again.');
    }
    if (message.includes('timed out') || message.includes('timeout')) {
      throw new Error('GPS timed out. Please move to an open area and try again.');
    }

    throw new Error('Unable to fetch GPS location. Please try again.');
  }
};
