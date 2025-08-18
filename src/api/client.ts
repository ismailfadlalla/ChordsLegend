// Use local backend for testing since your Flask server is running on port 5000
const API_BASE = 'https://chordslegend.up.railway.app';

export const apiCall = async (endpoint: string, method: string = 'GET', data?: any) => {
  const url = `${API_BASE}${endpoint}`;
  
  console.log(`🌐 Local API Call: ${method} ${url}`);
  console.log('📦 Request data:', data);
  
  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    console.log('📡 Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Response error:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Local API Response:', result);
    return result;
  } catch (error) {
    console.error('❌ Local API Error:', error);
    throw error;
  }
};