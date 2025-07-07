// Test script to verify Firebase configuration
// Run this in a browser console to test if the Firebase project is accessible

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "your-api-key-here",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "your-auth-domain-here", 
  projectId: process.env.FIREBASE_PROJECT_ID || "your-project-id-here",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "your-storage-bucket-here",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "your-sender-id-here",
  appId: process.env.FIREBASE_APP_ID || "your-app-id-here"
};

// Test if we can reach the Firebase auth domain
async function testFirebaseAccess() {
  try {
    // Test 1: Check if auth domain is reachable
    const authDomainResponse = await fetch(`https://${firebaseConfig.authDomain}/__/auth/handler`);
    console.log('Auth domain reachable:', authDomainResponse.status === 200);
    
    // Test 2: Check Firebase Auth endpoint
    const authTestUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInAnonymously?key=${firebaseConfig.apiKey}`;
    const authResponse = await fetch(authTestUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        returnSecureToken: true
      })
    });
    
    console.log('Firebase Auth API response:', authResponse.status);
    const result = await authResponse.json();
    console.log('Firebase Auth test result:', result);
    
    if (result.error) {
      console.error('Firebase Auth error:', result.error);
      if (result.error.message.includes('OPERATION_NOT_ALLOWED')) {
        console.log('❌ Anonymous authentication is not enabled. This is normal.');
        console.log('✅ But the Firebase project is accessible and Auth is configured.');
        return true;
      }
      return false;
    }
    
    console.log('✅ Firebase project is accessible and working');
    return true;
    
  } catch (error) {
    console.error('❌ Firebase access test failed:', error);
    return false;
  }
}

// Run the test
testFirebaseAccess().then(success => {
  if (success) {
    console.log('🎉 Firebase configuration appears to be working!');
  } else {
    console.log('⚠️  There may be an issue with the Firebase configuration.');
  }
});
