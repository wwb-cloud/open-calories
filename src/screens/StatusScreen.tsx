import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { 
  UserProfile, 
  Gender, 
  saveProfile, 
  getProfile, 
  calculateBMR, 
  calculateTargetKcal, 
  ACTIVITY_LEVELS 
} from '../utils/userProfile';
import Toast from 'react-native-toast-message';

export default function StatusScreen() {
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [gender, setGender] = useState<Gender>('male');
  // Default to sedentary if we don't ask
  const activityLevel = 1.2;
  const [bmr, setBmr] = useState<number | null>(null);
  const [targetKcal, setTargetKcal] = useState<number | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const profile = await getProfile();
    if (profile) {
      setAge(profile.age.toString());
      setWeight(profile.weight.toString());
      setHeight(profile.height.toString());
      setGender(profile.gender);
      
      const bmrVal = calculateBMR(profile);
      setBmr(bmrVal);
      setTargetKcal(calculateTargetKcal(profile));
    }
  };


  const handleSave = async () => {
    if (!age || !weight || !height) {
      Toast.show({
        type: 'error',
        text1: '请填写完整信息',
      });
      return;
    }

    const ageNum = parseInt(age);
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);

    if (isNaN(ageNum) || isNaN(weightNum) || isNaN(heightNum)) {
      Toast.show({
        type: 'error',
        text1: '请输入有效的数字',
      });
      return;
    }

    // Temporary object to calculate target
    const tempProfile = {
      age: ageNum,
      weight: weightNum,
      height: heightNum,
      gender,
      activityLevel,
      targetKcal: 0
    };
    
    const newTargetKcal = calculateTargetKcal(tempProfile);

    const profile: UserProfile = {
      ...tempProfile,
      targetKcal: newTargetKcal
    };

    try {
      await saveProfile(profile);
      const newBmr = calculateBMR(profile);
      setBmr(newBmr);
      setTargetKcal(newTargetKcal);
      
      Toast.show({
        type: 'success',
        text1: '保存成功',
        text2: `每日目标热量: ${newTargetKcal} kcal`,
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: '保存失败',
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>个人状态</Text>
          
          <View style={styles.card}>
            <Text style={styles.label}>性别</Text>
            <View style={styles.genderContainer}>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  gender === 'male' && styles.genderButtonSelected,
                  { marginRight: 10 }
                ]}
                onPress={() => setGender('male')}
              >
                <MaterialIcons 
                  name="male" 
                  size={24} 
                  color={gender === 'male' ? '#fff' : '#666'} 
                />
                <Text style={[
                  styles.genderText,
                  gender === 'male' && styles.genderTextSelected
                ]}>男</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  gender === 'female' && styles.genderButtonSelected
                ]}
                onPress={() => setGender('female')}
              >
                <MaterialIcons 
                  name="female" 
                  size={24} 
                  color={gender === 'female' ? '#fff' : '#666'} 
                />
                <Text style={[
                  styles.genderText,
                  gender === 'female' && styles.genderTextSelected
                ]}>女</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>年龄 (岁)</Text>
            <TextInput
              style={styles.input}
              value={age}
              onChangeText={setAge}
              keyboardType="number-pad"
              placeholder="例如: 25"
            />

            <Text style={styles.label}>身高 (cm)</Text>
            <TextInput
              style={styles.input}
              value={height}
              onChangeText={setHeight}
              keyboardType="numeric"
              placeholder="例如: 175"
            />

            <Text style={styles.label}>体重 (kg)</Text>
            <TextInput
              style={styles.input}
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
              placeholder="例如: 65"
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>保存并计算</Text>
            </TouchableOpacity>
          </View>

          {bmr !== null && (
            <View style={styles.resultCard}>
              <View style={styles.resultRow}>
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>基础代谢 (BMR)</Text>
                  <View style={styles.bmrContainer}>
                    <Text style={styles.bmrValue}>{bmr}</Text>
                    <Text style={styles.bmrUnit}>kcal</Text>
                  </View>
                </View>
              </View>
              <Text style={styles.bmrDesc}>
                根据您的身体数据计算得出。
              </Text>
            </View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  genderContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  genderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#eee',
  },
  genderButtonSelected: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  genderText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  genderTextSelected: {
    color: '#fff',
  },
  activityContainer: {
    marginTop: 4,
  },
  activityOption: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    marginBottom: 6,
    backgroundColor: '#f9f9f9',
  },
  activityOptionSelected: {
    borderColor: '#FF5722',
    backgroundColor: '#FFF5F2',
  },
  activityText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  activityTextSelected: {
    color: '#FF5722',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  resultItem: {
    alignItems: 'center',
  },
  separator: {
    width: 1,
    backgroundColor: '#eee',
    marginHorizontal: 10,
  },
  resultLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  bmrContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  bmrValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF5722',
  },
  bmrUnit: {
    fontSize: 12,
    color: '#FF5722',
    marginLeft: 2,
    marginBottom: 4,
  },
  bmrDesc: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
});

