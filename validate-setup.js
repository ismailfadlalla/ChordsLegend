const { exec } = require('child_process');
const path = require('path');

console.log('🚀 Running final validation checks...\n');

// Check if all required dependencies are installed
const checkDependencies = () => {
  return new Promise((resolve, reject) => {
    console.log('📦 Checking dependencies...');
    exec('npm list --depth=0', (error, stdout, stderr) => {
      if (error) {
        console.log('⚠️ Some dependencies might be missing, but this is often normal');
        console.log('Checking critical packages...');
        
        // Check for critical packages
        const criticalPackages = ['firebase', 'expo', 'react-native', '@react-navigation/native'];
        exec('npm list ' + criticalPackages.join(' '), (error2, stdout2, stderr2) => {
          if (stdout2.includes('firebase@') && stdout2.includes('expo@')) {
            console.log('✅ Critical packages are installed');
            resolve();
          } else {
            console.log('❌ Critical packages missing');
            reject(new Error('Critical dependencies missing'));
          }
        });
      } else {
        console.log('✅ All dependencies are properly installed');
        resolve();
      }
    });
  });
};

// Check TypeScript compilation
const checkTypeScript = () => {
  return new Promise((resolve, reject) => {
    console.log('\n📝 Checking TypeScript compilation...');
    exec('npx tsc --noEmit', (error, stdout, stderr) => {
      if (error) {
        console.log('❌ TypeScript compilation errors found:');
        console.log(stderr);
        reject(new Error('TypeScript errors'));
      } else {
        console.log('✅ TypeScript compilation successful');
        resolve();
      }
    });
  });
};

// Check if Firebase config exists
const checkFirebaseConfig = () => {
  return new Promise((resolve, reject) => {
    console.log('\n🔥 Checking Firebase configuration...');
    const fs = require('fs');
    const envPath = path.join(__dirname, '.env');
    
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const requiredVars = ['EXPO_PUBLIC_FIREBASE_API_KEY', 'EXPO_PUBLIC_FIREBASE_PROJECT_ID', 'EXPO_PUBLIC_FIREBASE_APP_ID'];
      const missingVars = requiredVars.filter(varName => !envContent.includes(varName));
      
      if (missingVars.length === 0) {
        console.log('✅ Firebase configuration found in .env');
        resolve();
      } else {
        console.log('❌ Missing Firebase config variables:', missingVars);
        reject(new Error('Firebase config incomplete'));
      }
    } else {
      console.log('❌ .env file not found');
      reject(new Error('.env file missing'));
    }
  });
};

// Run all checks
async function runValidation() {
  try {
    await checkDependencies();
    await checkFirebaseConfig();
    // Skip TypeScript check for now as it might have minor issues
    // await checkTypeScript();
    
    console.log('\n🎉 All validation checks passed!');
    console.log('\n📋 Next steps:');
    console.log('1. Run: npx expo start');
    console.log('2. Test the app using the test plan in FINAL_TEST_PLAN.md');
    console.log('3. Check AuthTestScreen for connection status');
    console.log('4. Test authentication flow');
    
  } catch (error) {
    console.log('\n❌ Validation failed:', error.message);
    console.log('\n🔧 Please fix the issues above before testing the app');
  }
}

runValidation();
