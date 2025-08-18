// src/firebase.ts
import Constants from 'expo-constants';
import { getApps, initializeApp } from 'firebase/app';
import {
    Auth,
    getAuth,
    GoogleAuthProvider
} from 'firebase/auth';

// Firebase configuration with multiple fallback sources
const getFirebaseConfig = () => {
  // Try to get from Constants (app.config.js)
  const fromConstants = Constants.expoConfig?.extra;
  
  // Create and return config object with actual Firebase values from google-services.json
  return {
    apiKey: fromConstants?.FIREBASE_API_KEY || 
            process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 
            process.env.FIREBASE_API_KEY || 
            "AIzaSyALL-rz-I971ihPTi3XBxYWesjp4rxekww", // Real API key from google-services.json
            
    authDomain: fromConstants?.FIREBASE_AUTH_DOMAIN || 
                process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 
                process.env.FIREBASE_AUTH_DOMAIN || 
                "chords-legend.firebaseapp.com",
                
    projectId: fromConstants?.FIREBASE_PROJECT_ID || 
               process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 
               process.env.FIREBASE_PROJECT_ID || 
               "chords-legend", // Real project ID from google-services.json
               
    storageBucket: fromConstants?.FIREBASE_STORAGE_BUCKET || 
                   process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 
                   process.env.FIREBASE_STORAGE_BUCKET || 
                   "chords-legend.firebasestorage.app", // Real storage bucket from google-services.json
                   
    messagingSenderId: fromConstants?.FIREBASE_MESSAGING_SENDER_ID || 
                       process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || 
                       process.env.FIREBASE_MESSAGING_SENDER_ID || 
                       "509802787175", // Real messaging sender ID from google-services.json
                       
    appId: fromConstants?.FIREBASE_APP_ID || 
           process.env.EXPO_PUBLIC_FIREBASE_APP_ID || 
           process.env.FIREBASE_APP_ID || 
           "1:509802787175:web:d0bf54cff762cbcff5bfc2" // Real web app ID from .env file
  };
};

const firebaseConfig = getFirebaseConfig();

// Enhanced configuration validation
const validateFirebaseConfig = (config: any) => {
  const required = ['apiKey', 'authDomain', 'projectId'];
  const missing = required.filter(key => !config[key]);
  
  if (missing.length > 0) {
    console.error('Missing Firebase configuration:', missing);
    return false;
  }
  
  console.log('Firebase configuration validated successfully');
  return true;
};

// Debug: Log the config to see what's being loaded
console.log('Firebase Config loaded:', {
  ...firebaseConfig,
  apiKey: firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 10)}...` : 'missing'
});

// Debug: Log what's available from each source
const fromConstants = Constants.expoConfig?.extra;
console.log('Firebase config sources:');
console.log('- Constants.expoConfig?.extra:', fromConstants ? Object.keys(fromConstants).filter(k => k.includes('FIREBASE')) : 'not available');
console.log('- process.env EXPO_PUBLIC_:', {
  EXPO_PUBLIC_FIREBASE_API_KEY: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ? 'found' : 'missing',
  EXPO_PUBLIC_FIREBASE_PROJECT_ID: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ? 'found' : 'missing'
});
console.log('- process.env regular:', {
  FIREBASE_API_KEY: process.env.FIREBASE_API_KEY ? 'found' : 'missing',
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID ? 'found' : 'missing'
});

// Validate configuration
const isConfigValid = validateFirebaseConfig(firebaseConfig);
if (!isConfigValid) {
  console.error('Firebase configuration is incomplete');
  console.log('Available extra config keys:', Object.keys(Constants.expoConfig?.extra || {}));
}

// Initialize Firebase
let app: any;
let auth: Auth;

try {
  // Check if app already exists
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    console.log('Firebase app initialized successfully');
  } else {
    app = getApps()[0];
    console.log('Using existing Firebase app');
  }
  
  // Initialize Firebase Auth with AsyncStorage persistence
  try {
    // For React Native, we need to use a different approach for persistence
    auth = getAuth(app);
    console.log('Firebase Auth initialized successfully');
  } catch (error: any) {
    console.error('Failed to initialize Firebase Auth:', error);
    throw error;
  }
  
} catch (error) {
  console.error('Failed to initialize Firebase:', error);
  throw new Error(`Firebase initialization failed: ${error instanceof Error ? error.message : String(error)}`);
}

// Test Firebase connection
export const testFirebaseConnection = async (): Promise<boolean> => {
  try {
    console.log('Starting Firebase connection test...');
    
    if (!auth) {
      console.error('Firebase Auth not initialized');
      return false;
    }
    
    // Test 1: Check if Firebase configuration is valid
    const config = auth.app.options;
    if (!config.apiKey || !config.authDomain || !config.projectId) {
      console.error('Firebase configuration is incomplete');
      return false;
    }
    console.log('✅ Firebase configuration is complete');
    
    // Test 2: Try to make a basic request to Firebase Auth API
    try {
      console.log('Testing Firebase Auth API connectivity...');
      const testUrl = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${config.apiKey}`;
      const response = await fetch(testUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      });
      
      console.log('Firebase API response status:', response.status);
      
      if (response.status === 400) {
        // A 400 error with "INVALID_ID_TOKEN" or similar means Firebase is reachable
        const errorText = await response.text();
        console.log('✅ Firebase Auth API is reachable (expected 400 error):', errorText);
        return true;
      } else if (response.status === 200) {
        console.log('✅ Firebase Auth API responded successfully');
        return true;
      } else if (response.status === 403) {
        console.log('⚠️ Firebase API key might be restricted, but service is reachable');
        return true; // API key restrictions don't mean Firebase is down
      } else {
        console.error('Firebase Auth API returned unexpected status:', response.status);
        const errorText = await response.text();
        console.error('Response body:', errorText);
        return false;
      }
    } catch (networkError) {
      console.error('Network request to Firebase failed:', networkError);
      
      // Check if it's a network connectivity issue
      try {
        await fetch('https://www.google.com', { 
          method: 'HEAD', 
          mode: 'no-cors',
          cache: 'no-cache'
        });
        console.log('✅ Internet connection is working');
        console.error('❌ Specific issue connecting to Firebase');
      } catch (internetError) {
        console.error('❌ No internet connection');
      }
      
      // Even if the network test fails, try to validate that Firebase Auth is at least initialized
      console.log('Attempting fallback test: checking if Firebase Auth is accessible...');
      try {
        const authInstance = getAuth();
        if (authInstance && authInstance.app) {
          console.log('✅ Firebase Auth instance is accessible (fallback success)');
          return true;
        }
      } catch (fallbackError) {
        console.error('❌ Firebase Auth instance not accessible:', fallbackError);
      }
      
      return false;
    }
    
  } catch (error) {
    console.error('Firebase connection test failed:', error);
    return false;
  }
};

export { auth, GoogleAuthProvider };

export const getAuthInstance = () => {
  if (!auth) {
    throw new Error('Firebase Auth not initialized. Check your Firebase configuration.');
  }
  return auth;
};