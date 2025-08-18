/**
 * Test real audio analysis end-to-end
 */

const testRealAnalysis = async () => {
  try {
    console.log('🧪 Testing real audio analysis...');
    
    // Test with a simple song
    const testUrl = 'https://www.youtube.com/watch?v=oRdxUFDoQe0'; // Beat It
    
    const response = await fetch('http://127.0.0.1:5000/api/analyze-song', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: testUrl,
        real: true,
        useRealAnalysis: true,
        enableRealTimeDetection: true
      }),
    });
    
    console.log('📡 Response status:', response.status);
    
    const data = await response.json();
    console.log('📊 Response data:', data);
    
    if (data.status === 'success' && data.chords) {
      console.log(`✅ SUCCESS: Found ${data.chords.length} chords`);
      console.log('🎵 First 5 chords:', data.chords.slice(0, 5));
      console.log('🔑 Key:', data.key);
      console.log('🥁 BPM:', data.bpm);
      return true;
    } else {
      console.log('❌ FAILED: No chords found or error occurred');
      console.log('Error:', data.error);
      return false;
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    return false;
  }
};

// Run the test
testRealAnalysis().then(success => {
  console.log('\n🏁 Test Result:', success ? 'PASSED' : 'FAILED');
});

export default testRealAnalysis;
