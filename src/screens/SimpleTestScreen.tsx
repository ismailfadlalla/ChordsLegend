import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SimpleTestScreen() {
  const [counter, setCounter] = useState(0);

  const handlePress = () => {
    setCounter(counter + 1);
    Alert.alert('Success!', `Button pressed ${counter + 1} times`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎵 ChordsLegend</Text>
      <Text style={styles.text}>App is working perfectly!</Text>
      <Text style={styles.subtext}>React Native • Expo • Navigation ✓</Text>
      
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>Test Button ({counter})</Text>
      </TouchableOpacity>
      
      <View style={styles.status}>
        <Text style={styles.statusText}>✅ Expo Metro Bundler</Text>
        <Text style={styles.statusText}>✅ React Navigation</Text>
        <Text style={styles.statusText}>✅ Component Rendering</Text>
        <Text style={styles.statusText}>✅ State Management</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2E7D32',
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  status: {
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    color: '#4CAF50',
    marginBottom: 4,
  },
});
