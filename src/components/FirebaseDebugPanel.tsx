// src/components/FirebaseDebugPanel.tsx
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthProvider';

export function FirebaseDebugPanel() {
  const { isConnected, isLoading, error, user, forceConnectionState } = useAuth();
  const [updateCount, setUpdateCount] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    setUpdateCount(prev => prev + 1);
    setLastUpdate(new Date().toLocaleTimeString());
    console.log('FirebaseDebugPanel: Auth state updated', { isConnected, isLoading, error: !!error });
  }, [isConnected, isLoading, error, user]);

  const forceConnected = () => {
    forceConnectionState(true);
    console.log('FirebaseDebugPanel: Forced connection state to true');
  };

  const forceDisconnected = () => {
    forceConnectionState(false);
    console.log('FirebaseDebugPanel: Forced connection state to false');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔥 Firebase Debug Panel</Text>
      
      <View style={styles.statusRow}>
        <Text style={styles.label}>Connected:</Text>
        <Text style={[styles.value, { color: isConnected ? '#28a745' : '#dc3545' }]}>
          {isConnected ? '✅ YES' : '❌ NO'}
        </Text>
      </View>
      
      <View style={styles.statusRow}>
        <Text style={styles.label}>Loading:</Text>
        <Text style={styles.value}>{isLoading ? '⏳ YES' : '✅ NO'}</Text>
      </View>
      
      <View style={styles.statusRow}>
        <Text style={styles.label}>User:</Text>
        <Text style={styles.value}>{user ? '👤 Logged In' : '👥 Not Logged In'}</Text>
      </View>
      
      <View style={styles.statusRow}>
        <Text style={styles.label}>Error:</Text>
        <Text style={[styles.value, { color: error ? '#dc3545' : '#28a745' }]}>
          {error ? '❌ YES' : '✅ NO'}
        </Text>
      </View>
      
      <View style={styles.statusRow}>
        <Text style={styles.label}>Updates:</Text>
        <Text style={styles.value}>{updateCount}</Text>
      </View>
      
      <View style={styles.statusRow}>
        <Text style={styles.label}>Last Update:</Text>
        <Text style={styles.value}>{lastUpdate}</Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.successButton]} onPress={forceConnected}>
          <Text style={styles.buttonText}>Force Connected</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.dangerButton]} onPress={forceDisconnected}>
          <Text style={styles.buttonText}>Force Disconnected</Text>
        </TouchableOpacity>
      </View>
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    margin: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#007AFF',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingVertical: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  successButton: {
    backgroundColor: '#28a745',
  },
  dangerButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  errorContainer: {
    backgroundColor: '#f8d7da',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  errorText: {
    color: '#721c24',
    fontSize: 14,
  },
});
