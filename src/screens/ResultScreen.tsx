import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import { RootStackParamList } from '../../App';
import { addMeal } from '../db/database';
import { FOOD_DATABASE, calculateCalories, getAllCategories } from '../data/foods';
import { CookingOption, COOKING_OPTIONS } from '../types';

type ResultScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Result'>;
type ResultScreenRouteProp = RouteProp<RootStackParamList, 'Result'>;

interface Props {
  navigation: ResultScreenNavigationProp;
  route: ResultScreenRouteProp;
}

export default function ResultScreen({ navigation, route }: Props) {
  const { imageUri } = route.params;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState('');
  const [weight, setWeight] = useState('200');
  const [selectedCooking, setSelectedCooking] = useState<CookingOption>(COOKING_OPTIONS[0]);
  const [showFoodList, setShowFoodList] = useState(false);

  const categories = getAllCategories();

  const filteredFoods = useMemo(() => {
    if (!searchQuery && !selectedFood) return [];
    return FOOD_DATABASE.filter(food =>
      food.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, selectedFood]);

  const calories = useMemo(() => {
    if (!selectedFood || !weight) return 0;
    return calculateCalories(
      selectedFood,
      parseInt(weight) || 0,
      selectedCooking.multiplier
    );
  }, [selectedFood, weight, selectedCooking]);

  const handleFoodSelect = (foodName: string) => {
    setSelectedFood(foodName);
    setSearchQuery(foodName);
    setShowFoodList(false);
  };

  const handleWeightChange = (text: string) => {
    const num = text.replace(/[^0-9]/g, '');
    setWeight(num);
  };

  const adjustWeight = (delta: number) => {
    const currentWeight = parseInt(weight) || 0;
    const newWeight = Math.max(0, currentWeight + delta);
    setWeight(newWeight.toString());
  };

  const handleSave = async () => {
    if (!selectedFood) {
      Toast.show({
        type: 'error',
        text1: '请选择食物',
        text2: '需要先选择一种食物类型',
      });
      return;
    }

    try {
      await addMeal(
        selectedFood,
        parseInt(weight) || 0,
        selectedCooking.label,
        calories,
        imageUri
      );

      Toast.show({
        type: 'success',
        text1: '已记录',
        text2: `${selectedFood} ${weight}g = ${calories} kcal`,
      });

      navigation.navigate('Camera');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: '保存失败',
        text2: error instanceof Error ? error.message : '未知错误',
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUri }} style={styles.image} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>食物类型</Text>
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="搜索食物..."
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              setShowFoodList(true);
              if (text === '') setSelectedFood('');
            }}
            onFocus={() => setShowFoodList(true)}
          />
          {selectedFood && (
            <TouchableOpacity onPress={() => { setSelectedFood(''); setSearchQuery(''); }}>
              <MaterialIcons name="close" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        {showFoodList && filteredFoods.length > 0 && (
          <View style={styles.foodList}>
            {categories.map(category => {
              const categoryFoods = filteredFoods.filter(f => f.category === category);
              if (categoryFoods.length === 0) return null;
              return (
                <View key={category}>
                  <Text style={styles.categoryLabel}>{category}</Text>
                  {categoryFoods.map(food => (
                    <TouchableOpacity
                      key={food.name}
                      style={styles.foodItem}
                      onPress={() => handleFoodSelect(food.name)}
                    >
                      <Text style={styles.foodName}>{food.name}</Text>
                      <Text style={styles.foodCalories}>{food.kcalPer100g} kcal/100g</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              );
            })}
          </View>
        )}

        {selectedFood && (
          <View style={styles.selectedFoodContainer}>
            <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
            <Text style={styles.selectedFoodText}>{selectedFood}</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>重量 (克)</Text>
        <View style={styles.weightContainer}>
          <TouchableOpacity 
            style={styles.weightButton} 
            onPress={() => adjustWeight(-10)}
          >
            <MaterialIcons name="remove" size={24} color="#666" />
          </TouchableOpacity>
          
          <View style={styles.weightInputContainer}>
            <TextInput
              style={styles.weightInput}
              keyboardType="numeric"
              value={weight}
              onChangeText={handleWeightChange}
              maxLength={4}
            />
            <Text style={styles.weightUnit}>g</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.weightButton} 
            onPress={() => adjustWeight(10)}
          >
            <MaterialIcons name="add" size={24} color="#666" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.quickWeights}>
          {[100, 150, 200, 250, 300].map(w => (
            <TouchableOpacity
              key={w}
              style={[styles.quickWeightButton, weight === w.toString() && styles.quickWeightActive]}
              onPress={() => setWeight(w.toString())}
            >
              <Text style={[styles.quickWeightText, weight === w.toString() && styles.quickWeightTextActive]}>
                {w}g
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>烹饪方式</Text>
        <View style={styles.cookingContainer}>
          {COOKING_OPTIONS.map(option => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.cookingButton,
                selectedCooking.value === option.value && styles.cookingButtonActive
              ]}
              onPress={() => setSelectedCooking(option)}
            >
              <Text style={[
                styles.cookingText,
                selectedCooking.value === option.value && styles.cookingTextActive
              ]}>
                {option.label}
              </Text>
              <Text style={[
                styles.cookingMultiplier,
                selectedCooking.value === option.value && styles.cookingMultiplierActive
              ]}>
                ×{option.multiplier}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.resultSection}>
        <Text style={styles.resultLabel}>预计热量</Text>
        <View style={styles.caloriesContainer}>
          <Text style={styles.caloriesValue}>{calories}</Text>
          <Text style={styles.caloriesUnit}>kcal</Text>
        </View>
        {selectedFood && (
          <Text style={styles.caloriesFormula}>
            {weight}g × {FOOD_DATABASE.find(f => f.name === selectedFood)?.kcalPer100g}kcal/100g × {selectedCooking.multiplier}
          </Text>
        )}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <MaterialIcons name="save" size={24} color="#fff" />
        <Text style={styles.saveButtonText}>保存记录</Text>
      </TouchableOpacity>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  imageContainer: {
    height: 240,
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  foodList: {
    marginTop: 8,
    maxHeight: 200,
    backgroundColor: '#fafafa',
    borderRadius: 8,
    padding: 8,
  },
  categoryLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  foodName: {
    fontSize: 15,
    color: '#333',
  },
  foodCalories: {
    fontSize: 13,
    color: '#666',
  },
  selectedFoodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    padding: 12,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
  },
  selectedFoodText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
  },
  weightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weightButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  weightInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  weightInput: {
    width: 80,
    height: 56,
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  weightUnit: {
    fontSize: 20,
    color: '#666',
    marginLeft: 8,
  },
  quickWeights: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  quickWeightButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
  },
  quickWeightActive: {
    backgroundColor: '#4CAF50',
  },
  quickWeightText: {
    fontSize: 14,
    color: '#666',
  },
  quickWeightTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  cookingContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cookingButton: {
    flex: 1,
    minWidth: 80,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  cookingButtonActive: {
    backgroundColor: '#FF9800',
  },
  cookingText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  cookingTextActive: {
    color: '#fff',
  },
  cookingMultiplier: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  cookingMultiplierActive: {
    color: 'rgba(255,255,255,0.8)',
  },
  resultSection: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  caloriesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  caloriesValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF5722',
  },
  caloriesUnit: {
    fontSize: 20,
    color: '#FF5722',
    marginLeft: 4,
    marginBottom: 8,
  },
  caloriesFormula: {
    fontSize: 13,
    color: '#999',
    marginTop: 8,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 16,
    borderRadius: 12,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  bottomPadding: {
    height: 32,
  },
});
