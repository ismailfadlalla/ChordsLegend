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
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Initialize Firebase Auth on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const auth = getAuthInstance();
        
        // Set up auth state listener
        const unsubscribe = onAuthStateChanged(
          auth, 
          (user) => {
            setUser(user);
            setIsLoading(false);
            setIsConnected(true);
            setError(null);
          },
          (authError) => {
            setError(`Authentication error: ${authError.message}`);
            setIsLoading(false);
            setIsConnected(false);
          }
        );
        
        // Test connection (optional)
        try {
          await testFirebaseConnection();
        } catch (testError) {
          // Connection test failed, but auth listener might still work
        }
        
        return unsubscribe;
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Firebase setup failed');
        setIsLoading(false);
        setIsConnected(false);
      }
    };

    initializeAuth();
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      const auth = getAuthInstance();
      if (!auth) {
        throw new Error('Firebase Auth not initialized');
      }
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setIsLoading(false);
      return userCredential.user;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setError(errorMessage);
      setIsLoading(false);
      return null;
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      
      const auth = getAuthInstance();
      if (!auth) {
        throw new Error('Firebase Auth not initialized');
      }
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setIsLoading(false);
      return userCredential.user;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign up failed';
      setError(errorMessage);
      setIsLoading(false);
      return null;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const auth = getAuthInstance();
      if (!auth) {
        throw new Error('Firebase Auth not initialized');
      }
      
      await signOut(auth);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Logout failed';
      setError(errorMessage);
    }
  }, []);

  const value = {
    user,
    isLoading,
    error,
    login,
    signUp,
    logout,
    clearError,
    isConnected,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
