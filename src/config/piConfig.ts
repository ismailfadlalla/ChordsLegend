// Pi Network Integration Configuration
export const PI_CONFIG = {
  // Pi Network App Configuration
  APP_NAME: 'ChordsLegend',
  APP_USERNAME: 'chordslegend', // Your Pi app username
  
  // Pi Network Environment
  ENVIRONMENT: __DEV__ ? 'sandbox' : 'production',
  
  // Pi SDK Configuration
  API_KEY: process.env.PI_API_KEY || '',
  
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
