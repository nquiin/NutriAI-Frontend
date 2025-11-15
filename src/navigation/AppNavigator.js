// file: frontend/src/navigation/AppNavigator.js

import React, { useContext } from 'react';
// <<< XÓA DÒNG NÀY NẾU CÓ: import { NavigationContainer } from '@react-navigation/native'; >>>
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import MealPlanScreen from '../screens/MealPlanScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ChatScreen from '../screens/ChatScreen';
import SearchScreen from '../screens/SearchScreen'; 
import HistoryScreen from '../screens/HistoryScreen';

import { AuthContext } from '../context/AuthContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Home') {
          iconName = focused ? 'restaurant' : 'restaurant-outline';
        } else if (route.name === 'Search') {
          iconName = focused ? 'search' : 'search-outline';
        } else if (route.name === 'Chat') {
          iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          
        }  else if (route.name === 'History') { // Thêm điều kiện cho icon mới
          iconName = focused ? 'time' : 'time-outline';
        }else if (route.name === 'Profile') {
          iconName = focused ? 'person-circle' : 'person-circle-outline';
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#191970',
      tabBarInactiveTintColor: 'gray',
      headerShown: false, // Thường thì các tab không cần header riêng
    })}
  >
    <Tab.Screen name="char" component={HomeScreen} options={{ title: 'Trang chủ' }} />
    <Tab.Screen name="Home" component={MealPlanScreen} options={{ title: 'Thực Đơn' }} />
    <Tab.Screen name="Search" component={SearchScreen} options={{ title: 'Tìm Kiếm' }} />
    <Tab.Screen name="Chat" component={ChatScreen} options={{ title: 'Tư Vấn' }} />
     <Tab.Screen name="History" component={HistoryScreen} options={{ title: 'Lịch Sử' }} />
    <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Cá Nhân' }} />
  </Tab.Navigator>
);

const AppNavigator = () => {
  const { userToken } = useContext(AuthContext);

  // <<< SỬA ĐỔI QUAN TRỌC: Chỉ trả về JSX, không bọc trong NavigationContainer >>>
  return (
    <>
      {userToken ? (
        <MainTabs />
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      )}
    </>
  );
};

export default AppNavigator;