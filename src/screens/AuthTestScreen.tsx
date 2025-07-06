// src/screens/AuthTestScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator, Alert, Linking, ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SimpleAuthStateTest } from '../components/SimpleAuthStateTest';
import { useAuth } from '../context/AuthProvider';
import { testFirebaseConnection } from '../firebase';

export default function AuthTestScreen() {
  const { user, isLoading, error, isConnected, signUp, login, clearError, forceConnectionState } = useAuth();
  const [testResults, setTestResults] = useState<string[]>([]);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    runInitialTests();
  }, []);

  const addTestResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const runInitialTests = async () => {
    setTesting(true);
    addTestResult('Starting authentication system tests...');
    
    // Test 1: Check if Firebase Auth instance is accessible
    try {
      addTestResult('Testing Firebase Auth instance access...');
      const { getAuthInstance } = require('../firebase');
      const authInstance = getAuthInstance();
      if (authInstance) {
        addTestResult('✅ Firebase Auth instance: ACCESSIBLE');
        addTestResult(`   - App ID: ${authInstance.app.options.appId}`);
        addTestResult(`   - Project: ${authInstance.app.options.projectId}`);
        addTestResult(`   - Auth Domain: ${authInstance.app.options.authDomain}`);
      } else {
        addTestResult('❌ Firebase Auth instance: NOT ACCESSIBLE');
      }
    } catch (authError: any) {
      addTestResult(`❌ Firebase Auth instance error: ${authError.message}`);
    }
    
    // Test 2: Basic network connectivity
    try {
      addTestResult('Testing basic network connectivity...');
      const response = await fetch('https://www.google.com', { 
        method: 'GET',
        mode: 'no-cors',
        cache: 'no-cache'
      });
      addTestResult('✅ Network connectivity: SUCCESS');
    } catch (networkError) {
      addTestResult(`❌ Network connectivity: FAILED - ${networkError}`);
    }
    
    // Test 3: Firebase connection test
    try {
      addTestResult('Testing Firebase connection...');
      const connected = await testFirebaseConnection();
      addTestResult(`Firebase connection test: ${connected ? '✅ SUCCESS' : '❌ FAILED'}`);
      
      if (!connected) {
        addTestResult('Note: Firebase might still work even if connection test fails');
        addTestResult('This test tries to reach Firebase servers directly');
      }
    } catch (error: any) {
      addTestResult(`Firebase connection error: ${error instanceof Error ? error.message : String(error)}`);
    }

    // Test 4: Auth Provider state
    addTestResult('--- Auth Provider State ---');
    addTestResult(`Auth loading state: ${isLoading ? '⏳ Loading' : '✅ Ready'}`);
    addTestResult(`Auth connected state: ${isConnected ? '✅ Connected' : '❌ Not Connected'}`);
    addTestResult(`Current user: ${user ? `✅ ${user.email}` : '👤 No user logged in'}`);
    addTestResult(`Auth error: ${error ? `❌ ${error}` : '✅ No error'}`);
    
    // Wait a moment and check again in case of timing issues
    setTimeout(() => {
      addTestResult('--- Rechecking Auth State (after delay) ---');
      addTestResult(`Auth connected state (recheck): ${isConnected ? '✅ Connected' : '❌ Still Not Connected'}`);
      addTestResult(`Auth loading state (recheck): ${isLoading ? '⏳ Loading' : '✅ Ready'}`);
      setTesting(false);
    }, 1000);
    
    // Don't set testing to false immediately - wait for the recheck
  };

  const testSignUp = async () => {
    const testEmail = `test.${Date.now()}@example.com`;
    const testPassword = 'testpassword123';
    
    addTestResult(`Testing signup with: ${testEmail}`);
    
    try {
      setTesting(true);
      await signUp(testEmail, testPassword);
      addTestResult('Signup test: SUCCESS');
    } catch (error: any) {
      addTestResult(`Signup test FAILED: ${error.message}`);
    } finally {
      setTesting(false);
    }
  };

  const testSignIn = async () => {
    // Use a known test account
    const testEmail = 'test@example.com';
    const testPassword = 'testpassword123';
    
    addTestResult(`Testing signin with: ${testEmail}`);
    
    try {
      setTesting(true);
      await login(testEmail, testPassword);
      addTestResult('Signin test: SUCCESS');
    } catch (error: any) {
      addTestResult(`Signin test FAILED: ${error.message}`);
    } finally {
      setTesting(false);
    }
  };

  const clearTests = () => {
    setTestResults([]);
    clearError();
  };

  const forceRefreshAuthState = () => {
    addTestResult('--- Force Refresh Auth State ---');
    addTestResult(`Current timestamp: ${new Date().toLocaleTimeString()}`);
    addTestResult(`Auth connected state: ${isConnected ? '✅ Connected' : '❌ Not Connected'}`);
    addTestResult(`Auth loading state: ${isLoading ? '⏳ Loading' : '✅ Ready'}`);
    addTestResult(`Current user: ${user ? `✅ ${user.email}` : '👤 No user logged in'}`);
    addTestResult(`Auth error: ${error ? `❌ ${error}` : '✅ No error'}`);
    
    // Additional debugging - check raw values
    addTestResult(`Raw isConnected value: ${String(isConnected)}`);
    addTestResult(`Raw isLoading value: ${String(isLoading)}`);
    addTestResult(`Type of isConnected: ${typeof isConnected}`);
  };

  const debugAuthProvider = async () => {
    addTestResult('--- Debugging Auth Provider ---');
    
    try {
      // Test if we can access the auth context directly
      const authContext = useAuth();
      addTestResult(`Auth context available: ${authContext ? 'Yes' : 'No'}`);
      addTestResult(`Context isConnected: ${String(authContext.isConnected)}`);
      addTestResult(`Context user: ${authContext.user ? authContext.user.email : 'No user'}`);
      
      // Try to manually test Firebase Auth
      const { getAuthInstance } = require('../firebase');
      const auth = getAuthInstance();
      if (auth) {
        addTestResult(`Firebase auth current user: ${auth.currentUser ? auth.currentUser.email : 'No user'}`);
        addTestResult(`Firebase auth app: ${auth.app.name}`);
      }
      
    } catch (debugError: any) {
      addTestResult(`Debug error: ${debugError.message}`);
    }
  };

  const forceConnectedTrue = () => {
    addTestResult('--- Forcing Connection State to TRUE ---');
    addTestResult(`Before: isConnected = ${isConnected}`);
    forceConnectionState(true);
    setTimeout(() => {
      addTestResult(`After timeout: isConnected = ${isConnected}`);
    }, 500);
  };

  const forceConnectedFalse = () => {
    addTestResult('--- Forcing Connection State to FALSE ---');
    addTestResult(`Before: isConnected = ${isConnected}`);
    forceConnectionState(false);
    setTimeout(() => {
      addTestResult(`After timeout: isConnected = ${isConnected}`);
    }, 500);
  };

  const openFirebaseConsole = async () => {
    const url = 'https://console.firebase.google.com/project/chords-legend/authentication/users';
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Cannot open URL', 'Please manually visit: console.firebase.google.com');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not open Firebase Console');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Authentication Debug Screen</Text>
        <Text style={styles.subtitle}>Test Firebase Authentication</Text>
      </View>

      {/* Simple State Test */}
      <SimpleAuthStateTest />

      {/* Current Status */}
      <View style={styles.statusContainer}>
        <Text style={styles.sectionTitle}>Current Status</Text>
        <Text style={styles.statusText}>
          User: {user ? user.email : 'Not logged in'}
        </Text>
        <Text style={styles.statusText}>
          Loading: {isLoading ? 'Yes' : 'No'}
        </Text>
        <Text style={styles.statusText}>
          Connected: {isConnected ? 'Yes' : 'No'}
        </Text>
        <Text style={styles.statusText}>
          Error: {error || 'None'}
        </Text>
      </View>

      {/* Test Buttons */}
      <View style={styles.testContainer}>
        <Text style={styles.sectionTitle}>Tests</Text>
        
        <TouchableOpacity 
          style={styles.testButton} 
          onPress={runInitialTests} 
          disabled={testing}
        >
          <Text style={styles.testButtonText}>Run Connection Tests</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.testButton} 
          onPress={testSignUp}
          disabled={testing}
        >
          <Text style={styles.testButtonText}>Test Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.testButton} 
          onPress={testSignIn}
          disabled={testing}
        >
          <Text style={styles.testButtonText}>Test Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.testButton} 
          onPress={forceRefreshAuthState}
          disabled={testing}
        >
          <Text style={styles.testButtonText}>Refresh Auth State</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.testButton} 
          onPress={debugAuthProvider}
          disabled={testing}
        >
          <Text style={styles.testButtonText}>Debug Auth Provider</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.testButton, {backgroundColor: '#28a745'}]} 
          onPress={forceConnectedTrue}
          disabled={testing}
        >
          <Text style={styles.testButtonText}>Force Connected = TRUE</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.testButton, {backgroundColor: '#dc3545'}]} 
          onPress={forceConnectedFalse}
          disabled={testing}
        >
          <Text style={styles.testButtonText}>Force Connected = FALSE</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.clearButton} 
          onPress={clearTests}
          disabled={testing}
        >
          <Text style={styles.clearButtonText}>Clear Results</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.firebaseButton} 
          onPress={openFirebaseConsole}
        >
          <Text style={styles.firebaseButtonText}>Open Firebase Console</Text>
        </TouchableOpacity>
      </View>

      {/* Test Results */}
      <View style={styles.resultsContainer}>
        <Text style={styles.sectionTitle}>Test Results</Text>
        {testing && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#007AFF" />
            <Text style={styles.loadingText}>Running tests...</Text>
          </View>
        )}
        {testResults.map((result, index) => (
          <Text key={index} style={styles.resultText}>
            {result}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: '#007AFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginTop: 5,
  },
  statusContainer: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    margin: 10,
    borderRadius: 8,
  },
  testContainer: {
    padding: 20,
    margin: 10,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  resultsContainer: {
    padding: 20,
    margin: 10,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    minHeight: 200,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  statusText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666',
  },
  testButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  testButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  firebaseButton: {
    backgroundColor: '#ff9500',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  firebaseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  loadingText: {
    marginLeft: 10,
    color: '#666',
  },
  resultText: {
    fontSize: 12,
    marginBottom: 3,
    color: '#333',
    fontFamily: 'monospace',
  }
});
