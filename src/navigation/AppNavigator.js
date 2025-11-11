// file: frontend/src/navigation/AppNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ChatScreen from '../screens/ChatScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerStyle: { backgroundColor: '#1e88e5' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Đăng nhập' }} />
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Trang chủ' }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Hồ sơ của bạn' }} />
      <Stack.Screen name="Chat" component={ChatScreen} options={{ title: 'Trợ lý NutriAI' }} />
    </Stack.Navigator>
  );
};

export default AppNavigator;