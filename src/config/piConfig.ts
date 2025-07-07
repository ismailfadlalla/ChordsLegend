// Pi Network Integration Configuration
export const PI_CONFIG = {
  // Pi Network App Configuration
  APP_NAME: 'ChordsLegend',
  APP_USERNAME: 'chordslegend', // Your Pi app username
  
  // IMPORTANT: Pi Network Sandbox Configuration
  // Set SANDBOX_MODE to true for Pi Network testing
  SANDBOX_MODE: true,
  
  // Pi Network Environment Detection
  ENVIRONMENT: (typeof window !== 'undefined' && 
    (window.location.href.includes('sandbox.minepi.com') || 
     window.location.href.includes('pi.network'))) ? 'sandbox' : 
    (__DEV__ ? 'development' : 'production'),
  
  // Pi SDK Configuration
  API_KEY: process.env.PI_API_KEY || '',
  
  // Sandbox URLs
  SANDBOX_URL: 'https://sandbox.minepi.com/app/chords-legend',
  SANDBOX_API_BASE: 'https://api.sandbox.minepi.com',
  
  // Pi Browser Detection
  isPiBrowser: () => {
    return (
      typeof window !== 'undefined' && 
      (
        window.navigator.userAgent.includes('PiBrowser') ||
        window.location.hostname.includes('minepi.com') ||
        window.location.hostname.includes('pi.network') ||
        window.Pi !== undefined ||
        window.location.href.includes('sandbox.minepi.com')
      )
    );
  },
  
  // SDK Configuration
  SDK_CONFIG: {
    version: "2.0",
    sandbox: true, // Always true for initial submission testing
    environment: 'sandbox'
  },
  
  // App Configuration for Pi Network
  APP_CONFIG: {
    appName: 'ChordsLegend',
    developerId: 'chordslegend',
    appSecret: process.env.PI_APP_SECRET || '',
    scopes: ['payments', 'username']
  },
  
  // Sandbox-specific features for testing
  SANDBOX_FEATURES: {
    // Test features with small Pi amounts
    TEST_PREMIUM: {
      price: 0.01, // Small amount for testing
      name: 'Test Premium Feature',
      description: 'Test Pi payment functionality'
    }
  },
  
  // App-specific Pi features
  FEATURES: {
    // Premium features that require Pi payments
    PREMIUM_CHORD_LIBRARY: {
      price: 1.0, // 1 Pi
      name: 'Premium Chord Library',
      description: 'Access to advanced chord progressions and techniques'
    },
    
    AI_CHORD_DETECTION: {
      price: 2.0, // 2 Pi
      name: 'AI Chord Detection',
      description: 'Real-time audio analysis and chord recognition'
    },
    
    YOUTUBE_SYNC: {
      price: 1.5, // 1.5 Pi
      name: 'YouTube Synchronization',
      description: 'Sync chord progressions with YouTube videos'
    },
    
    OFFLINE_MODE: {
      price: 0.5, // 0.5 Pi
      name: 'Offline Mode',
      description: 'Download chord libraries for offline practice'
    }
  },
  
  // Pi Network URLs
  URLS: {
    DEVELOPER_PORTAL: 'https://developers.minepi.com/',
    APP_DETAILS: 'https://developers.minepi.com/apps/chordslegend',
    PI_BROWSER: 'https://app-cdn.minepi.com/mobile-app-ui/'
  }
};

// Pi Network payment types
export type PiFeature = keyof typeof PI_CONFIG.FEATURES;

export interface PiPayment {
  amount: number;
  memo: string;
  metadata: {
    feature: PiFeature;
    userId: string;
    timestamp: number;
  };
}

export interface PiUser {
  uid: string;
  username: string;
  accessToken: string;
  payments: PiPayment[];
}
