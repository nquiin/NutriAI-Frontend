// file: frontend/src/api/apiClient.js
import axios from 'axios';

// !!! CỰC KỲ QUAN TRỌNG !!!
// Thay 'YOUR_COMPUTER_IP' bằng địa chỉ IP của máy tính đang chạy backend.
// - Windows: Mở cmd, gõ `ipconfig`
// - macOS/Linux: Mở terminal, gõ `ifconfig` hoặc `ip a`
const API_BASE_URL = 'http://192.168.1.6:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getMenuSuggestions = (userData) => {
  console.log('Đang gửi yêu cầu gợi ý với dữ liệu:', userData);
  return apiClient.post('/suggest_ml', userData);
};

export const postChatMessage = (userId, message) => {
  console.log(`Đang gửi tin nhắn: "${message}" cho user: ${userId}`);
  return apiClient.post('/chat', { user_id: userId, message: message });
};

// Bạn có thể thêm các hàm gọi API khác ở đây