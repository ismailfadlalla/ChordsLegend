import { StyleSheet, Text, View } from 'react-native';
import { ThemeProvider } from './src/context/ThemeContext';

// Minimal test component
function MinimalHome() {
  console.log('MinimalHome rendering...');
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎵 Minimal Test</Text>
      <Text style={styles.subtitle}>If you see this, the basic setup works!</Text>
    </View>
  );
}

// Minimal App Component
export default function TestApp() {
  console.log('TestApp rendering...');
  
  try {
    return (
      <ThemeProvider>
        <MinimalHome />
      </ThemeProvider>
    );
  } catch (error) {
    console.error('TestApp error:', error);
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Error: {error.toString()}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#34495e',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ecf0f1',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#bdc3c7',
    textAlign: 'center',
  },
});
