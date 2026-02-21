import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';

import { RootStackParamList } from '../../App';
import '../ai/polyfills';
import { TFLiteModule } from '../ai/tflite';
import { COOKING_OPTIONS } from '../types';
import { addMeal, initDatabase } from '../db/database';
import { searchFoods, calculateCalories } from '../data/foods';

type ResultScreenRouteProp = RouteProp<RootStackParamList, 'Result'>;
type ResultScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Result'>;

interface Props {
  route: ResultScreenRouteProp;
  navigation: ResultScreenNavigationProp;
}

export default function ResultScreen({ route, navigation }: Props) {
  const { imageUri } = route.params;

  const [query, setQuery] = useState('');
  const [foodName, setFoodName] = useState('');
  const [weightText, setWeightText] = useState('150');
  const [cooking, setCooking] = useState(COOKING_OPTIONS[0].value);
  const [saving, setSaving] = useState(false);
  const [isClassifying, setIsClassifying] = useState(false);
  const [predictionHint, setPredictionHint] = useState('');

  useEffect(() => {
    initDatabase().catch(() => {
      // Silent init failure; subsequent operations will retry via ensureDatabase.
    });
  }, []);

  useEffect(() => {
    let cancelled = false;

    const runClassification = async () => {
      try {
        setIsClassifying(true);
        setPredictionHint('正在加载本地模型...');

        let tfliteResult: { label: string; confidence: number; matchedFoodName?: string } | null = null;
        let errorMsg = '';
        try {
          console.log('[TFLite] 开始识别, imageUri:', imageUri);
          tfliteResult = await TFLiteModule.predictFood(imageUri);
          console.log('[TFLite] 识别结果:', JSON.stringify(tfliteResult));
        } catch (error) {
          errorMsg = error instanceof Error ? error.message : String(error);
          console.error('[TFLite] 识别出错:', errorMsg);
          tfliteResult = null;
        }

        if (cancelled) return;

        if (tfliteResult?.matchedFoodName) {
          setFoodName(tfliteResult.matchedFoodName);
          setQuery(tfliteResult.matchedFoodName);
          setPredictionHint(
            `本地识别：已识别 ${tfliteResult.label} (${Math.round(tfliteResult.confidence * 100)}%)`
          );
        } else if (tfliteResult?.label) {
          setPredictionHint(
            `本地识别：识别到 ${tfliteResult.label} (${Math.round(tfliteResult.confidence * 100)}%)，请手动选择`
          );
        } else {
          setPredictionHint(errorMsg ? `识别失败: ${errorMsg}` : '未识别到食物，请手动选择');
        }
      } catch (error) {
        if (!cancelled) {
          const msg = error instanceof Error ? error.message : String(error);
          console.error('[TFLite] 顶层错误:', msg);
          setPredictionHint(`识别失败: ${msg}`);
        }
      } finally {
        if (!cancelled) {
          setIsClassifying(false);
        }
      }
    };

    runClassification();

    return () => {
      cancelled = true;
    };
  }, [imageUri]);

  const filteredFoods = useMemo(() => {
    return searchFoods(query).slice(0, 12);
  }, [query]);

  const selectedCooking = useMemo(() => {
    return COOKING_OPTIONS.find(option => option.value === cooking) ?? COOKING_OPTIONS[0];
  }, [cooking]);

  const weight = Number(weightText);
  const kcal = Number.isFinite(weight) && weight > 0
    ? calculateCalories(foodName, weight, selectedCooking.multiplier)
    : 0;

  const onSave = async () => {
    if (!foodName.trim()) {
      Toast.show({ type: 'error', text1: '请选择食物' });
      return;
    }
    if (!Number.isFinite(weight) || weight <= 0) {
      Toast.show({ type: 'error', text1: '请输入有效重量' });
      return;
    }

    try {
      setSaving(true);
      await addMeal(foodName.trim(), Math.round(weight), cooking, kcal, imageUri);
      Toast.show({ type: 'success', text1: '保存成功' });
      navigation.navigate('Main');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: '保存失败',
        text2: error instanceof Error ? error.message : '请稍后重试',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FlatList
        data={filteredFoods}
        keyExtractor={item => item.name}
        ListHeaderComponent={
          <View>
            <Image source={{ uri: imageUri }} style={styles.image} />

            <Text style={styles.sectionTitle}>识别结果（可修改）</Text>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="搜索食物名称"
              style={styles.searchInput}
            />

            <Text style={styles.selectedLabel}>当前食物：{foodName || '待识别/请选择'}</Text>
            {!!predictionHint && (
              <Text style={styles.predictionHint}>
                {isClassifying ? '识别中…' : predictionHint}
              </Text>
            )}

            <View style={styles.weightRow}>
              <Text style={styles.fieldLabel}>重量(g)</Text>
              <TextInput
                value={weightText}
                onChangeText={setWeightText}
                keyboardType="numeric"
                style={styles.weightInput}
              />
            </View>

            <Text style={styles.fieldLabel}>烹饪方式</Text>
            <View style={styles.cookingRow}>
              {COOKING_OPTIONS.map(option => {
                const active = option.value === cooking;
                return (
                  <TouchableOpacity
                    key={option.value}
                    style={[styles.cookingChip, active && styles.cookingChipActive]}
                    onPress={() => setCooking(option.value)}
                  >
                    <Text style={[styles.cookingChipText, active && styles.cookingChipTextActive]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.kcalCard}>
              <Text style={styles.kcalTitle}>估算热量</Text>
              <Text style={styles.kcalValue}>{kcal} kcal</Text>
            </View>

            <Text style={styles.sectionTitle}>选择食物</Text>
          </View>
        }
        renderItem={({ item }) => {
          const active = item.name === foodName;
          return (
            <TouchableOpacity
              style={[styles.foodItem, active && styles.foodItemActive]}
              onPress={() => {
                setFoodName(item.name);
                setQuery(item.name);
              }}
            >
              <Text style={[styles.foodName, active && styles.foodNameActive]}>{item.name}</Text>
              <Text style={styles.foodMeta}>{item.kcalPer100g} kcal/100g · {item.category}</Text>
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={styles.contentContainer}
        ListFooterComponent={
          <View style={styles.footerButtons}>
            <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.goBack()}>
              <Text style={styles.secondaryButtonText}>返回</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.primaryButton, saving && styles.primaryButtonDisabled]}
              onPress={onSave}
              disabled={saving}
            >
              <Text style={styles.primaryButtonText}>{saving ? '保存中...' : '保存记录'}</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 28,
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    backgroundColor: '#eaeaea',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    marginTop: 8,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedLabel: {
    marginTop: 10,
    marginBottom: 10,
    color: '#555',
    fontSize: 14,
  },
  predictionHint: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  weightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#444',
    marginBottom: 8,
  },
  weightInput: {
    width: 120,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    textAlign: 'right',
    fontSize: 15,
  },
  cookingRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  cookingChip: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  cookingChipActive: {
    backgroundColor: '#FF5722',
    borderColor: '#FF5722',
  },
  cookingChipText: {
    color: '#555',
    fontSize: 13,
  },
  cookingChipTextActive: {
    color: '#fff',
  },
  kcalCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  kcalTitle: {
    color: '#666',
    fontSize: 13,
    marginBottom: 4,
  },
  kcalValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FF5722',
  },
  foodItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  foodItemActive: {
    borderColor: '#FF5722',
    backgroundColor: '#FFF5F2',
  },
  foodName: {
    fontSize: 15,
    color: '#222',
    marginBottom: 2,
  },
  foodNameActive: {
    color: '#FF5722',
    fontWeight: '600',
  },
  foodMeta: {
    fontSize: 12,
    color: '#777',
  },
  footerButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  secondaryButton: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  secondaryButtonText: {
    color: '#555',
    fontSize: 15,
  },
  primaryButton: {
    flex: 2,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#FF5722',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});