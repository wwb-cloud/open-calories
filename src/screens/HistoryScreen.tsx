import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  RefreshControl,
  Modal,
  Pressable,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RootStackParamList } from '../../App';
import { Meal } from '../types';
import { getAllMeals, deleteMeal, getTodayTotalKcal, initDatabase } from '../db/database';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

export default function HistoryScreen({ navigation }: Props) {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [todayTotal, setTodayTotal] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    initDatabase().catch(err => {
      Alert.alert('数据库错误', '无法初始化数据库: ' + err.message);
    });
  }, []);

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

  const handleTakePhoto = async () => {
    setModalVisible(false);
    
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('需要相机权限', '请允许应用访问相机以拍摄食物照片');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      navigation.navigate('Result', { imageUri: result.assets[0].uri });
    }
  };

  const handlePickImage = async () => {
    setModalVisible(false);
    
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('需要相册权限', '请允许应用访问相册以选择食物照片');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      navigation.navigate('Result', { imageUri: result.assets[0].uri });
    }
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
      <Text style={styles.emptySubtext}>点击下方按钮开始记录你的饮食吧</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
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

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <MaterialIcons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setModalVisible(false)}
        >
          <Pressable 
            style={styles.modalContent} 
            onPress={() => {}}
          >
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>添加记录</Text>
            
            <TouchableOpacity 
              style={styles.modalOption}
              onPress={handleTakePhoto}
            >
              <View style={styles.modalOptionIcon}>
                <MaterialIcons name="camera-alt" size={28} color="#4CAF50" />
              </View>
              <View style={styles.modalOptionText}>
                <Text style={styles.modalOptionTitle}>拍照</Text>
                <Text style={styles.modalOptionDesc}>使用相机拍摄食物照片</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.modalOption}
              onPress={handlePickImage}
            >
              <View style={styles.modalOptionIcon}>
                <MaterialIcons name="photo-library" size={28} color="#2196F3" />
              </View>
              <View style={styles.modalOptionText}>
                <Text style={styles.modalOptionTitle}>从相册选择</Text>
                <Text style={styles.modalOptionDesc}>从手机相册中选择照片</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.modalCancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>取消</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
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
    paddingBottom: 100,
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
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 12,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalOptionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  modalOptionText: {
    flex: 1,
  },
  modalOptionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
  },
  modalOptionDesc: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
  },
  modalCancelButton: {
    marginTop: 20,
    paddingVertical: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
});
