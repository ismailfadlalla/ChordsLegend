// Simple state test for Auth Provider
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthProvider';

export function SimpleAuthStateTest() {
  const { isConnected, isLoading, error } = useAuth();
  const [testState, setTestState] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);

  const forceRefresh = () => {
    setRefreshCount(prev => prev + 1);
    console.log('Force refresh triggered, count:', refreshCount + 1);
    console.log('Current auth state:', { isConnected, isLoading, error });
  };

  const toggleTestState = () => {
    setTestState(prev => !prev);
    console.log('Test state toggled to:', !testState);
  };

  useEffect(() => {
    console.log('SimpleAuthStateTest mounted');
    console.log('Initial auth state:', { isConnected, isLoading, error });
  }, []);

  useEffect(() => {
    console.log('Auth state changed in SimpleAuthStateTest:', { isConnected, isLoading, error });
  }, [isConnected, isLoading, error]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Simple Auth State Test</Text>
      
      <View style={styles.stateContainer}>
        <Text style={styles.label}>Connected: {isConnected ? 'TRUE' : 'FALSE'}</Text>
        <Text style={styles.label}>Loading: {isLoading ? 'TRUE' : 'FALSE'}</Text>
        <Text style={styles.label}>Error: {error || 'None'}</Text>
        <Text style={styles.label}>Test State: {testState ? 'TRUE' : 'FALSE'}</Text>
        <Text style={styles.label}>Refresh Count: {refreshCount}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={forceRefresh}>
        <Text style={styles.buttonText}>Force Refresh</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={toggleTestState}>
        <Text style={styles.buttonText}>Toggle Test State</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f0f0',
    margin: 10,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  stateContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontFamily: 'monospace',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
