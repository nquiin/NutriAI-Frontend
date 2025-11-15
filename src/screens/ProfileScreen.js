// file: frontend/src/screens/ProfileScreen.js
import React, { useState, useEffect, useContext } from 'react';
import {
  View, Text, TouchableOpacity, TextInput,
  StyleSheet, Alert, ActivityIndicator, ScrollView
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { getUserProfile, updateUserProfile } from '../api/apiClient';
import { AuthContext } from '../context/AuthContext';

const COLOR_PRIMARY = "#191970"; // màu chủ đạo

const pickerPlaceholder = {
  label: 'Chọn một mục...',
  value: null,
  color: '#aaa',
};

const ProfileScreen = () => {
  const { logout } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true); 
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [profile, setProfile] = useState({
    name: '', age: '', gender: 'female',
    height: '', weight: '',
    activity_level: 'lightly_active',
    goal: 'maintain_weight',
    diet_type: 'any',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await getUserProfile();
        if (response.data) {
          const fetchedProfile = {
            ...response.data,
            age: response.data.age ? String(response.data.age) : '',
            height: response.data.height ? String(response.data.height) : '',
            weight: response.data.weight ? String(response.data.weight) : '',
          };
          setProfile(fetchedProfile);
        }
      } catch (error) {
        Alert.alert('Lỗi', 'Không thể tải thông tin cá nhân.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    if (!profile.name || !profile.age || !profile.height || !profile.weight) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ dữ liệu.");
      return;
    }

    setIsUpdating(true);
    try {
      const profileToUpdate = {
        ...profile,
        age: parseInt(profile.age, 10),
        height: parseFloat(profile.height),
        weight: parseFloat(profile.weight),
      };
      await updateUserProfile(profileToUpdate);
      Alert.alert("Thành công", "Cập nhật thành công!");
    } catch {
      Alert.alert("Lỗi", "Không thể cập nhật.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLOR_PRIMARY} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* HEADER */}
      <Text style={styles.header}>Thông Tin Cá Nhân</Text>

      {/* INPUT */}
      <Text style={styles.label}>Họ và tên</Text>
      <TextInput
        style={styles.input}
        value={profile.name}
        onChangeText={(text) => setProfile({ ...profile, name: text })}
        placeholder="Nhập họ và tên"
      />

      <Text style={styles.label}>Tuổi</Text>
      <TextInput
        style={styles.input}
        value={profile.age}
        onChangeText={(text) => setProfile({ ...profile, age: text })}
        keyboardType="numeric"
        placeholder="Ví dụ: 25"
      />

      <Text style={styles.label}>Chiều cao (cm)</Text>
      <TextInput
        style={styles.input}
        value={profile.height}
        onChangeText={(text) => setProfile({ ...profile, height: text })}
        keyboardType="numeric"
        placeholder="Ví dụ: 170"
      />

      <Text style={styles.label}>Cân nặng (kg)</Text>
      <TextInput
        style={styles.input}
        value={profile.weight}
        onChangeText={(text) => setProfile({ ...profile, weight: text })}
        keyboardType="numeric"
        placeholder="Ví dụ: 65"
      />

      {/* PICKER đẹp hơn */}
      <Text style={styles.label}>Giới tính</Text>
      <View style={styles.pickerBox}>
        <RNPickerSelect
          value={profile.gender}
          onValueChange={(v) => setProfile({ ...profile, gender: v })}
          items={[
            { label: "Nam", value: "male" },
            { label: "Nữ", value: "female" }
          ]}
          placeholder={pickerPlaceholder}
          style={pickerStyles}
        />
      </View>

      <Text style={styles.label}>Mức độ hoạt động</Text>
      <View style={styles.pickerBox}>
        <RNPickerSelect
          value={profile.activity_level}
          onValueChange={(v) => setProfile({ ...profile, activity_level: v })}
          items={[
            { label: 'Ít vận động', value: 'sedentary' },
            { label: 'Vận động nhẹ', value: 'lightly_active' },
            { label: 'Vận động vừa', value: 'moderately_active' },
            { label: 'Vận động nhiều', value: 'very_active' },
            { label: 'Vận động rất nhiều', value: 'extra_active' },
          ]}
          placeholder={pickerPlaceholder}
          style={pickerStyles}
        />
      </View>

      <Text style={styles.label}>Mục tiêu</Text>
      <View style={styles.pickerBox}>
        <RNPickerSelect
          value={profile.goal}
          onValueChange={(v) => setProfile({ ...profile, goal: v })}
          items={[
            { label: 'Giảm cân', value: 'lose_weight' },
            { label: 'Giữ cân', value: 'maintain_weight' },
            { label: 'Tăng cân', value: 'gain_weight' },
          ]}
          placeholder={pickerPlaceholder}
          style={pickerStyles}
        />
      </View>

      <Text style={styles.label}>Chế độ ăn</Text>
      <View style={styles.pickerBox}>
        <RNPickerSelect
          value={profile.diet_type}
          onValueChange={(v) => setProfile({ ...profile, diet_type: v })}
          items={[
            { label: 'Ăn chay', value: 'vegetarian' },
            { label: 'Bất kỳ', value: 'any' },
          ]}
          placeholder={pickerPlaceholder}
          style={pickerStyles}
        />
      </View>

      {/* BUTTON UPDATE */}
      <TouchableOpacity style={styles.btnPrimary} onPress={handleUpdate}>
        <Text style={styles.btnPrimaryText}>
          {isUpdating ? "Đang cập nhật..." : "Cập Nhật"}
        </Text>
      </TouchableOpacity>

      {/* BUTTON LOGOUT */}
      <TouchableOpacity style={styles.btnDanger} onPress={logout}>
        <Text style={styles.btnDangerText}>Đăng Xuất</Text>
      </TouchableOpacity>

    </ScrollView>
  );
};

// ================== STYLE ====================
const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#F2F2F8",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLOR_PRIMARY,
    marginBottom: 25,
    textAlign: "center"
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 18,
    fontSize: 16,
  },
  pickerBox: {
    backgroundColor: "#fff",
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    paddingLeft: 10,
    marginBottom: 18,
  },
  btnPrimary: {
    backgroundColor: COLOR_PRIMARY,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10
  },
  btnPrimaryText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600"
  },
  btnDanger: {
    backgroundColor: "#e63946",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15
  },
  btnDangerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600"
  },
});

// Style cho RNPickerSelect
const pickerStyles = {
  inputAndroid: {
    fontSize: 16,
    color: "black",
    paddingHorizontal: 10,
  },
  inputIOS: {
    fontSize: 16,
    color: "black",
    paddingHorizontal: 10,
  }
};

export default ProfileScreen;
