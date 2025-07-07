// src/navigation/RootStack.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import AuthScreen from '../screens/AuthScreen';
import ChordPlayerScreen from '../screens/ChordPlayerScreen';
import HomeScreen from '../screens/HomeScreen';
import LibraryScreen from '../screens/LibraryScreen';
import SearchScreen from '../screens/SearchScreen';
import SettingsScreen from '../screens/SettingsScreen';
import TestScreen from '../screens/TestScreen';

const Stack = createNativeStackNavigator();

export default function RootStack() {
  return (
    <Stack.Navigator 
      initialRouteName="Test"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4CAF50',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Test" 
        component={TestScreen} 
        options={{ title: '🧪 Test Screen' }}
      />
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: '🎵 ChordsLegend' }}
      />
      <Stack.Screen 
        name="Search" 
        component={SearchScreen} 
        options={{ title: '🔍 Search' }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ title: '⚙️ Settings' }}
      />
      <Stack.Screen 
        name="ChordPlayer" 
        component={ChordPlayerScreen} 
        options={{ title: '🎸 Chord Player' }}
      />
      <Stack.Screen 
        name="Library" 
        component={LibraryScreen} 
        options={{ title: '❤️ My Favorites' }}
      />
      <Stack.Screen 
        name="Auth" 
        component={AuthScreen} 
        options={{ title: '🔐 Sign In' }}
      />
    </Stack.Navigator>
  );
}