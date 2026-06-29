/**
 * navigation/AppNavigator.tsx
 * Root navigation container.
 * Uses a Native Stack for smooth platform-native transitions.
 * Login has no header; Dashboard has a styled header and no back gesture.
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import LoginScreen    from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import { COLORS } from '../utils/constants';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerStyle:      { backgroundColor: COLORS.primary },
        headerTintColor:  COLORS.white,
        headerTitleStyle: { fontWeight: '700' },
        animation:        'slide_from_right',
      }}
    >
      {/* Login – no header so we can show a fully custom branded screen */}
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />

      {/* Dashboard – header with title; back button and swipe-back disabled */}
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title:           'Attendance Dashboard',
          headerBackVisible: false,
          gestureEnabled:  false,
        }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
