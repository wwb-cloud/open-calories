import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';

import ResultScreen from './src/screens/ResultScreen';
import HistoryScreen from './src/screens/HistoryScreen';

export type RootStackParamList = {
  Home: undefined;
  Result: { imageUri: string };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator id="RootStack" initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HistoryScreen}
          options={{ title: '卡路里记账本', headerShown: false }}
        />
        <Stack.Screen 
          name="Result" 
          component={ResultScreen}
          options={{ title: '记录详情', headerBackTitle: '返回' }}
        />
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
}
