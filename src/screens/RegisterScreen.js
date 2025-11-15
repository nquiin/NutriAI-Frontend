// file: frontend/src/screens/RegisterScreen.js

import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  Alert, 
  TouchableOpacity, // Dùng để tạo nút có thể tùy chỉnh style
  ActivityIndicator // Vòng xoay loading
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthContext } from '../context/AuthContext';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Kích hoạt dòng này để lấy hàm `register` từ context
  const { register } = useContext(AuthContext);

  const handleRegister = async () => {
    if (!email || !password || !name) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    setIsLoading(true);
    try {
      // Gọi hàm register thật từ context
      await register(name, email, password);

      Alert.alert('Thành công', 'Đăng ký tài khoản thành công! Vui lòng đăng nhập.');
      navigation.navigate('Login'); // Chuyển về trang Login sau khi đăng ký
    } catch (error) {
      // Hiển thị lỗi cụ thể hơn nếu có
      Alert.alert('Đăng ký thất bại', 'Email có thể đã được sử dụng hoặc có lỗi xảy ra.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Tạo tài khoản</Text>
      <Text style={styles.subtitle}>Bắt đầu hành trình sống khỏe của bạn</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Họ và tên"
        value={name}
        onChangeText={setName}
      />
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

      {/* Thay thế Button bằng TouchableOpacity đã được style */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#1e88e5" style={{ marginVertical: 10 }}/>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Đăng Ký</Text>
        </TouchableOpacity>
      )}

      {/* Nút quay lại trang Đăng nhập */}
      <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.secondaryButtonText}>Đã có tài khoản? Đăng nhập</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

// --- Bổ sung phần Stylesheet ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
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
    fontSize: 16,
  },
  button: {
    backgroundColor: '#191970',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#191970',
    fontSize: 16,
  },
});

export default RegisterScreen;