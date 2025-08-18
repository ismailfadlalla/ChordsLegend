// Test API connectivity from the same environment as the React app
import { analyzeChords } from './src/api/chords.js';

const testChordAPI = async () => {
  console.log('🧪 Testing chord API from React environment...');
  
  try {
    const result = await analyzeChords('https://www.youtube.com/watch?v=oRdxUFDoQe0');
    console.log('✅ API Test Success:', result);
  } catch (error) {
    console.error('❌ API Test Failed:', error);
  }
};

testChordAPI();
