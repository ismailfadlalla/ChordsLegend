// debug-firebase-status.js
// Simple test to check Firebase connection status

const { initializeApp, getApps } = require('firebase/app');
const { getAuth } = require('firebase/auth');

const firebaseConfig = {
  apiKey: "AIzaSyALL-rz-I971ihPTi3XBxYWesjp4rxekww",
  authDomain: "chords-legend.firebaseapp.com",
  projectId: "chords-legend",
  storageBucket: "chords-legend.firebasestorage.app",
  messagingSenderId: "509802787175",
  appId: "1:509802787175:android:983791faee41272ef5bfc2"
};

async function testFirebaseConnection() {
  console.log('=== Firebase Debug Test ===');
  
  try {
    // Initialize Firebase
    console.log('1. Initializing Firebase...');
    let app;
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
      console.log('✅ Firebase app initialized');
    } else {
      app = getApps()[0];
      console.log('✅ Using existing Firebase app');
    }

    // Initialize Auth
    console.log('2. Initializing Firebase Auth...');
    const auth = getAuth(app);
    console.log('✅ Firebase Auth initialized');

    // Test connection to Firebase Auth API
    console.log('3. Testing Firebase Auth API connection...');
    const testUrl = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseConfig.apiKey}`;
    
    const response = await fetch(testUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
    });
    
    console.log(`API Response Status: ${response.status}`);
    
    if (response.status === 400) {
      console.log('✅ Firebase Auth API is reachable (expected 400 for empty request)');
      return true;
    } else if (response.status === 200) {
      console.log('✅ Firebase Auth API responded successfully');
      return true;
    } else {
      const errorText = await response.text();
      console.log(`❌ Unexpected response: ${response.status}`);
      console.log('Response body:', errorText);
      return false;
    }
    
  } catch (error) {
    console.error('❌ Firebase test failed:', error.message);
    return false;
  }
}

// Run the test
testFirebaseConnection()
  .then(result => {
    console.log(`\n=== Result: ${result ? 'SUCCESS' : 'FAILED'} ===`);
    process.exit(result ? 0 : 1);
  })
  .catch(error => {
    console.error('Test execution failed:', error);
    process.exit(1);
  });
