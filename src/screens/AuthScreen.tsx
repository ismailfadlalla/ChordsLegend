import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator, KeyboardAvoidingView,
  Platform, ScrollView, StyleSheet, Text,
  TextInput,
  TouchableOpacity, View
} from 'react-native';
import { useAuth } from '../context/AuthProvider';
import { RootStackParamList } from '../navigation/types';

type AuthScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Auth'>;

export default function AuthScreen() {
  const navigation = useNavigation<AuthScreenNavigationProp>();
  const route = useRoute();
  const { mode } = route.params as { mode?: 'login' | 'signup' } || {};
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(mode === 'signup' ? false : true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '', general: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const { login, signUp, error: authError, clearError, isConnected, isLoading: authLoading, user } = useAuth();

  // Navigate to Home when user successfully logs in
  useEffect(() => {
    if (user && !loading) {
      setSuccessMessage(isLogin ? 'Login successful! Redirecting...' : 'Account created! Redirecting...');
      // Small delay to show success before navigation
      setTimeout(() => {
        navigation.replace('Home');
      }, 1500);
    }
  }, [user, loading, navigation, isLogin]);

  // Clear errors when switching between login/signup
  useEffect(() => {
    setErrors({ email: '', password: '', general: '' });
    setSuccessMessage('');
    clearError();
  }, [isLogin, clearError]);

  // Show auth errors from context
  useEffect(() => {
    if (authError) {
      setErrors(prev => ({ ...prev, general: authError }));
    }
  }, [authError]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    if (!isLogin && password.length < 8) {
      return 'Password should be at least 8 characters for better security';
    }
    return '';
  };

  const handleAuth = async () => {
    // Clear previous errors
    setErrors({ email: '', password: '', general: '' });
    clearError();

    // Validate inputs
    if (!email.trim()) {
      setErrors(prev => ({ ...prev, email: 'Email is required' }));
      return;
    }

    if (!validateEmail(email)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
      return;
    }

    if (!password) {
      setErrors(prev => ({ ...prev, password: 'Password is required' }));
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError && !isLogin) {
      setErrors(prev => ({ ...prev, password: passwordError }));
      return;
    }
    
    setLoading(true);
    try {
      if (isLogin) {
        await login(email.trim(), password);
      } else {
        await signUp(email.trim(), password);
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      // Error is already handled by AuthProvider context
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>ChordsLegend</Text>
          <Text style={styles.subtitle}>
            {isLogin ? 'Welcome back!' : 'Join the community'}
          </Text>

          {/* Connection Status - Only show if not connected */}
          {!isConnected && (
            <View style={styles.statusContainer}>
              <Text style={[styles.statusText, { color: '#ff6b6b' }]}>
                Connection issue - Please check your internet
              </Text>
            </View>
          )}

          {/* Mode Toggle Buttons */}
          <View style={styles.modeToggle}>
            <TouchableOpacity
              style={[styles.modeButton, isLogin && styles.modeButtonActive]}
              onPress={() => {
                setIsLogin(true);
                setErrors({ email: '', password: '', general: '' });
              }}
            >
              <Text style={[styles.modeButtonText, isLogin && styles.modeButtonTextActive]}>
                Login
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeButton, !isLogin && styles.modeButtonActive]}
              onPress={() => {
                setIsLogin(false);
                setErrors({ email: '', password: '', general: '' });
              }}
            >
              <Text style={[styles.modeButtonText, !isLogin && styles.modeButtonTextActive]}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          {/* Success Message */}
          {successMessage ? (
            <View style={styles.successContainer}>
              <Text style={styles.successText}>{successMessage}</Text>
            </View>
          ) : null}

          {/* General Error Message */}
          {errors.general ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errors.general}</Text>
            </View>
          ) : null}

          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="Email"
            placeholderTextColor="#888"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) {
                setErrors(prev => ({ ...prev, email: '' }));
              }
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          {errors.email ? <Text style={styles.fieldErrorText}>{errors.email}</Text> : null}

          <TextInput
            style={[styles.input, errors.password && styles.inputError]}
            placeholder="Password"
            placeholderTextColor="#888"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) {
                setErrors(prev => ({ ...prev, password: '' }));
              }
            }}
            secureTextEntry
            autoComplete="password"
          />
          {errors.password ? <Text style={styles.fieldErrorText}>{errors.password}</Text> : null}

          {/* Password Requirements for Signup */}
          {!isLogin && (
            <View style={styles.passwordRequirements}>
              <Text style={styles.requirementsTitle}>Password Requirements:</Text>
              <Text style={[styles.requirementText, password.length >= 6 && styles.requirementMet]}>
                • At least 6 characters
              </Text>
              <Text style={[styles.requirementText, password.length >= 8 && styles.requirementMet]}>
                • Recommended: 8+ characters for better security
              </Text>
            </View>
          )}

          {/* Enhanced Auth Button with better UX */}
          <TouchableOpacity
            style={[
              styles.button, 
              loading && styles.buttonDisabled,
              !isConnected && styles.buttonWarning
            ]}
            onPress={handleAuth}
            disabled={loading || !isConnected}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={styles.buttonText}>
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>
                {!isConnected 
                  ? 'Check Connection' 
                  : isLogin 
                    ? 'Sign In' 
                    : 'Create Account'
                }
              </Text>
            )}
          </TouchableOpacity>

          {/* Alternative Login Methods */}
          <View style={styles.alternativeLogin}>
            <Text style={styles.alternativeText}>Or continue with</Text>
            <View style={styles.socialButtons}>
              <TouchableOpacity style={styles.socialButton} disabled>
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton} disabled>
                <Text style={styles.socialButtonText}>Apple</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.comingSoon}>Coming Soon</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
  },
  formContainer: {
    padding: 20,
    marginHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 5,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  inputError: {
    borderColor: '#ff4444',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#555',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  statusContainer: {
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  debugToggle: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  debugToggleText: {
    fontSize: 12,
    color: '#666',
  },
  debugContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    maxHeight: 200,
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  clearLogsButton: {
    padding: 5,
    backgroundColor: '#dc3545',
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 10,
  },
  clearLogsText: {
    color: '#fff',
    fontSize: 12,
  },
  debugLogs: {
    maxHeight: 120,
  },
  debugLogText: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: '#333',
    marginBottom: 2,
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: '#333',
    borderRadius: 10,
    marginBottom: 30,
    padding: 4,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  modeButtonActive: {
    backgroundColor: '#007AFF',
  },
  modeButtonText: {
    color: '#888',
    fontSize: 16,
    fontWeight: '500',
  },
  modeButtonTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorContainer: {
    backgroundColor: '#ff444420',
    borderColor: '#ff4444',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  successContainer: {
    backgroundColor: '#4CAF5020',
    borderColor: '#4CAF50',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    textAlign: 'center',
  },
  successText: {
    color: '#4CAF50',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  fieldErrorText: {
    color: '#ff4444',
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 5,
  },
  passwordRequirements: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  requirementsTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  requirementText: {
    color: '#888',
    fontSize: 12,
    marginBottom: 4,
  },
  requirementMet: {
    color: '#4CAF50',
  },
  buttonWarning: {
    backgroundColor: '#ff6b6b',
    opacity: 0.7,
  },
  alternativeLogin: {
    marginTop: 30,
    alignItems: 'center',
  },
  alternativeText: {
    color: '#888',
    fontSize: 14,
    marginBottom: 15,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 10,
  },
  socialButton: {
    backgroundColor: '#333',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    opacity: 0.6,
  },
  socialButtonText: {
    color: '#888',
    fontSize: 14,
  },
  comingSoon: {
    color: '#666',
    fontSize: 12,
    fontStyle: 'italic',
  },
});