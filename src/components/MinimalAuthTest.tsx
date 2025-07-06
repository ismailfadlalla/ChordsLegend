// Minimal Auth State Test
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export function MinimalAuthTest() {
  const [testConnected, setTestConnected] = useState(false);
  const [counter, setCounter] = useState(0);

  const toggleConnection = () => {
    console.log('MinimalAuthTest: Toggling connection state');
    setTestConnected(prev => {
      const newValue = !prev;
      console.log(`MinimalAuthTest: Setting testConnected to ${newValue}`);
      return newValue;
    });
  };

  const incrementCounter = () => {
    setCounter(prev => prev + 1);
    console.log('MinimalAuthTest: Counter incremented to', counter + 1);
  };

  useEffect(() => {
    console.log('MinimalAuthTest: Component mounted');
  }, []);

  useEffect(() => {
    console.log('MinimalAuthTest: testConnected changed to', testConnected);
  }, [testConnected]);

  useEffect(() => {
    console.log('MinimalAuthTest: counter changed to', counter);
  }, [counter]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minimal State Test</Text>
      <Text style={styles.status}>Test Connected: {testConnected ? 'TRUE' : 'FALSE'}</Text>
      <Text style={styles.status}>Counter: {counter}</Text>
      
      <TouchableOpacity style={styles.button} onPress={toggleConnection}>
        <Text style={styles.buttonText}>Toggle Connection</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={incrementCounter}>
        <Text style={styles.buttonText}>Increment Counter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#ffe6e6',
    margin: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ff0000',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#d00000',
  },
  status: {
    fontSize: 14,
    marginBottom: 5,
    fontFamily: 'monospace',
    color: '#000',
  },
  button: {
    backgroundColor: '#ff4444',
    padding: 8,
    borderRadius: 4,
    marginBottom: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
