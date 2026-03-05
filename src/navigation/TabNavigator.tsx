import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import Screen1 from '../screens/Screen1';
import Screen2 from '../screens/Screen2';
import Screen3 from '../screens/Screen3';
import { TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen 
        name="Screen1" 
        component={Screen1} 
        options={{ 
          title: 'SNS對話',
          tabBarLabel: 'CHAT',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>💬</Text>
          ),
        }} 
      />
      <Tab.Screen 
        name="Screen2" 
        component={Screen2} 
        options={{ 
          title: '聊天室',
          tabBarLabel: 'ROOM',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>🏠</Text>
          ),
        }} 
      />
      <Tab.Screen 
        name="Screen3" 
        component={Screen3} 
        options={{ 
          title: '設定',
          tabBarLabel: 'NEW',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>⚙️</Text>
          ),
        }} 
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;