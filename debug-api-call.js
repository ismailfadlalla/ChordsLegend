/**
 * Debug test to see exactly what's happening with the API call
 */

const debugApiCall = async () => {
  try {
    console.log('🧪 Testing API call from web environment...');
    
    // Test direct fetch to the API
    const testUrl = 'https://www.youtube.com/watch?v=oRdxUFDoQe0';
    
    console.log('📡 Making request to: http://127.0.0.1:5000/api/analyze-song');
    console.log('📊 Request payload:', {
      url: testUrl,
      real: true,
      useRealAnalysis: true,
      enableRealTimeDetection: true
    });
    
    const response = await fetch('http://127.0.0.1:5000/api/analyze-song', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        url: testUrl,
        real: true,
        useRealAnalysis: true,
        enableRealTimeDetection: true
      })
    });
    
    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Error response:', errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('✅ Success! Response data:', data);
    
    // Check if we have chords
    if (data.chords && Array.isArray(data.chords)) {
      console.log(`🎵 Found ${data.chords.length} chords`);
      console.log('🎸 First chord:', data.chords[0]);
    } else {
      console.log('❌ No chords found in response');
    }
    
    return data;
    
  } catch (error) {
    console.error('💥 API test failed:', error);
    throw error;
  }
};

// Test on page load
debugApiCall();

export default debugApiCall;
