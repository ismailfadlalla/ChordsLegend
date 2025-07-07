/**
 * Pi Network Sandbox Configuration
 * Specific settings for Pi Browser and sandbox environment
 */

export const PI_SANDBOX_CONFIG = {
  // Pi Network Sandbox Environment
  SANDBOX_URL: 'https://sandbox.minepi.com/app/chords-legend',
  SANDBOX_API_BASE: 'https://api.minepi.com/v2',
  
  // Pi Browser Detection
  isPiBrowser: () => {
    if (typeof window === 'undefined') return false;
    return window.navigator.userAgent.includes('PiBrowser') || 
           window.location.hostname.includes('minepi.com') ||
           window.location.hostname.includes('sandbox.minepi.com');
  },

  // Pi Network SDK Configuration for Sandbox
  SDK_CONFIG: {
    version: '2.0',
    sandbox: true,
    environment: 'sandbox'
  },

  // App Authentication for Pi Network
  APP_CONFIG: {
    appName: 'ChordsLegend',
    developerId: process.env.PI_DEVELOPER_ID || '',
    appSecret: process.env.PI_APP_SECRET || '',
    scopes: ['username', 'payments']
  },

  // Features available in sandbox
  SANDBOX_FEATURES: {
    // Free features for testing
    BASIC_CHORDS: {
      enabled: true,
      price: 0
    },
    
    // Premium features for Pi payment testing
    PREMIUM_LIBRARY: {
      enabled: true,
      price: 1.0,
      testMode: true
    },

    YOUTUBE_INTEGRATION: {
      enabled: true,
      price: 1.5,
      testMode: true
    }
  }
};

// Pi Browser specific initialization
export const initializePiBrowser = async () => {
  if (!PI_SANDBOX_CONFIG.isPiBrowser()) {
    console.log('Not running in Pi Browser');
    return false;
  }

  try {
    // Initialize Pi SDK for sandbox
    if (typeof window !== 'undefined' && (window as any).Pi) {
      const Pi = (window as any).Pi;
      await Pi.init(PI_SANDBOX_CONFIG.SDK_CONFIG);
      console.log('Pi SDK initialized for sandbox');
      return true;
    }
  } catch (error) {
    console.error('Failed to initialize Pi SDK:', error);
  }

  return false;
};

// Get Pi user authentication
export const authenticateWithPi = async () => {
  if (!PI_SANDBOX_CONFIG.isPiBrowser()) {
    throw new Error('Not running in Pi Browser');
  }

  try {
    const Pi = (window as any).Pi;
    const auth = await Pi.authenticate(PI_SANDBOX_CONFIG.APP_CONFIG.scopes, onIncompletePaymentFound);
    console.log('Pi authentication successful:', auth);
    return auth;
  } catch (error) {
    console.error('Pi authentication failed:', error);
    throw error;
  }
};

// Handle incomplete payments
const onIncompletePaymentFound = (payment: any) => {
  console.log('Incomplete payment found:', payment);
  // Handle incomplete payment logic here
  return payment.txid;
};

export default PI_SANDBOX_CONFIG;
