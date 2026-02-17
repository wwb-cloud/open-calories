import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import { RootStackParamList } from '../../App';
import { Meal } from '../types';
import { getAllMeals, deleteMeal, getTodayTotalKcal } from '../db/database';

type HistoryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'History'>;

interface Props {
  navigation: HistoryScreenNavigationProp;
}

export default function HistoryScreen({ navigation }: Props) {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [todayTotal, setTodayTotal] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [allMeals, total] = await Promise.all([
        getAllMeals(),
        getTodayTotalKcal(),
      ]);
      setMeals(allMeals);
      setTodayTotal(total);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: '加载失败',
        text2: error instanceof Error ? error.message : '未知错误',
      });
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleDelete = (meal: Meal) => {
    Alert.alert(
      '删除记录',
      `确定要删除 "${meal.foodLabel}" 的记录吗？`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMeal(meal.id);
              await loadData();
              Toast.show({
                type: 'success',
                text1: '已删除',
              });
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: '删除失败',
              });
            }
          },
        },
      ]
    );
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return `今天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
    
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const renderItem = ({ item }: { item: Meal }) => (
    <View style={styles.mealItem}>
      {item.imageUri && (
        <Image source={{ uri: item.imageUri }} style={styles.mealImage} />
      )}
      <View style={styles.mealInfo}>
        <View style={styles.mealHeader}>
          <Text style={styles.foodName}>{item.foodLabel}</Text>
          <Text style={styles.calories}>{item.kcal} kcal</Text>
        </View>
        <View style={styles.mealDetails}>
          <Text style={styles.detailText}>{item.weightGram}g · {item.cooking}</Text>
          <Text style={styles.timeText}>{formatDate(item.createdAt)}</Text>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => handleDelete(item)}
      >
        <MaterialIcons name="delete-outline" size={24} color="#FF5722" />
      </TouchableOpacity>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="restaurant-menu" size={64} color="#ddd" />
      <Text style={styles.emptyText}>还没有记录</Text>
      <Text style={styles.emptySubtext}>拍一张照片开始记录你的饮食吧</Text>
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => navigation.navigate('Camera')}
      >
        <Text style={styles.addButtonText}>去记录</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.summaryCard}>
        <View style={styles.summaryLeft}>
          <Text style={styles.summaryLabel}>今日摄入</Text>
          <View style={styles.caloriesRow}>
            <Text style={styles.summaryValue}>{todayTotal}</Text>
            <Text style={styles.summaryUnit}>kcal</Text>
          </View>
        </View>
        <View style={styles.summaryRight}>
          <MaterialIcons name="local-fire-department" size={40} color="#FF9800" />
        </View>
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>历史记录</Text>
        <Text style={styles.listCount}>{meals.length} 条</Text>
      </View>

      <FlatList
        data={meals}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  summaryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    marginBottom: 8,
    padding: 20,
    borderRadius: 16,
  },
  summaryLeft: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  caloriesRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  summaryValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FF5722',
  },
  summaryUnit: {
    fontSize: 16,
    color: '#FF5722',
    marginLeft: 4,
    marginBottom: 6,
  },
  summaryRight: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  listCount: {
    fontSize: 14,
    color: '#999',
  },
  listContainer: {
    padding: 16,
    paddingTop: 0,
    flexGrow: 1,
  },
  mealItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 8,
    borderRadius: 12,
  },
  mealImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  mealInfo: {
    flex: 1,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  calories: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FF5722',
  },
  mealDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailText: {
    fontSize: 13,
    color: '#666',
  },
  timeText: {
    fontSize: 12,
    color: '#999',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  addButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 32,
    backgroundColor: '#4CAF50',
    borderRadius: 24,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
