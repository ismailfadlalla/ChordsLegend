// src/context/AuthProvider.tsx
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getAuthInstance, testFirebaseConnection } from '../firebase';

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<User | null>;
  signUp: (email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
  clearError: () => void;
  isConnected: boolean;
  forceConnectionState: (connected: boolean) => void; // Debug function
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  error: null,
  login: async () => null,
  signUp: async () => null,
  logout: async () => {},
  clearError: () => {},
  isConnected: false,
  forceConnectionState: () => {}, // Debug function
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Debug: Add provider instance ID
  const providerInstanceId = Math.random().toString(36).substring(7);
  console.log(`AuthProvider instance created: ${providerInstanceId}`);

  // Test Firebase connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      console.log(`AuthProvider [${providerInstanceId}]: Starting Firebase setup...`);
      
      try {
        // Step 1: Initialize Firebase Auth
        console.log(`AuthProvider [${providerInstanceId}]: Getting Firebase Auth instance...`);
        const auth = getAuthInstance();
        console.log(`AuthProvider [${providerInstanceId}]: ✅ Firebase Auth instance obtained`);
        
        // Step 2: Set up auth state listener (this is the key to Firebase working)
        console.log(`AuthProvider [${providerInstanceId}]: Setting up auth state listener...`);
        const unsubscribe = onAuthStateChanged(
          auth, 
          (user) => {
            // Auth listener successfully working = Firebase is connected
            console.log(`AuthProvider [${providerInstanceId}]: Auth state changed:`, user ? `User: ${user.email}` : 'No user');
            
            // Update all states in one go
            setUser(user);
            setIsLoading(false);
            setIsConnected(true); // Auth listener working = Firebase connected
            setError(null);
            
            console.log(`AuthProvider [${providerInstanceId}]: ✅ Successfully updated states - Connected: true`);
          },
          (authError) => {
            console.error(`AuthProvider [${providerInstanceId}]: Auth state error:`, authError);
            setError(`Authentication error: ${authError.message}`);
            setIsLoading(false);
            setIsConnected(false);
          }
        );
        
        console.log(`AuthProvider [${providerInstanceId}]: ✅ Auth listener set up successfully`);
        
        // Step 3: Test connection (optional, for debugging)
        try {
          const connectionTest = await testFirebaseConnection();
          console.log(`AuthProvider [${providerInstanceId}]: Connection test result: ${connectionTest}`);
        } catch (testError) {
          console.log(`AuthProvider [${providerInstanceId}]: Connection test failed, but auth listener is working`);
        }
        
        return unsubscribe;
        
      } catch (error) {
        console.error(`AuthProvider [${providerInstanceId}]: Setup failed:`, error);
        setError(error instanceof Error ? error.message : 'Firebase setup failed');
        setIsLoading(false);
        setIsConnected(false);
      }
    };

    checkConnection();
  }, [providerInstanceId]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      
      // Validate input
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      // Ensure we can get the auth instance
      const auth = getAuthInstance();
      if (!auth) {
        throw new Error('Firebase Auth not initialized');
      }
      
      // Log debugging info
      console.log(`Attempting login for user: ${email}`);
      
      // Attempt login
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      console.log('Login successful for user:', userCredential.user.email);
      return userCredential.user;
      
    } catch (error: any) {
      console.error('Login error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      const errorMessage = getFirebaseErrorMessage(error);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      
      // Validate input
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      const auth = getAuthInstance();
      if (!auth) {
        throw new Error('Firebase Auth not initialized');
      }
      
      // Log debugging info
      console.log(`Attempting signup for user: ${email}`);
      
      // Attempt signup
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      console.log('Sign up successful for user:', userCredential.user.email);
      return userCredential.user;
      
    } catch (error: any) {
      console.error('SignUp error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      const errorMessage = getFirebaseErrorMessage(error);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setError(null);
      
      const auth = getAuthInstance();
      if (!auth) {
        throw new Error('Firebase Auth not initialized');
      }
      
      await signOut(auth);
      setUser(null);
      console.log('Logout successful');
      
    } catch (error: any) {
      console.error('Logout error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Logout failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Debug function to manually force connection state
  const forceConnectionState = useCallback((connected: boolean) => {
    console.log(`AuthProvider [${providerInstanceId}]: Force setting isConnected to ${connected}`);
    setIsConnected(connected);
    setIsLoading(false);
    if (connected) {
      setError(null);
    }
  }, [providerInstanceId]);

  const value = {
    user,
    isLoading,
    error,
    login,
    signUp,
    logout,
    clearError,
    isConnected,
    forceConnectionState, // Debug function
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Helper function to get user-friendly Firebase error messages
const getFirebaseErrorMessage = (error: any): string => {
  if (!error?.code) {
    return error?.message || 'An unexpected error occurred';
  }

  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Try logging in instead.';
    case 'auth/weak-password':
      return 'Password is too weak. Please choose a stronger password.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-not-found':
      return 'No account found with this email. Try signing up instead.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection and try again.';
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please check your credentials.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/operation-not-allowed':
      return 'Email/password accounts are not enabled. Please contact support.';
    default:
      return error.message || 'An authentication error occurred. Please try again.';
  }
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  // Debug: Log when hook is called and what it returns
  const debugInfo = {
    isConnected: context.isConnected,
    isLoading: context.isLoading,
    user: context.user ? 'logged in' : 'not logged in',
    error: context.error ? 'has error' : 'no error',
    timestamp: new Date().toLocaleTimeString()
  };
  
  console.log(`useAuth called:`, debugInfo);
  
  return context;
};