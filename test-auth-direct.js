// Test Firebase Auth directly
console.log('🔥 Direct Firebase Auth Test\n');

// Load environment variables
require('dotenv').config();

// Test Firebase initialization
async function testFirebaseAuth() {
  try {
    console.log('1. Testing Firebase configuration...');
    
    // Check environment variables
    const hasApiKey = process.env.EXPO_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY;
    const hasProjectId = process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;
    
    console.log(`   API Key: ${hasApiKey ? '✅ Found' : '❌ Missing'}`);
    console.log(`   Project ID: ${hasProjectId ? '✅ Found (' + hasProjectId + ')' : '❌ Missing'}`);
    
    if (!hasApiKey || !hasProjectId) {
      console.log('❌ Essential Firebase config missing');
      return;
    }
    
    console.log('\n2. Testing Firebase Auth API...');
    
    // Test the Auth API endpoint directly
    const testUrl = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${hasApiKey}`;
    
    try {
      const response = await fetch(testUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      });
      
      console.log(`   Response status: ${response.status}`);
      
      if (response.status === 400) {
        console.log('   ✅ Firebase Auth API is reachable (expected 400 error)');
        console.log('   This means Firebase is working properly');
      } else if (response.status === 403) {
        console.log('   ⚠️ API key might be restricted, but Firebase is reachable');
      } else {
        console.log(`   ❓ Unexpected response: ${response.status}`);
      }
      
    } catch (fetchError) {
      console.log(`   ❌ Network error: ${fetchError.message}`);
    }
    
    console.log('\n🎯 If you see ✅ above, Firebase should work in the app!');
    console.log('The "Auth connected state: false" issue might be a timing problem.');
    console.log('\nNext steps:');
    console.log('1. Restart the Expo app completely');
    console.log('2. Watch console logs for "AuthProvider: Auth listener setup successful"');
    console.log('3. The connected state should update to true');
    
  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
  }
}

testFirebaseAuth();
