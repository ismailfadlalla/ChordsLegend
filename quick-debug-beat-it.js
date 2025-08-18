// Quick Debug - Test the chord progression generation for Beat It
console.log('🔍 QUICK DEBUG - Testing Beat It chord progression generation');

// Import the analyzer
const { ProfessionalChordAnalyzer } = require('./src/services/professionalChordAnalysis.ts');

async function testBeatItGeneration() {
  try {
    console.log('🎵 Testing Beat It analysis...');
    
    const result = await ProfessionalChordAnalyzer.analyzeYouTubeVideo(
      'beat-it-test',
      'Beat It',
      { useChordAPI: false }
    );
    
    console.log('📊 RESULTS:');
    console.log(`🎵 Song: ${result.songTitle}`);
    console.log(`📈 Total chords: ${result.chordProgression.length}`);
    console.log(`⏱️ Method: ${result.analysisMethod}`);
    
    // Check chord durations
    const durations = result.chordProgression.map(c => c.duration);
    const avgDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
    const maxDuration = Math.max(...durations);
    const minDuration = Math.min(...durations);
    
    console.log(`📊 TIMING ANALYSIS:`);
    console.log(`   Average: ${avgDuration.toFixed(2)}s`);
    console.log(`   Range: ${minDuration.toFixed(2)}s - ${maxDuration.toFixed(2)}s`);
    
    // Show first few chords
    console.log(`🎸 FIRST 5 CHORDS:`);
    result.chordProgression.slice(0, 5).forEach((chord, i) => {
      console.log(`   ${i+1}. ${chord.chord}: ${chord.startTime.toFixed(1)}s - ${(chord.startTime + chord.duration).toFixed(1)}s (${chord.duration.toFixed(1)}s)`);
    });
    
    // Check for the 15s issue
    if (avgDuration > 10) {
      console.log('❌ STILL HAS 15s ISSUE!');
    } else if (avgDuration >= 3 && avgDuration <= 4) {
      console.log('✅ Perfect ~3.5s timing achieved!');
    } else {
      console.log(`⚠️ Unusual timing: ${avgDuration.toFixed(1)}s per chord`);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testBeatItGeneration();
