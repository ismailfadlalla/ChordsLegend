// src/context/MockAuthProvider.tsx
// Temporary mock auth for development when Firebase is problematic
import React, { createContext, useCallback, useContext, useState } from 'react';

type MockUser = {
  uid: string;
  email: string;
  displayName?: string;
};

type AuthContextType = {
  user: MockUser | null;
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  forceConnectionState: (connected: boolean) => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  error: null,
  isConnected: true,
  login: async () => {},
  signUp: async () => {},
  logout: async () => {},
  clearError: () => {},
  forceConnectionState: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const MockAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(true); // Mock is always connected

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setUser({
      uid: 'mock-user-123',
      email: email,
      displayName: email.split('@')[0]
    });
    setIsLoading(false);
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setUser({
      uid: 'mock-user-123',
      email: email,
      displayName: email.split('@')[0]
    });
    setIsLoading(false);
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser(null);
    setIsLoading(false);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const forceConnectionState = useCallback((connected: boolean) => {
    setIsConnected(connected);
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      error, 
      isConnected, 
      login, 
      signUp, 
      logout, 
      clearError, 
      forceConnectionState 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
