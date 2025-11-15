// file: frontend/src/screens/LoginScreen.js

import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// BƯỚC 1: Import AuthContext để sử dụng hàm login
import { AuthContext } from '../context/AuthContext';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // BƯỚC 2: Lấy hàm `login` từ context
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ email và mật khẩu.');
      return;
    }

    setIsLoading(true);
    try {
      // BƯỚC 3: Gọi hàm login từ context
      // Hàm này sẽ xử lý việc gọi API, lưu token và cập nhật trạng thái
      await login(email, password);
      
      // KHÔNG CẦN navigation.replace('Home') ở đây nữa.
      // AppNavigator sẽ tự động chuyển màn hình khi userToken thay đổi.

    } catch (error) {
      Alert.alert('Đăng nhập thất bại', 'Email hoặc mật khẩu không đúng. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>NutriAI</Text>
      <Text style={styles.subtitle}>Trợ lý dinh dưỡng thông minh</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {isLoading ? (
        <ActivityIndicator size="large" color="#191970" />
      ) : (
        <Button title="Đăng nhập" color="#191970" onPress={handleLogin} />
      )}
      
      {/* BƯỚC 4: Thêm nút điều hướng đến trang Đăng ký */}
      <View style={{ marginTop: 15 }}>
        <Button 
          title="Chưa có tài khoản? Đăng ký" 
          onPress={() => navigation.navigate('Register')} // 'Register' là tên màn hình trong AuthNavigator
          color="#888"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#191970',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
});

export default LoginScreen;