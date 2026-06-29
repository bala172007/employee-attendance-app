// src/screens/LoginScreen.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { SafeAreaView } from 'react-native-safe-area-context';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [idError, setIdError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleLogin = () => {
    let isValid = true;
    
    if (!employeeId.trim()) {
      setIdError('Employee ID is required');
      isValid = false;
    } else {
      setIdError('');
    }

    if (!password.trim()) {
      setPasswordError('Password is required');
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (isValid) {
      // Since no API is required, any non-empty input is accepted
      navigation.navigate('Dashboard');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Employee Portal</Text>
        <CustomInput
          label="Employee ID / Email"
          placeholder="Enter your ID"
          value={employeeId}
          onChangeText={setEmployeeId}
          error={idError}
          autoCapitalize="none"
        />
        <CustomInput
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          error={passwordError}
          secureTextEntry
        />
        <CustomButton title="Login" onPress={handleLogin} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7', justifyContent: 'center' },
  formContainer: { 
    padding: 20, 
    backgroundColor: '#fff', 
    margin: 16, 
    borderRadius: 12, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 10, 
    elevation: 5 
  },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center', color: '#333' }
});

export default LoginScreen;