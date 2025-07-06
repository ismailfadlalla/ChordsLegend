// Quick Firebase config test
const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Firebase Configuration...\n');

// Test 1: Check .env file
console.log('1. Checking .env file...');
try {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const firebaseVars = envContent.split('\n').filter(line => line.includes('FIREBASE'));
    console.log(`✅ .env file exists with ${firebaseVars.length} Firebase variables`);
    
    // Check for specific variables
    const hasApiKey = envContent.includes('EXPO_PUBLIC_FIREBASE_API_KEY=');
    const hasProjectId = envContent.includes('EXPO_PUBLIC_FIREBASE_PROJECT_ID=');
    console.log(`   - EXPO_PUBLIC_FIREBASE_API_KEY: ${hasApiKey ? '✅' : '❌'}`);
    console.log(`   - EXPO_PUBLIC_FIREBASE_PROJECT_ID: ${hasProjectId ? '✅' : '❌'}`);
  } else {
    console.log('❌ .env file not found');
  }
} catch (error) {
  console.log('❌ Error reading .env:', error.message);
}

// Test 2: Check app.config.js
console.log('\n2. Checking app.config.js...');
try {
  const configPath = path.join(__dirname, 'app.config.js');
  if (fs.existsSync(configPath)) {
    console.log('✅ app.config.js exists');
    // Try to require it
    require('dotenv').config(); // Load .env
    delete require.cache[require.resolve('./app.config.js')]; // Clear cache
    const config = require('./app.config.js');
    
    if (config.extra && config.extra.FIREBASE_API_KEY) {
      console.log('✅ Firebase config loaded in app.config.js');
      console.log(`   - API Key: ${config.extra.FIREBASE_API_KEY ? 'Found' : 'Missing'}`);
      console.log(`   - Project ID: ${config.extra.FIREBASE_PROJECT_ID ? 'Found' : 'Missing'}`);
    } else {
      console.log('❌ Firebase config missing in app.config.js');
    }
  } else {
    console.log('❌ app.config.js not found');
  }
} catch (error) {
  console.log('❌ Error loading app.config.js:', error.message);
}

console.log('\n🏁 Configuration test complete!');
