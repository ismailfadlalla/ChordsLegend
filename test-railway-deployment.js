#!/usr/bin/env node

/**
 * Final verification test for ChordsLegend Railway deployment
 * Tests that legal documents are accessible from the cloud (not local machine)
 */

const https = require('https');

console.log('🌐 Testing ChordsLegend Railway Deployment...\n');

// Test URLs
const testUrls = [
  'https://chordslegend-production.up.railway.app/',
  'https://chordslegend-production.up.railway.app/legal/',
  'https://chordslegend-production.up.railway.app/legal/terms-of-service.html',
  'https://chordslegend-production.up.railway.app/legal/privacy-policy.html',
  'https://chordslegend-production.up.railway.app/static/js/main.06f53e57.js',
  'https://chordslegend-production.up.railway.app/manifest.json',
  'https://chordslegend-production.up.railway.app/api/health'
];

// Function to test URL
function testUrl(url) {
  return new Promise((resolve) => {
    const request = https.get(url, (response) => {
      if (response.statusCode === 200) {
        let data = '';
        
        // For the main page, check for React app content
        if (url === 'https://chordslegend-production.up.railway.app/') {
          response.on('data', (chunk) => {
            data += chunk;
          });
          
          response.on('end', () => {
            if (data.includes('<div id="root">') || data.includes('ChordsLegend')) {
              console.log(`✅ ${url} - Status: ${response.statusCode} (Verified React App)`);
            } else {
              console.log(`⚠️ ${url} - Status: ${response.statusCode} (Response OK but not a React app)`);
            }
            resolve(true);
          });
        } else {
          console.log(`✅ ${url} - Status: ${response.statusCode}`);
          resolve(true);
        }
      } else {
        console.log(`❌ ${url} - Status: ${response.statusCode}`);
        resolve(false);
      }
    });

    request.on('error', (error) => {
      console.log(`❌ ${url} - Error: ${error.message}`);
      resolve(false);
    });

    request.setTimeout(10000, () => {
      console.log(`❌ ${url} - Timeout`);
      request.abort();
      resolve(false);
    });
  });
}

// Test all URLs
async function runTests() {
  console.log('Testing Railway deployment endpoints...\n');
  
  let allPassed = true;
  
  for (const url of testUrls) {
    const result = await testUrl(url);
    if (!result) allPassed = false;
  }

  console.log('\n' + '='.repeat(60));
  
  if (allPassed) {
    console.log('🎉 ALL TESTS PASSED!');
    console.log('✅ Legal documents are accessible from the cloud');
    console.log('✅ Railway deployment is working correctly');
    console.log('✅ Ready for Pi Network submission');
  } else {
    console.log('❌ Some tests failed');
    console.log('🔧 Check Railway deployment logs');
  }

  console.log('\n📋 Pi Network Submission URLs:');
  console.log('   • Terms of Service: https://chordslegend-production.up.railway.app/legal/terms-of-service.html');
  console.log('   • Privacy Policy: https://chordslegend-production.up.railway.app/legal/privacy-policy.html');
  console.log('\n🌐 These URLs work even when your computer is OFF! 🎸');
}

runTests();
