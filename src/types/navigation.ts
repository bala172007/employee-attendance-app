/**
 * types/navigation.ts
 * Typed route params for React Navigation.
 * Keeps all navigation types in one place so screens never import from each other.
 */

import { NativeStackNavigationProp } from '@react-navigation/native-stack';

/** All routes in the app and their params (undefined = no params). */
export type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
};

/** Typed navigation prop for LoginScreen. */
export type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

/** Typed navigation prop for DashboardScreen. */
export type DashboardScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Dashboard'
>;
