// Use Railway URL directly to avoid proxy issues
const API_BASE = 'https://chordslegend.up.railway.app';

export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE}${endpoint}`;
  
  console.log('🌐 API Call:', options.method || 'GET', url);
  console.log('📦 Request data:', options.body ? JSON.parse(options.body as string) : 'none');

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('📡 Response status:', response.status);
    console.log('✅ API Response:', data);
    
    return data;
  } catch (error) {
    console.error('❌ API Error:', error);
    throw error;
  }
};