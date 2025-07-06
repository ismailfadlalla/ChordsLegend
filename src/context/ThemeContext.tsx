// src/context/ThemeContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ThemeProviderProps {
  children: ReactNode;
}
type Theme = {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  surfaceHighlight: string;
  error: string;
  text: string;
  secondaryText: string;
  onPrimary: string;
  divider: string;
  children?: ReactNode;
};

const lightTheme: Theme = {
  primary: '#6A0DAD',
  secondary: '#9C27B0',
  background: '#FFFFFF',
  surface: '#F5F5F5',
  surfaceHighlight: '#E0E0E0',
  error: '#B00020',
  text: '#000000',
  secondaryText: '#666666',
  onPrimary: '#FFFFFF',
  divider: '#DDDDDD',
};

const darkTheme: Theme = {
  primary: '#BB86FC',
  secondary: '#03DAC6',
  background: '#121212',
  surface: '#1E1E1E',
  surfaceHighlight: '#2D2D2D',
  error: '#CF6679',
  text: '#FFFFFF',
  secondaryText: '#BBBBBB',
  onPrimary: '#000000',
  divider: '#333333',
};

const ThemeContext = createContext<{
  theme: Theme;
  isDark: boolean;
  setTheme: (dark: boolean) => void;
}>({
  theme: lightTheme,
  isDark: false,
  setTheme: () => {},
});

export const ThemeProvider = ({ children }: ThemeProviderProps ) => {
  const [isDark, setIsDark] = useState(false);

  return (
    <ThemeContext.Provider
      value={{
        theme: isDark ? darkTheme : lightTheme,
        isDark,
        setTheme: setIsDark,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);