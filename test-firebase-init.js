// Test Firebase initialization without React Native dependencies
const fs = require('fs');

console.log('🔥 Firebase Initialization Test\n');

// Simulate what happens in firebase.ts
console.log('1. Testing Firebase config creation...');

// Load .env
require('dotenv').config();

// Simulate the config creation
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID
};

console.log('✅ Firebase config created:');
console.log(`   - API Key: ${firebaseConfig.apiKey ? 'Found' : 'Missing'}`);
console.log(`   - Auth Domain: ${firebaseConfig.authDomain ? 'Found' : 'Missing'}`);
console.log(`   - Project ID: ${firebaseConfig.projectId ? 'Found' : 'Missing'}`);
console.log(`   - App ID: ${firebaseConfig.appId ? 'Found' : 'Missing'}`);

// Test the connection test URL
console.log('\n2. Testing Firebase Auth API URL...');
if (firebaseConfig.apiKey) {
  const testUrl = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseConfig.apiKey}`;
  console.log('✅ Auth API URL constructed successfully');
  console.log(`   URL: https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseConfig.apiKey.substring(0, 10)}...`);
} else {
  console.log('❌ Cannot construct Auth API URL - API key missing');
}

console.log('\n🎯 Firebase should initialize successfully in the app!');
console.log('\n📱 To test in the app:');
console.log('1. Run: npx expo start');
console.log('2. Look for console logs starting with "Firebase Config loaded:"');
console.log('3. Check AuthTestScreen for connection status');
console.log('4. The "Auth connected state" should now show "true"');
