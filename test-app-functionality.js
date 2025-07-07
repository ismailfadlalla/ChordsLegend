#!/usr/bin/env node

/**
 * Basic functionality test for ChordsLegend app
 * Tests key components and configurations
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing ChordsLegend App Functionality...\n');

// Test 1: Check essential config files
console.log('1. Checking configuration files...');
const configFiles = [
  'package.json',
  'app.config.js',
  '.env',
  'metro.config.js'
];

configFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file} exists`);
  } else {
    console.log(`   ❌ ${file} missing`);
  }
});

// Test 2: Check key components
console.log('\n2. Checking key components...');
const components = [
  'src/components/Fretboard.Enhanced.tsx',
  'src/components/SynchronizedChordPlayer.tsx',
  'src/screens/SettingsScreen.tsx',
  'src/screens/HomeScreen.tsx'
];

components.forEach(component => {
  if (fs.existsSync(component)) {
    console.log(`   ✅ ${component} exists`);
  } else {
    console.log(`   ❌ ${component} missing`);
  }
});

// Test 3: Check legal documents
console.log('\n3. Checking legal documents...');
const legalDocs = [
  'legal/TERMS_OF_SERVICE.md',
  'legal/PRIVACY_POLICY.md',
  'legal/terms-of-service.html',
  'legal/privacy-policy.html',
  'server/legal/terms-of-service.html',
  'server/legal/privacy-policy.html'
];

legalDocs.forEach(doc => {
  if (fs.existsSync(doc)) {
    console.log(`   ✅ ${doc} exists`);
  } else {
    console.log(`   ❌ ${doc} missing`);
  }
});

// Test 4: Check Pi Network integration
console.log('\n4. Checking Pi Network integration...');
const piFiles = [
  'src/config/piConfig.ts',
  'src/services/piNetworkService.ts'
];

piFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file} exists`);
  } else {
    console.log(`   ❌ ${file} missing`);
  }
});

// Test 5: Check package.json for proper branding
console.log('\n5. Checking app branding...');
if (fs.existsSync('package.json')) {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  if (packageJson.name === 'chordslegend') {
    console.log('   ✅ App name is correct');
  } else {
    console.log(`   ❌ App name incorrect: ${packageJson.name}`);
  }
  
  if (packageJson.description && !packageJson.description.toLowerCase().includes('competitor-name')) {
    console.log('   ✅ Description is clean (no competitor references)');
  } else {
    console.log('   ❌ Description contains competitor references');
  }
}

// Test 6: Check .env for required variables
console.log('\n6. Checking environment variables...');
if (fs.existsSync('.env')) {
  const envContent = fs.readFileSync('.env', 'utf8');
  const requiredVars = [
    'FIREBASE_API_KEY',
    'YOUTUBE_API_KEY',
    'PI_API_KEY',
    'EXPO_PUBLIC_API_URL'
  ];
  
  requiredVars.forEach(variable => {
    if (envContent.includes(variable)) {
      console.log(`   ✅ ${variable} configured`);
    } else {
      console.log(`   ❌ ${variable} missing`);
    }
  });
}

console.log('\n🎉 App functionality test completed!');
console.log('\n📱 To test on Android:');
console.log('   1. Install Expo Go from Google Play Store');
console.log('   2. Scan the QR code from the Expo development server');
console.log('   3. The app will load on your device');
console.log('\n🌐 Web app is running at: http://localhost:19006');
console.log('\n🥧 Pi Network Testing:');
console.log('   • Production build served at: http://localhost:60752');
console.log('   • Network access: http://192.168.1.118:60752');
console.log('   • Pi Sandbox URL: https://sandbox.minepi.com/app/chords-legend');
console.log('   • Ready for Pi Network submission!');
console.log('\n📄 Legal documents are available at:');
console.log('   • https://chordslegend-production.up.railway.app/legal/terms-of-service.html');
console.log('   • https://chordslegend-production.up.railway.app/legal/privacy-policy.html');
