// Test script to verify Beat It chord analysis
const { ProfessionalChordAnalyzer } = require('./src/services/professionalChordAnalysis.ts');

async function testBeatItAnalysis() {
  console.log('🧪 Testing Beat It chord analysis...');
  
  try {
    const analysis = await ProfessionalChordAnalyzer.analyzeYouTubeVideo(
      'oRdxUFDoQe0', // Beat It video ID
      'Michael Jackson - Beat It',
      {
        useRealTimeDetection: true,
        useChordAPI: true,
        allowManualAdjustment: true,
        confidenceThreshold: 0.6
      }
    );
    
    console.log('✅ Analysis Result:');
    console.log('📊 Method:', analysis.analysisMethod);
    console.log('🎯 Confidence:', analysis.confidence);
    console.log('🎼 Key:', analysis.key);
    console.log('🥁 BPM:', analysis.bpm);
    console.log('🎵 Total chords:', analysis.chordProgression.length);
    
    if (analysis.chordProgression.length > 0) {
      const lastChord = analysis.chordProgression[analysis.chordProgression.length - 1];
      const totalDuration = lastChord.startTime + lastChord.duration;
      console.log(`⏱️ Total duration: ${totalDuration}s (${Math.floor(totalDuration/60)}:${String(Math.floor(totalDuration%60)).padStart(2, '0')})`);
      
      console.log('\n🎼 First 10 chords:');
      analysis.chordProgression.slice(0, 10).forEach((chord, i) => {
        console.log(`  ${i+1}. ${chord.chord} at ${chord.startTime.toFixed(1)}s for ${chord.duration.toFixed(1)}s`);
      });
      
      console.log('\n🎼 Last 5 chords:');
      analysis.chordProgression.slice(-5).forEach((chord, i) => {
        const index = analysis.chordProgression.length - 5 + i;
        console.log(`  ${index+1}. ${chord.chord} at ${chord.startTime.toFixed(1)}s for ${chord.duration.toFixed(1)}s`);
      });
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testBeatItAnalysis();
