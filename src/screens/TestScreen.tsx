import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function TestScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🎵 ChordsLegend Test Screen</Text>
      <Text style={styles.subtext}>If you see this, React Native rendering is working!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
});
