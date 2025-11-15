// file: frontend/src/screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Button } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { getTodayLog, getWeeklyHistory } from '../api/apiClient';

const screenWidth = Dimensions.get('window').width;

const HomeScreen = ({ navigation }) => {
  const [dailyLog, setDailyLog] = useState({ total_calories: 0 });
  const [historyData, setHistoryData] = useState({
    labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
    datasets: [{ data: [0, 0, 0, 0, 0, 0, 0] }],
  });

  const fetchData = async () => {
    try {
      const logRes = await getTodayLog();
      setDailyLog(logRes.data);
      
      const historyRes = await getWeeklyHistory();
      // Xử lý dữ liệu trả về từ API để phù hợp với biểu đồ
      const formattedData = {
        labels: historyRes.data.labels, // Ví dụ: ['Day 1', 'Day 2', ...]
        datasets: [{ data: historyRes.data.calories }], // Ví dụ: [1800, 2000, ...]
      };
      setHistoryData(formattedData);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu trang chủ:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  
  // Giả sử có 1 nút để thêm món ăn thủ công
  const handleAddCustomFood = async () => {
    // const food = { name: 'Bánh mì', calories: 250, ... };
    // await logMealToDay(food);
    // fetchData(); // Tải lại dữ liệu sau khi thêm
  };

 return (
  <View style={styles.container}>
    <Text style={styles.header}>Tổng Quan Hôm Nay</Text>

    {/* Phần hiển thị tổng Calo trong ngày */}
    <View style={styles.calorieCircle}>
      <Text style={styles.calorieText}>{Math.round(dailyLog.total_calories)}</Text>
      <Text>kcal</Text>
    </View>
    
    <Text style={styles.header}>Xu Hướng Tiêu Thụ Calo (7 ngày qua)</Text>

    {/* Phần hiển thị biểu đồ */}
    <LineChart
      data={historyData}
      width={screenWidth - 20} // Lấy chiều rộng màn hình trừ đi một chút padding
      height={220}
      chartConfig={chartConfig} // Cấu hình màu sắc và style cho biểu đồ
      bezier // Làm cho đường biểu đồ cong mượt mà
    />

    {/* Nút để người dùng có thể tải lại dữ liệu thủ công */}
    <Button title="Cập nhật dữ liệu" onPress={fetchData} />
  </View>
);
};

const chartConfig = {
  backgroundColor: '#e26a00',
  backgroundGradientFrom: '#fb8c00',
  backgroundGradientTo: '#ffa726',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: { borderRadius: 16 },
};

const styles = StyleSheet.create({ /* ... styles của bạn ... */ });
export default HomeScreen;