// file: App.js

import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';

// BƯỚC 1: Import SafeAreaProvider
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <AuthProvider>
      {/* BƯỚC 2: Bọc NavigationContainer trong SafeAreaProvider */}
      <SafeAreaProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </AuthProvider>
  );
}