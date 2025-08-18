/**
 * Test the Flask server directly to verify it's working
 */

// Test the API connection
const testAPI = async () => {
  try {
    console.log('🧪 Testing API connection...');
    
    // Test 1: Health check
    const healthResponse = await fetch('http://127.0.0.1:5000/api/health', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!healthResponse.ok) {
      throw new Error(`Health check failed: ${healthResponse.status}`);
    }
    
    const healthData = await healthResponse.json();
    console.log('✅ Health check passed:', healthData);
    
    // Test 2: Mock chord analysis
    const analyzeResponse = await fetch('http://127.0.0.1:5000/api/analyze-song', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: 'https://www.youtube.com/watch?v=oRdxUFDoQe0', // Beat It
        real: false // Use mock analysis
      }),
    });
    
    if (!analyzeResponse.ok) {
      throw new Error(`Analyze request failed: ${analyzeResponse.status}`);
    }
    
    const analyzeData = await analyzeResponse.json();
    console.log('✅ Mock analysis passed:', analyzeData);
    
    return {
      success: true,
      health: healthData,
      analysis: analyzeData
    };
    
  } catch (error) {
    console.error('❌ API test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Run the test
testAPI().then(result => {
  console.log('🔬 Final test result:', result);
});

export default testAPI;
