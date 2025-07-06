import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { AuthProvider } from './src/context/AuthProvider';
// import { MockAuthProvider as AuthProvider } from './src/context/MockAuthProvider';
import RootStack from './src/navigation/RootStack';

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </AuthProvider>
  );
}

