// Simple test to check if Flask API is working
const testAPI = async () => {
  try {
    console.log('🧪 Testing Flask API...');
    
    const response = await fetch('http://127.0.0.1:5000/api/analyze-song', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        url: 'https://www.youtube.com/watch?v=oRdxUFDoQe0',
        real: true
      }),
    });

    console.log('📡 Response status:', response.status);
    console.log('📡 Response ok:', response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', errorText);
      return;
    }
    
    const data = await response.json();
    console.log('✅ API Response:', data);
    
  } catch (error) {
    console.error('❌ Network Error:', error);
  }
};

testAPI();
