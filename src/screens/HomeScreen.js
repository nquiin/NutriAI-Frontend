// file: frontend/src/screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, SafeAreaView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getMenuSuggestions } from '../api/apiClient';
import FoodCard from '../components/FoodCard';

const HomeScreen = ({ navigation }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSuggestions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const userInfo = {
        user_id: "test_user_123", // Thay bằng ID người dùng thật sau này
        goal: 'healthy',
        diet_type: 'any',
        daily_calories: 2000,
      };
      const response = await getMenuSuggestions(userInfo);
      setSuggestions(response.data.suggestions);
    } catch (e) {
      setError("Không thể kết nối tới máy chủ. Vui lòng thử lại.");
      console.error("Lỗi khi lấy gợi ý:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" color="#1e88e5" style={{ marginTop: 50 }} />;
    }
    if (error) {
      return (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <Button title="Thử lại" onPress={fetchSuggestions} />
        </View>
      );
    }
    return (
      <FlatList
        data={suggestions}
        renderItem={({ item }) => <FoodCard food={item} />}
        keyExtractor={(item) => item.food_id.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gợi ý cho hôm nay</Text>
        <TouchableOpacity onPress={fetchSuggestions} style={styles.refreshButton}>
            <Text style={styles.refreshText}>Làm mới</Text>
        </TouchableOpacity>
      </View>
      
      {renderContent()}

      <View style={styles.navigationButtons}>
         <Button title="Tới trang Hồ sơ" onPress={() => navigation.navigate('Profile')} />
         <View style={{width: 20}}/>
         <Button title="Hỏi NutriAI" onPress={() => navigation.navigate('Chat')} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15 },
    title: { fontSize: 24, fontWeight: 'bold' },
    refreshButton: { backgroundColor: '#e0e0e0', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20 },
    refreshText: { color: '#333', fontWeight: '600' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    errorText: { marginBottom: 10, color: 'red' },
    navigationButtons: { flexDirection: 'row', justifyContent: 'center', padding: 10, borderTopWidth: 1, borderTopColor: '#eee' }
});

export default HomeScreen;