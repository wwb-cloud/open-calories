import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';

import CameraScreen from './src/screens/CameraScreen';
import ResultScreen from './src/screens/ResultScreen';
import HistoryScreen from './src/screens/HistoryScreen';

export type RootStackParamList = {
  Camera: undefined;
  Result: { imageUri: string };
  History: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Camera">
        <Stack.Screen 
          name="Camera" 
          component={CameraScreen}
          options={{ title: '卡路里记账本', headerShown: false }}
        />
        <Stack.Screen 
          name="Result" 
          component={ResultScreen}
          options={{ title: '记录详情', headerBackTitle: '返回' }}
        />
        <Stack.Screen 
          name="History" 
          component={HistoryScreen}
          options={{ title: '历史记录' }}
        />
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
}
