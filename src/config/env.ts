// Environment configuration with multiple fallback strategies
import Constants from 'expo-constants';

// Debug function to log environment state
const debugEnvironment = () => {
  console.log('🔧 Environment Debug Info:');
  console.log('- Node ENV:', process.env.NODE_ENV);
  console.log('- Platform:', typeof window !== 'undefined' ? 'web' : 'mobile');
  console.log('- Constants available:', !!Constants.expoConfig);
  console.log('- Constants.extra available:', !!Constants.expoConfig?.extra);
  
  if (Constants.expoConfig?.extra) {
    const keys = Object.keys(Constants.expoConfig.extra).filter(k => k.includes('YOUTUBE'));
    console.log('- YouTube keys in Constants.extra:', keys);
  }
  
  const envKeys = Object.keys(process.env).filter(k => k.includes('YOUTUBE'));
  console.log('- YouTube keys in process.env:', envKeys);
};

// Get YouTube API key with multiple fallback strategies
export const getYouTubeApiKey = (): string | null => {
  debugEnvironment();
  
  // Strategy 1: Try Constants.expoConfig.extra (recommended for Expo)
  const fromExtra = Constants.expoConfig?.extra?.EXPO_PUBLIC_YOUTUBE_API_KEY || 
                    Constants.expoConfig?.extra?.YOUTUBE_API_KEY ||
                    Constants.expoConfig?.extra?.youtubeApiKey;
  
  if (fromExtra && fromExtra.trim() && fromExtra !== 'undefined') {
    console.log('✅ YouTube API key found in Constants.expoConfig.extra');
    return fromExtra;
  }
  
  // Strategy 2: Try process.env (works in some environments)
  const fromEnv = process.env.EXPO_PUBLIC_YOUTUBE_API_KEY || process.env.YOUTUBE_API_KEY;
  
  if (fromEnv && fromEnv.trim() && fromEnv !== 'undefined') {
    console.log('✅ YouTube API key found in process.env');
    return fromEnv;
  }
  
  console.log('❌ YouTube API key not found in any source');
  return null;
};

// Get other environment variables
export const getApiUrl = (): string => {
  const fromExtra = Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL || 
                    Constants.expoConfig?.extra?.API_URL;
  const fromEnv = process.env.EXPO_PUBLIC_API_URL || process.env.API_URL;
  
  return fromExtra || fromEnv || 'http://127.0.0.1:5000';
};

// Export environment config object
export const ENV_CONFIG = {
  youtubeApiKey: getYouTubeApiKey(),
  apiUrl: getApiUrl(),
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};

// Log configuration on import
console.log('🔧 Environment configuration loaded:', {
  hasYouTubeKey: !!ENV_CONFIG.youtubeApiKey,
  apiUrl: ENV_CONFIG.apiUrl,
  isDevelopment: ENV_CONFIG.isDevelopment,
});
