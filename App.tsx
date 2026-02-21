import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import ResultScreen from './src/screens/ResultScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import StatusScreen from './src/screens/StatusScreen';

export type RootStackParamList = {
  Main: undefined;
  Result: { imageUri: string };
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      id="MainTabs"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof MaterialIcons.glyphMap = 'help';

          if (route.name === 'Record') {
            iconName = 'history';
          } else if (route.name === 'Status') {
            iconName = 'person';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF5722',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Record" 
        component={HistoryScreen} 
        options={{ title: '记录' }}
      />
      <Tab.Screen 
        name="Status" 
        component={StatusScreen} 
        options={{ title: '状态' }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator id="RootStack" initialRouteName="Main">
        <Stack.Screen 
          name="Main" 
          component={MainTabs}
          options={{ headerShown: false }}
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
