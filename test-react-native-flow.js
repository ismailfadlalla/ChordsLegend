/**
 * Test the exact same flow as the React Native app
 */
import { analyzeChords } from './src/api/chords.js';

const testReactNativeFlow = async () => {
  try {
    console.log('🧪 Testing React Native app flow...');
    
    const testUrl = 'https://www.youtube.com/watch?v=oRdxUFDoQe0';
    console.log('📱 Calling analyzeChords with:', testUrl);
    
    // This is exactly what the React Native app calls
    const chordDataArray = await analyzeChords(testUrl);
    
    console.log('✅ analyzeChords returned:', chordDataArray);
    console.log('🔍 Type check:', typeof chordDataArray, Array.isArray(chordDataArray));
    
    if (!chordDataArray || chordDataArray.length === 0) {
      console.log('❌ No chord data returned');
      return false;
    }
    
    // Convert to chord progression format (same as React Native app)
    const chordProgression = chordDataArray.map((chordData, index) => ({
      chord: chordData.chord || 'C',
      startTime: chordData.time || (index * 4),
      duration: chordData.duration || 4,
      confidence: chordData.confidence || 0.8,
      source: 'detected'
    }));
    
    console.log('🎵 Converted chord progression:', chordProgression.slice(0, 3));
    console.log(`✅ SUCCESS: ${chordProgression.length} chords processed`);
    
    return true;
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('❌ Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return false;
  }
};

testReactNativeFlow();

export default testReactNativeFlow;
