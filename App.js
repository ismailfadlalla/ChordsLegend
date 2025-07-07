import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { AuthProvider } from './src/context/AuthProvider';
// import { MockAuthProvider as AuthProvider } from './src/context/MockAuthProvider';
import ErrorBoundary from './src/components/ErrorBoundary';
import RootStack from './src/navigation/RootStack';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
      </AuthProvider>
    </ErrorBoundary>
  );
}

