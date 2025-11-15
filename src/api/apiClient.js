// file: frontend/src/api/apiClient.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// !! QUAN TRỌNG: Thay bằng địa chỉ IP của máy tính bạn đang chạy backend Flask
const API_BASE_URL = 'http://10.157.119.48:5000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Tự động đính kèm token vào mỗi request nếu đã đăng nhập
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// === API Xác thực ===
export const registerUser = (userData) => apiClient.post('/api/register', userData);
export const loginUser = (credentials) => apiClient.post('/api/login', credentials);

// === API Người dùng (Profile) ===
export const getUserProfile = () => apiClient.get('/api/profile');
export const updateUserProfile = (profileData) => apiClient.put('/api/profile', profileData);

// === API Thực đơn & Dinh dưỡng ===
export const getMenuSuggestions = (data = {}) => apiClient.post('/api/suggest_ml', data);
export const getSingleReplacementMeal = (mealToReplace) => apiClient.post('/api/suggest_one_meal', { meal: mealToReplace }); // Lấy 1 món thay thế
export const logMealToDay = (foodItem) => apiClient.post('/api/log/meal', { food: foodItem });
export const getTodayLog = () => apiClient.get('/api/log/today');
export const getWeeklyHistory = () => apiClient.get('/api/log/history?range=week'); // Lấy lịch sử 7 ngày

// === API Lịch sử Bữa ăn ===
export const logMeal = (mealData) => apiClient.post('/api/log/meal', mealData);
export const getMealHistory = (range = 'day') => apiClient.get(`/api/log/history?range=${range}`);

// === API Tìm kiếm ===
export const searchFoods = (query) => apiClient.get(`/api/search/foods?q=${query}`);

// === API Chatbot ===
export const postChatMessage = (messagesArray, conversationId) => {
    return apiClient.post('/api/chat', { 
        messages: messagesArray,
        conversation_id: conversationId 
    });
};
export default apiClient;