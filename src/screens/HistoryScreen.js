// file: frontend/src/screens/HistoryScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, SectionList, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { getMealHistory } from '../api/apiClient';

// Tái sử dụng PlanTypeSwitcher từ MealPlanScreen bằng cách định nghĩa lại
const PlanTypeSwitcher = ({ selectedType, onSelectType }) => (
    <View style={styles.switcherContainer}>
        <TouchableOpacity style={[styles.switcherButton, selectedType === 'day' && styles.switcherButtonActive]} onPress={() => onSelectType('day')}>
            <Text style={[styles.switcherText, selectedType === 'day' && styles.switcherTextActive]}>Hôm Nay</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.switcherButton, selectedType === 'week' && styles.switcherButtonActive]} onPress={() => onSelectType('week')}>
            <Text style={[styles.switcherText, selectedType === 'week' && styles.switcherTextActive]}>Tuần Này</Text>
        </TouchableOpacity>
    </View>
);

const HistoryItem = ({ item }) => (
    <View style={styles.mealItem}>
        <View style={styles.mealDetails}>
            <Text style={styles.mealName}>{item.food_details?.name || 'Tên không xác định'}</Text>
            <Text style={styles.macroNutrients}>
                P: {item.food_details?.protein || 0}g • F: {item.food_details?.fat || 0}g • C: {item.food_details?.carbs || 0}g
            </Text>
            <Text style={styles.mealCalories}>~{Math.round(item.food_details?.calories || 0)} kcal</Text>
        </View>
        <Text style={styles.logTime}>{new Date(item.logged_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</Text>
    </View>
);

const HistoryScreen = () => {
    const [history, setHistory] = useState([]);
    const [range, setRange] = useState('day');
    const [isLoading, setIsLoading] = useState(true);
    const isFocused = useIsFocused();

    useEffect(() => {
        const fetchHistory = async () => {
            if (!isFocused) return;
            setIsLoading(true);
            try {
                const response = await getMealHistory(range);
                const groupedData = (response.data || []).reduce((acc, item) => {
                    if (!item || !item.logged_at) return acc; // Bảo vệ
                    const date = new Date(item.logged_at).toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit' });
                    if (!acc[date]) acc[date] = [];
                    acc[date].push(item);
                    return acc;
                }, {});
                const sectionListData = Object.keys(groupedData).map(date => ({ title: date, data: groupedData[date] }));
                setHistory(sectionListData);
            } catch (error) {
                Alert.alert('Lỗi', 'Không thể tải lịch sử bữa ăn.');
                console.error("Lỗi tải lịch sử:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchHistory();
    }, [isFocused, range]);

    // <<< SỬA LỖI: `keyExtractor` an toàn hơn >>>
    const getKey = (item, index) => {
        // Sử dụng một chuỗi duy nhất kết hợp từ nhiều nguồn để đảm bảo không trùng
        const itemId = item?.food_details?.id || 'no-id';
        const timestamp = item?.logged_at || 'no-time';
        return `${itemId}-${timestamp}-${index}`;
    };

    if (isLoading) {
        return <View style={styles.centered}><ActivityIndicator size="large" color="#191970" /></View>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Lịch Sử Bữa Ăn</Text>
            <PlanTypeSwitcher selectedType={range} onSelectType={setRange} />
            <SectionList
                sections={history}
                keyExtractor={getKey}
                renderItem={({ item }) => {
                    if (!item || !item.food_details) return null; // Lớp bảo vệ quan trọng
                    return <HistoryItem item={item} />;
                }}
                renderSectionHeader={({ section: { title } }) => <Text style={styles.sectionHeader}>{title}</Text>}
                ListEmptyComponent={<Text style={styles.emptyText}>Không có dữ liệu trong khoảng thời gian này.</Text>}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
};

// <<< SỬA LỖI 2: Cung cấp đầy đủ style cho màn hình >>>
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5', padding: 15 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { fontSize: 26, fontWeight: 'bold', color: '#2c3e50', marginBottom: 20, textAlign: 'center' },
    switcherContainer: { flexDirection: 'row', backgroundColor: '#e0e0e0', borderRadius: 8, padding: 4, marginBottom: 15 },
    switcherButton: { flex: 1, paddingVertical: 10, borderRadius: 6, alignItems: 'center' },
    switcherButtonActive: { backgroundColor: '#ffffff', elevation: 2 },
    switcherText: { fontSize: 16, color: '#7f8c8d', fontWeight: '600' },
    switcherTextActive: { color: '#3498db' },
    sectionHeader: { fontSize: 18, fontWeight: 'bold', color: '#34495e', paddingVertical: 10, paddingTop: 20, backgroundColor: '#f5f5f5' },
    mealItem: { backgroundColor: '#fff', borderRadius: 10, padding: 15, marginBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', elevation: 3 },
    mealDetails: { flex: 1 },
    mealName: { fontSize: 16, fontWeight: '600', color: '#2c3e50' },
    macroNutrients: { fontSize: 12, color: '#95a5a6', fontStyle: 'italic', marginVertical: 4 },
    mealCalories: { fontSize: 14, color: '#7f8c8d' },
    logTime: { fontSize: 14, fontWeight: '500', color: '#3498db' },
    emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#7f8c8d' },
});

export default HistoryScreen;