import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform, KeyboardAvoidingView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserProfile, ACTIVITY_LEVELS, saveProfile, calculateTargetKcal } from '../utils/userProfile';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Main: undefined;
};

type OnboardingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

export default function OnboardingScreen() {
  const navigation = useNavigation<OnboardingScreenNavigationProp>();
  
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  // Default to sedentary if we don't ask
  const activityLevel = 1.2;

  const handleComplete = async () => {
    if (!age || !height || !weight) {
      Alert.alert('提示', '请填写完整信息');
      return;
    }

    const ageNum = parseInt(age);
    const heightNum = parseInt(height);
    const weightNum = parseInt(weight);

    if (isNaN(ageNum) || isNaN(heightNum) || isNaN(weightNum)) {
      Alert.alert('错误', '请输入有效的数字');
      return;
    }

    // Temporary profile for calculation
    const tempProfile = {
      age: ageNum,
      height: heightNum,
      weight: weightNum,
      gender,
      activityLevel,
      targetKcal: 0
    };

    const targetKcal = calculateTargetKcal(tempProfile);

    const profile: UserProfile = {
      ...tempProfile,
      targetKcal
    };

    try {
      await saveProfile(profile);
      await AsyncStorage.setItem('is_onboarded', 'true');
      
      // Navigate to Main screen and reset history to prevent going back
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    } catch (e) {
      Alert.alert('保存失败', '请稍后重试');
      console.error(e);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>欢迎使用 Open Calories</Text>
      <Text style={styles.subtitle}>为了更准确地为您计算热量需求，请填写以下基本信息</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>年龄 (岁)</Text>
        <TextInput 
          style={styles.input} 
          keyboardType="numeric" 
          value={age} 
          onChangeText={setAge} 
          placeholder="例如: 25"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>性别</Text>
        <View style={styles.radioGroup}>
          <TouchableOpacity 
            style={[styles.radioButton, gender === 'male' && styles.radioButtonSelected]} 
            onPress={() => setGender('male')}
          >
            <Text style={[styles.radioText, gender === 'male' && styles.radioTextSelected]}>男</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.radioButton, gender === 'female' && styles.radioButtonSelected]} 
            onPress={() => setGender('female')}
          >
            <Text style={[styles.radioText, gender === 'female' && styles.radioTextSelected]}>女</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>身高 (cm)</Text>
        <TextInput 
          style={styles.input} 
          keyboardType="numeric" 
          value={height} 
          onChangeText={setHeight} 
          placeholder="例如: 175"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>体重 (kg)</Text>
        <TextInput 
          style={styles.input} 
          keyboardType="numeric" 
          value={weight} 
          onChangeText={setWeight} 
          placeholder="例如: 65"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleComplete}>
        <Text style={styles.buttonText}>开始使用</Text>
      </TouchableOpacity>
    </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 24,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  radioButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  radioButtonSelected: {
    borderColor: '#FF5722',
    backgroundColor: '#FFF5F2',
  },
  radioText: {
    fontSize: 16,
    color: '#666',
  },
  radioTextSelected: {
    color: '#FF5722',
    fontWeight: '600',
  },
  activityOption: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
  },
  activityOptionSelected: {
    borderColor: '#FF5722',
    backgroundColor: '#FFF5F2',
  },
  activityText: {
    fontSize: 16,
    color: '#666',
  },
  activityTextSelected: {
    color: '#FF5722',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#FF5722',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#FF5722',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
