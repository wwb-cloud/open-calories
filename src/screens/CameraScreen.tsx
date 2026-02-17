import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';

import { RootStackParamList } from '../../App';
import { initDatabase } from '../db/database';

type CameraScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Camera'>;

interface Props {
  navigation: CameraScreenNavigationProp;
}

export default function CameraScreen({ navigation }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  useEffect(() => {
    initDatabase().catch(err => {
      Alert.alert('数据库错误', '无法初始化数据库: ' + err.message);
    });
  }, []);

  const handleTakePhoto = async () => {
    if (!permission?.granted) {
      const { granted } = await requestPermission();
      if (!granted) {
        Alert.alert('需要相机权限', '请允许应用访问相机以拍摄食物照片');
        return;
      }
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setCapturedImage(result.assets[0].uri);
    }
  };

  const handlePickImage = async () => {
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
      setCapturedImage(result.assets[0].uri);
    }
  };

  const handleConfirm = () => {
    if (capturedImage) {
      navigation.navigate('Result', { imageUri: capturedImage });
      setCapturedImage(null);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const handleViewHistory = () => {
    navigation.navigate('History');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>卡路里记账本</Text>
        <Text style={styles.subtitle}>Phase 1 - 手动模式</Text>
      </View>

      <View style={styles.previewContainer}>
        {capturedImage ? (
          <Image source={{ uri: capturedImage }} style={styles.preview} />
        ) : (
          <View style={styles.placeholder}>
            <MaterialIcons name="camera-alt" size={64} color="#ccc" />
            <Text style={styles.placeholderText}>准备拍照...</Text>
          </View>
        )}
      </View>

      <View style={styles.guideBox}>
        <MaterialIcons name="info-outline" size={20} color="#2196F3" />
        <Text style={styles.guideText}>
          Phase 1: 手动选择食物类型和重量
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        {capturedImage ? (
          <>
            <TouchableOpacity style={styles.button} onPress={handleConfirm}>
              <MaterialIcons name="check" size={24} color="#fff" />
              <Text style={styles.buttonText}>确认使用</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={handleRetake}>
              <MaterialIcons name="replay" size={24} color="#666" />
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>重新拍摄</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
              <MaterialIcons name="camera-alt" size={24} color="#fff" />
              <Text style={styles.buttonText}>拍照</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={handlePickImage}>
              <MaterialIcons name="photo-library" size={24} color="#666" />
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>从相册选择</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <TouchableOpacity style={styles.historyButton} onPress={handleViewHistory}>
        <MaterialIcons name="history" size={24} color="#2196F3" />
        <Text style={styles.historyButtonText}>查看历史记录</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  previewContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  preview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  placeholderText: {
    marginTop: 12,
    fontSize: 16,
    color: '#999',
  },
  guideBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
  },
  guideText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#1976D2',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 140,
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButtonText: {
    color: '#666',
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginHorizontal: 20,
    marginBottom: 30,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E3F2FD',
  },
  historyButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#2196F3',
    fontWeight: '600',
  },
});
