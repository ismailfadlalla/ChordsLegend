import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { AuthProvider } from './src/context/AuthProvider';
// import { MockAuthProvider as AuthProvider } from './src/context/MockAuthProvider';
import { PI_CONFIG } from './src/config/piConfig';
import RootStack from './src/navigation/RootStack';

export default function App() {
  const [isPiEnvironment, setIsPiEnvironment] = useState(false);

  useEffect(() => {
    // Initialize Pi Browser integration if running in Pi environment
    const initPi = async () => {
      const isPiBrowser = PI_CONFIG.isPiBrowser();
      setIsPiEnvironment(isPiBrowser);
      
      if (isPiBrowser) {
        console.log('ChordsLegend running in Pi Browser environment');
        console.log('Sandbox mode:', PI_CONFIG.SANDBOX_MODE);
        console.log('Environment:', PI_CONFIG.ENVIRONMENT);
        
        // Initialize Pi SDK if available
        if (typeof window !== 'undefined' && window.Pi) {
          try {
            await window.Pi.init({
              version: PI_CONFIG.SDK_CONFIG.version,
              sandbox: PI_CONFIG.SDK_CONFIG.sandbox
            });
            console.log('Pi SDK initialized successfully');
          } catch (error) {
            console.error('Pi SDK initialization failed:', error);
          }
        }
      }
    };

    initPi();
  }, []);

  return (
    <AuthProvider>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </AuthProvider>
  );
}

