// src/components/AuthTest.tsx
import { useEffect } from 'react';
import { Text } from 'react-native';
import { auth } from '../firebase';

export default function AuthTest() {
  useEffect(() => {
    auth.onAuthStateChanged(user => {
      console.log('Current user:', user?.email);
    });
  }, []);

  return <Text>Auth Test Component</Text>;
}