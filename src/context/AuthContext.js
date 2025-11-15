// file: src/context/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Import hai hàm xử lý API từ file apiClient
import { registerUser, loginUser } from '../api/apiClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [userToken, setUserToken] = useState(null);

    const login = async (email, password) => {
        setIsLoading(true);
        try {
            const response = await loginUser({ email, password });
            const token = response.data.access_token;
            setUserToken(token);
            await AsyncStorage.setItem('userToken', token);
        } catch (error) {
            console.error("Lỗi đăng nhập:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        setUserToken(null);
        await AsyncStorage.removeItem('userToken');
        setIsLoading(false);
    };

    // HÀM REGISTER ĐÚNG
    const register = async (name, email, password) => {
        setIsLoading(true);
        try {
            // Chỉ cần gọi hàm registerUser ở đây.
            // Dòng axios.post lỗi đã được xóa.
            await registerUser({ name, email, password });
        } catch (error) {
            console.error("Lỗi đăng ký:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const checkLoginStatus = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            setUserToken(token);
        } catch (e) {
            console.log(`Lỗi kiểm tra đăng nhập: ${e}`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkLoginStatus();
    }, []);

    return (
        <AuthContext.Provider value={{ login, logout, register, isLoading, userToken }}>
            {children}
        </AuthContext.Provider>
    );
};