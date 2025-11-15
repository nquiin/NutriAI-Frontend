// file: frontend/src/screens/MealPlanScreen.js
import React, { useState, useEffect,useCallback } from 'react';
import { View, Text, SectionList, Button, StyleSheet, Alert, ActivityIndicator, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { getMenuSuggestions, getSingleReplacementMeal, logMeal } from '../api/apiClient';

// === Component hiển thị món ăn ===
const MealItem = ({ item, onReplace, onLog }) => {
    // Component con này không thay đổi
    return (
        <View style={styles.mealItem}>
            <View style={styles.mealDetails}>
                <View style={styles.mealHeader}>
                    <Text style={styles.mealName}>{item.food_name}</Text>
                    {item.is_vegetarian && <Text style={styles.vegetarianLabel}>(Chay)</Text>}
                </View>
                <Text style={styles.namegoryText}>{item.namegory}</Text>
                <Text style={styles.macroNutrients}>Protein: {item.protein}g • Fat: {item.fat}g • Carbs: {item.carbs}g</Text>
                <Text style={styles.mealCalories}>~{Math.round(item.calories)} kcal</Text>
            </View>
            <View style={styles.buttonGroup}>
                <TouchableOpacity style={styles.replaceButton} onPress={() => onReplace(item)}>
                    <Text style={styles.buttonText}>Đổi</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.logButton} onPress={() => onLog(item)}>
                    <Text style={styles.buttonText}>Lưu</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

// === Component chọn chế độ xem (Ngày / Tuần) ===
const PlanTypeSwitcher = ({ selectedType, onSelectType }) => {
    // Component con này không thay đổi
    return (
        <View style={styles.switcherContainer}>
            <TouchableOpacity style={[styles.switcherButton, selectedType === 'day' && styles.switcherButtonActive]} onPress={() => onSelectType('day')}>
                <Text style={[styles.switcherText, selectedType === 'day' && styles.switcherTextActive]}>Theo Ngày</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.switcherButton, selectedType === 'week' && styles.switcherButtonActive]} onPress={() => onSelectType('week')}>
                <Text style={[styles.switcherText, selectedType === 'week' && styles.switcherTextActive]}>Theo Tuần</Text>
            </TouchableOpacity>
        </View>
    );
};


