import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const TestSearchScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>TEST SEARCH SCREEN - RENDERING WORKS!</Text>
      <Text style={styles.text}>If you see this, the basic rendering is working.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default TestSearchScreen;
