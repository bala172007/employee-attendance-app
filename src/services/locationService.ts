// src/services/locationService.ts

import * as Location from 'expo-location';
import { LocationCoordinates } from '../types/attendance';

export const requestLocationPermission = async (): Promise<boolean> => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted';
};

export const getCurrentLocation = async (): Promise<LocationCoordinates | null> => {
  try {
    const location = await Location.getCurrentPositionAsync({});
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error("Error fetching location", error);
    return null;
  }
};