const MealPlanScreen = () => {
    const [planType, setPlanType] = useState('day');
    const [meals, setMeals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dailyGoalCalories, setDailyGoalCalories] = useState(0);

    const [isModalVisible, setModalVisible] = useState(false);
    const [replacementOptions, setReplacementOptions] = useState([]);
    const [itemToReplaceInfo, setItemToReplaceInfo] = useState(null);

    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const fetchPlanData = useCallback(async () => {
        setIsLoading(true);
        setMeals([]); 
        try {
            if (planType === 'week') {
                Alert.alert('Xin chờ', 'Đang tạo thực đơn đa dạng cho cả tuần...');
                const weeklyPlan = [];
                let totalCalories = 0;
                let allMealIds = [];
                for (let i = 0; i < 7; i++) {
                    const response = await getMenuSuggestions({ exclude_ids: allMealIds });
                    if (!response.data?.suggestions || response.data.suggestions.length < 3) {
                      throw new Error(`Không đủ món ăn cho Ngày ${i + 1}`);
                    }
                    const dailyMeals = response.data.suggestions || [];
                    weeklyPlan.push({ title: `Ngày ${i + 1}`, data: dailyMeals });
                    dailyMeals.forEach(meal => allMealIds.push(meal.id));
                    totalCalories += response.data.calculated_daily_calories;
                }
                setMeals(weeklyPlan);
                setDailyGoalCalories(Math.round(totalCalories / 7));
            } else { // 'day'
                const response = await getMenuSuggestions();
                if (response.data?.is_profile_complete === false) {
                    Alert.alert("Chào mừng!", "Vui lòng cập nhật thông tin để nhận gợi ý.", [{ text: "OK", onPress: () => navigation.navigate('Profile') }]);
                    setMeals([]);
                } else if (response.data?.suggestions) {
                    setMeals([{ title: 'Thực đơn hôm nay', data: response.data.suggestions.slice(0, 3) }]);
                    setDailyGoalCalories(Math.round(response.data.calculated_daily_calories));
                }
            }
        } catch (error) {
            console.error("Lỗi tạo thực đơn:", error.response?.data || error.message);
            Alert.alert('Lỗi', 'Không thể tạo thực đơn. Vui lòng thử lại.');
            setMeals([]);
        } finally {
            setIsLoading(false);
        }
    }, [planType, navigation]);


    useEffect(() => { if (isFocused) fetchPlanData(); }, [isFocused, planType]);

    const handleOpenReplacementModal = async (item, index, section) => {
        try {
            const exclude_ids = section.data.map(meal => meal.id);
            const response = await getSingleReplacementMeal({ meal_to_replace: item, exclude_ids });
            if (response.data?.suggestions) {
                setReplacementOptions(response.data.suggestions);
                setItemToReplaceInfo({ sectionTitle: section.title, index: index });
                setModalVisible(true);
            } else {
                Alert.alert('Lỗi', 'Không tìm được món ăn thay thế phù hợp.');
            }
        } catch (error) {
            Alert.alert('Lỗi', 'Không tìm được món ăn thay thế phù hợp.');
        }
    };
    
    const handleSelectReplacement = (newMeal) => {
        if (!itemToReplaceInfo || !newMeal) return; // Thêm kiểm tra newMeal
        const { sectionTitle, index } = itemToReplaceInfo;
        const updatedPlan = meals.map(day => {
            if (day.title === sectionTitle) {
                const newDayData = [...day.data];
                newDayData[index] = newMeal;
                return { ...day, data: newDayData };
            }
            return day;
        });
        setMeals(updatedPlan);
        setModalVisible(false);
        setItemToReplaceInfo(null);
    };

    const handleLogMeal = async (mealToLog) => {
        try {
            await logMeal(mealToLog);
            Alert.alert("Thành công", `Đã lưu món "${mealToLog.name}" vào lịch sử.`);
        } catch (error) {
            Alert.alert("Lỗi", "Không thể lưu bữa ăn.");
        }
    };

    // <<< SỬA LỖI: `keyExtractor` an toàn hơn >>>
    const getKey = (item, index) => {
        // Nếu item và item.id tồn tại, dùng nó. Nếu không, dùng index.
        // Điều này ngăn chặn lỗi "toString of undefined".
        return item?.id ? item.id.toString() : index.toString();
    };

    if (isLoading) {
        return <View style={styles.centered}><ActivityIndicator size="large" color="#191970" /><Text style={styles.loadingText}>Đang tạo thực đơn...</Text></View>;
    }

    if (!isLoading && meals.length === 0) {
        return (
            <View style={styles.container}>
                <PlanTypeSwitcher selectedType={planType} onSelectType={setPlanType} />
                <View style={styles.centered}>
                    <Text style={styles.emptyText}>Không có thực đơn. Vui lòng cập nhật thông tin hoặc tạo mới.</Text>
                    <Button title="Tạo thực đơn ngay" onPress={fetchPlanData} />
                    <View style={{marginTop: 10}} />
                    <Button title="Đến trang Profile" onPress={() => navigation.navigate('Profile')} />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <PlanTypeSwitcher selectedType={planType} onSelectType={setPlanType} />
            <View style={styles.header}>
                <Text style={styles.title}>Thực Đơn Gợi Ý</Text>
                <Text style={styles.calorieGoal}>Mục tiêu trung bình: ~{dailyGoalCalories} kcal/ngày</Text>
            </View>
            <SectionList
                sections={meals}
                keyExtractor={getKey}
                renderItem={({ item, index, section }) => {
                    // Thêm một lớp bảo vệ nữa: không render gì cả nếu item không hợp lệ
                    if (!item) return null; 
                    return (
                        <MealItem 
                            item={item} 
                            onReplace={(itemToReplace) => handleOpenReplacementModal(itemToReplace, index, section)}
                            onLog={handleLogMeal}
                        />
                    );
                }}
                renderSectionHeader={({ section: { title } }) => (<Text style={styles.sectionHeader}>{title}</Text>)}
                contentContainerStyle={styles.list}
                ListFooterComponent={<View style={{ marginVertical: 20 }}><Button title="Tạo thực đơn mới" onPress={fetchPlanData} /></View>}
            />
            <Modal visible={isModalVisible} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Chọn món thay thế</Text>
                        <ScrollView>
                            {replacementOptions.map((option, idx) => {
                                if (!option) return null; // Bảo vệ
                                return (
                                    <TouchableOpacity key={idx} style={styles.optionItem} onPress={() => handleSelectReplacement(option)}>
                                        <View style={styles.mealHeader}><Text style={styles.optionName}>{option.food_name}</Text>{option.is_vegetarian && <Text style={styles.vegetarianLabelModal}>(Chay)</Text>}</View>
                                        <Text style={styles.optionname}>{option.name}</Text>
                                        <Text style={styles.optionDetails}>P:{option.protein}g • F:{option.fat}g • C:{option.carbs}g</Text>
                                        <Text style={styles.optionDetails}>~{Math.round(option.calories)} kcal</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                        <Button title="Đóng" onPress={() => setModalVisible(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

// === STYLE ===
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5', paddingHorizontal: 15, paddingTop: 55 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    loadingText: { marginTop: 10, fontSize: 16, color: '#34495e' },
    emptyText: { fontSize: 18, textAlign: 'center', marginBottom: 20, color: '#7f8c8d' },
    switcherContainer: { flexDirection: 'row', backgroundColor: '#e0e0e0', borderRadius: 8, padding: 4, marginBottom: 15 },
    switcherButton: { flex: 1, paddingVertical: 10, borderRadius: 6, alignItems: 'center' },
    switcherButtonActive: { backgroundColor: '#ffffff', elevation: 2 },
    switcherText: { fontSize: 16, color: '#7f8c8d', fontWeight: '600' },
    switcherTextActive: { color: '#191970' },
    header: { marginBottom: 10, alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', color: '#2c3e50' },
    calorieGoal: { fontSize: 16, color: '#191970', marginTop: 5, fontWeight: 'bold' },
    list: { paddingBottom: 20 },
    sectionHeader: { fontSize: 20, fontWeight: 'bold', color: '#34495e', backgroundColor: '#f5f5f5', paddingVertical: 10, paddingTop: 20 },
    mealItem: { backgroundColor: '#fff', borderRadius: 10, padding: 15, marginBottom: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', elevation: 5 },
    mealDetails: { flex: 1, marginRight: 10 },
    mealHeader: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
    mealName: { fontSize: 18, fontWeight: '600', color: '#2c3e50', marginRight: 8 },
    vegetarianLabel: { fontSize: 14, fontStyle: 'italic', color: '#27ae60' },
    categoryText: { fontSize: 14, color: '#8e44ad', fontWeight: '500', marginVertical: 4 },
    macroNutrients: { fontSize: 12, color: '#95a5a6', fontStyle: 'italic' },
    mealCalories: { fontSize: 14, color: '#7f8c8d', marginTop: 4 },
    modalContainer: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { backgroundColor: 'white', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '60%' },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
    optionItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ecf0f1' },
    optionName: { fontSize: 16, fontWeight: '600', marginRight: 8 },
    optionCategory: { fontSize: 13, color: '#8e44ad', fontWeight: '500', marginVertical: 2 },
    optionDetails: { fontSize: 14, color: '#7f8c8d', marginTop: 4 },
    vegetarianLabelModal: { fontSize: 12, fontStyle: 'italic', color: '#27ae60' },
    buttonGroup: { flexDirection: 'column', justifyContent: 'space-around' },
    replaceButton: { backgroundColor: '#e74c3c', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, marginBottom: 5, alignItems: 'center' },
    logButton: { backgroundColor: '#27ae60', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, alignItems: 'center' },
    buttonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 },
});

export default MealPlanScreen;