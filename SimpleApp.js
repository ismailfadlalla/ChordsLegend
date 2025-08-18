import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function App() {
  console.log('🎵 Super Simple App Loading...');

  const handleTest = () => {
    Alert.alert('Test', 'App is working!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎵 Chords Legend</Text>
      <Text style={styles.subtitle}>Simple Test Version</Text>
      
      <TouchableOpacity style={styles.button} onPress={handleTest}>
        <Text style={styles.buttonText}>Test Button</Text>
      </TouchableOpacity>
      
      <Text style={styles.status}>✅ Rendering Successfully!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#bbb',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  status: {
    marginTop: 40,
    color: '#2ecc71',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
