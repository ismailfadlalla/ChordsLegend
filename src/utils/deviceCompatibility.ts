// Cross-device compatibility utilities
import { Dimensions, Platform } from 'react-native';

export interface DeviceInfo {
  platform: string;
  isWeb: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
  screenHeight: number;
  userAgent: string;
  supportedFeatures: {
    audio: boolean;
    video: boolean;
    localStorage: boolean;
    serviceWorker: boolean;
    notifications: boolean;
  };
}

export const getDeviceInfo = (): DeviceInfo => {
  const { width, height } = Dimensions.get('window');
  const isWeb = Platform.OS === 'web';
  
  // Determine device type based on screen size and platform
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;
  
  let userAgent = 'Unknown';
  let supportedFeatures = {
    audio: false,
    video: false,
    localStorage: false,
    serviceWorker: false,
    notifications: false,
  };

  if (isWeb && typeof window !== 'undefined') {
    userAgent = navigator.userAgent || 'Unknown';
    
    // Check for feature support
    supportedFeatures = {
      audio: !!(window as any).Audio || !!(document.createElement('audio').canPlayType),
      video: !!(document.createElement('video').canPlayType),
      localStorage: typeof Storage !== 'undefined',
      serviceWorker: 'serviceWorker' in navigator,
      notifications: 'Notification' in window,
    };
  }

  return {
    platform: Platform.OS,
    isWeb,
    isMobile,
    isTablet,
    isDesktop,
    screenWidth: width,
    screenHeight: height,
    userAgent,
    supportedFeatures,
  };
};

export const getOptimalPlayerSize = (deviceInfo: DeviceInfo) => {
  const { screenWidth, isMobile, isTablet } = deviceInfo;
  
  if (isMobile) {
    return {
      width: Math.min(screenWidth - 40, 360),
      height: 200,
    };
  } else if (isTablet) {
    return {
      width: Math.min(screenWidth - 80, 500),
      height: 280,
    };
  } else {
    return {
      width: Math.min(screenWidth - 120, 640),
      height: 360,
    };
  }
};

export const getBrowserCompatibility = () => {
  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    return { compatible: true, issues: [] };
  }

  const issues: string[] = [];
  const userAgent = navigator.userAgent.toLowerCase();

  // Check for known compatibility issues
  if (userAgent.includes('internet explorer') || userAgent.includes('msie')) {
    issues.push('Internet Explorer is not supported. Please use a modern browser.');
  }

  if (userAgent.includes('safari') && !userAgent.includes('chrome') && 
      !window.AudioContext && !(window as any).webkitAudioContext) {
    issues.push('Audio features may not work properly in this version of Safari.');
  }

  // Check for essential APIs
  if (!window.fetch) {
    issues.push('This browser does not support modern networking features.');
  }

  if (!window.Promise) {
    issues.push('This browser does not support modern JavaScript features.');
  }

  return {
    compatible: issues.length === 0,
    issues,
  };
};

export const enhanceForPWA = () => {
  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    return;
  }

  // Add viewport meta tag if not present
  let viewport = document.querySelector('meta[name="viewport"]');
  if (!viewport) {
    viewport = document.createElement('meta');
    viewport.setAttribute('name', 'viewport');
    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    document.head.appendChild(viewport);
  }

  // Add theme color meta tag
  let themeColor = document.querySelector('meta[name="theme-color"]');
  if (!themeColor) {
    themeColor = document.createElement('meta');
    themeColor.setAttribute('name', 'theme-color');
    themeColor.setAttribute('content', '#1a1a2e');
    document.head.appendChild(themeColor);
  }

  // Add apple-mobile-web-app-capable for iOS
  let appleMobile = document.querySelector('meta[name="apple-mobile-web-app-capable"]');
  if (!appleMobile) {
    appleMobile = document.createElement('meta');
    appleMobile.setAttribute('name', 'apple-mobile-web-app-capable');
    appleMobile.setAttribute('content', 'yes');
    document.head.appendChild(appleMobile);
  }

  // Prevent zoom on double tap for better UX
  let style = document.getElementById('pwa-enhancements');
  if (!style) {
    style = document.createElement('style');
    style.id = 'pwa-enhancements';
    style.textContent = `
      * {
        touch-action: manipulation;
      }
      
      body {
        -webkit-user-select: none;
        -webkit-touch-callout: none;
        -webkit-tap-highlight-color: transparent;
      }
      
      input, textarea {
        -webkit-user-select: auto;
      }
    `;
    document.head.appendChild(style);
  }
};

export const logDeviceCapabilities = () => {
  const deviceInfo = getDeviceInfo();
  const compatibility = getBrowserCompatibility();
  
  console.log('🎸 ChordsLegend Device Compatibility Report');
  console.log('==========================================');
  console.log('Platform:', deviceInfo.platform);
  console.log('Screen Size:', `${deviceInfo.screenWidth}x${deviceInfo.screenHeight}`);
  console.log('Device Type:', {
    mobile: deviceInfo.isMobile,
    tablet: deviceInfo.isTablet,
    desktop: deviceInfo.isDesktop,
  });
  console.log('User Agent:', deviceInfo.userAgent);
  console.log('Supported Features:', deviceInfo.supportedFeatures);
  console.log('Browser Compatibility:', compatibility);
  console.log('==========================================');
  
  return { deviceInfo, compatibility };
};
