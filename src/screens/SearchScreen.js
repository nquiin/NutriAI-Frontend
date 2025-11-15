// file: frontend/src/screens/SearchScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { searchFoods } from '../api/apiClient';

// Component con để hiển thị từng kết quả tìm kiếm (chi tiết hơn)
const FoodResultItem = ({ item }) => (
    <View style={styles.resultItem}>
        <View style={styles.resultHeader}>
            <Text style={styles.resultName}>{item.food_name}</Text>
            {item.is_vegetarian && <Text style={styles.vegetarianLabel}>(Chay)</Text>}
        </View>
        <Text style={styles.resultCategory}>{item.category}</Text>
        <Text style={styles.resultMacros}>Protein: {item.protein}g • Fat: {item.fat}g • Carbs: {item.carbs}g</Text>
        <Text style={styles.resultCalories}>~{Math.round(item.calories)} kcal</Text>
    </View>
);

const SearchScreen = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false); // Để biết người dùng đã tìm kiếm lần nào chưa

    const handleSearch = async () => {
        if (query.trim().length < 2) {
            Alert.alert('Lỗi', 'Vui lòng nhập ít nhất 2 ký tự để tìm kiếm.');
            return;
        }
        setIsLoading(true);
        setHasSearched(true);
        try {
            const response = await searchFoods(query.trim());
            setResults(response.data);
        } catch (error) {
            console.error("Lỗi tìm kiếm:", error.response?.data || error.message);
            Alert.alert('Lỗi', 'Không thể thực hiện tìm kiếm. Vui lòng thử lại.');
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Component để hiển thị khi không có kết quả hoặc chưa tìm kiếm
    const renderEmptyState = () => {
        if (isLoading) {
            return <ActivityIndicator size="large" color="#2c3e50" style={{ marginTop: 50 }} />;
        }
        if (hasSearched) {
            return <Text style={styles.emptyText}>Không tìm thấy món ăn nào phù hợp.</Text>;
        }
        return <Text style={styles.emptyText}>Nhập tên món ăn bạn muốn tìm.</Text>;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tìm Kiếm Món Ăn</Text>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Ví dụ: Phở bò, Gà luộc..."
                    value={query}
                    onChangeText={setQuery}
                    onSubmitEditing={handleSearch} // Cho phép tìm bằng phím "Enter" trên bàn phím
                />
                <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                    <Ionicons name="search" size={24} color="white" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={results}
                renderItem={({ item }) => <FoodResultItem item={item} />}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.list}
                ListEmptyComponent={renderEmptyState}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5', padding: 15, paddingTop: 55},
    title: { fontSize: 26, fontWeight: 'bold', color: '#2c3e50', marginBottom: 20, textAlign: 'center' },
    searchContainer: { flexDirection: 'row', marginBottom: 20 },
    input: {
        flex: 1,
        height: 50,
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        borderRadius: 8,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#bdc3c7',
    },
    searchButton: {
        width: 50,
        height: 50,
        backgroundColor: '#191970',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    list: { paddingBottom: 20 },
    emptyText: { fontSize: 16, color: '#7f8c8d', textAlign: 'center', marginTop: 50 },
    resultItem: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    resultHeader: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
    resultName: { fontSize: 18, fontWeight: '600', color: '#2c3e50', marginRight: 8 },
    vegetarianLabel: { fontSize: 14, fontStyle: 'italic', color: '#191970' },
    resultCategory: { fontSize: 14, color: '#191970', fontWeight: '500', marginVertical: 4 },
    resultMacros: { fontSize: 12, color: '#95a5a6', fontStyle: 'italic' },
    resultCalories: { fontSize: 14, color: '#7f8c8d', marginTop: 4 },
});

export default SearchScreen;