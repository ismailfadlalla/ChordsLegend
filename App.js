import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { AuthProvider } from './src/context/AuthProvider';
// import { MockAuthProvider as AuthProvider } from './src/context/MockAuthProvider';
import { Platform } from 'react-native';
import EnhancedErrorBoundary from './src/components/EnhancedErrorBoundary';
import { PI_CONFIG } from './src/config/piConfig';
import RootStack from './src/navigation/RootStack';
import { enhanceForPWA, getBrowserCompatibility, logDeviceCapabilities } from './src/utils/deviceCompatibility';

export default function App() {
  const [isPiEnvironment, setIsPiEnvironment] = useState(false);
  const [deviceCompatibility, setDeviceCompatibility] = useState(null);

  useEffect(() => {
    // Initialize cross-device compatibility and PWA enhancements
    const initCompatibility = () => {
      try {
        // Enhance for PWA if on web
        enhanceForPWA();
        
        // Log device capabilities for debugging
        const compatibility = logDeviceCapabilities();
        setDeviceCompatibility(compatibility);
        
        // Check browser compatibility and warn if needed
        const browserCheck = getBrowserCompatibility();
        if (!browserCheck.compatible && Platform.OS === 'web') {
          console.warn('Browser compatibility issues detected:', browserCheck.issues);
          // Show compatibility warning to user if needed
          if (typeof window !== 'undefined' && browserCheck.issues.length > 0) {
            console.log('ChordsLegend may not work optimally in this browser. Consider using Chrome, Firefox, or Safari.');
          }
        }
      } catch (error) {
        console.error('Error initializing compatibility features:', error);
      }
    };

    // Initialize Pi Browser integration if running in Pi environment
    const initPi = async () => {
      try {
        const isPiBrowser = PI_CONFIG.isPiBrowser();
        setIsPiEnvironment(isPiBrowser);
        
        if (isPiBrowser) {
          console.log('🥧 ChordsLegend running in Pi Browser environment');
          console.log('Sandbox mode:', PI_CONFIG.SANDBOX_MODE);
          console.log('Environment:', PI_CONFIG.ENVIRONMENT);
          
          // Initialize Pi SDK if available
          if (typeof window !== 'undefined' && window.Pi) {
            await window.Pi.init({
              version: PI_CONFIG.SDK_CONFIG.version,
              sandbox: PI_CONFIG.SDK_CONFIG.sandbox
            });
            console.log('✅ Pi SDK initialized successfully');
          }
        } else {
          console.log('🌐 ChordsLegend running in standard web environment');
        }
      } catch (error) {
        console.error('❌ Pi SDK initialization failed:', error);
      }
    };

    // Initialize both compatibility and Pi features
    initCompatibility();
    initPi();
  }, []);

  return (
    <EnhancedErrorBoundary>
      <AuthProvider>
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
      </AuthProvider>
    </EnhancedErrorBoundary>
  );
}

