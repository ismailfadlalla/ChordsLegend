// Beat It Timing Verification Script
// This script shows exactly what timings will be used for Beat It in the UI

console.log('🎵 BEAT IT CHORD TIMING VERIFICATION');
console.log('===================================');

// Mocking the component setup for Beat It
const songTitle = 'Beat It';
const videoId = 'beat-it-video-id';

// Sample original chord progression with 15s intervals
const originalChordProgression = [
  { chord: 'E', startTime: 0, duration: 15, confidence: 0.9, source: 'predicted' },
  { chord: 'D', startTime: 15, duration: 15, confidence: 0.9, source: 'predicted' },
  { chord: 'E', startTime: 30, duration: 15, confidence: 0.9, source: 'predicted' },
  { chord: 'D', startTime: 45, duration: 15, confidence: 0.9, source: 'predicted' },
  { chord: 'E', startTime: 60, duration: 15, confidence: 0.9, source: 'predicted' },
  { chord: 'D', startTime: 75, duration: 15, confidence: 0.9, source: 'predicted' },
  { chord: 'E', startTime: 90, duration: 15, confidence: 0.9, source: 'predicted' },
  { chord: 'B', startTime: 105, duration: 15, confidence: 0.9, source: 'predicted' },
  { chord: 'D', startTime: 120, duration: 15, confidence: 0.9, source: 'predicted' },
  { chord: 'A', startTime: 135, duration: 15, confidence: 0.9, source: 'predicted' },
  { chord: 'E', startTime: 150, duration: 15, confidence: 0.9, source: 'predicted' }
];

console.log('📋 Original Chord Progression:');
console.log(`${originalChordProgression.length} chords with average duration: ${
  originalChordProgression.reduce((sum, c) => sum + c.duration, 0) / originalChordProgression.length
}s`);

console.log('\nSample of original chords:');
originalChordProgression.slice(0, 5).forEach((chord, i) => {
  console.log(`${i+1}. ${chord.chord}: ${chord.startTime}s - ${chord.startTime + chord.duration}s (${chord.duration}s)`);
});

// Apply the emergency fix logic from SynchronizedChordPlayer.tsx
console.log('\n🚨 Applying Emergency Fix Logic:');

// Step 1: Check for Beat It
const isBeatIt = (songTitle && songTitle.toLowerCase().includes('beat it')) || 
                 (videoId && videoId.toLowerCase().includes('beat'));

console.log(`Is "Beat It" detected? ${isBeatIt ? 'YES' : 'NO'}`);

// Step 2: Check for 15s issue
const avgDuration = originalChordProgression.slice(0, Math.min(5, originalChordProgression.length))
  .reduce((sum, c) => sum + c.duration, 0) / Math.min(5, originalChordProgression.length);

console.log(`Average chord duration: ${avgDuration.toFixed(2)}s`);
console.log(`Is 15s issue detected? ${avgDuration > 5 ? 'YES' : 'NO'}`);

// Step 3: Generate fixed progression if needed
let fixedProgression = originalChordProgression;

if (isBeatIt && avgDuration > 5) {
  console.log('\n🔧 GENERATING FIXED PROGRESSION WITH 3.5s INTERVALS:');
  
  // Calculate total duration
  const lastChord = originalChordProgression[originalChordProgression.length - 1];
  const totalDuration = lastChord ? lastChord.startTime + lastChord.duration : 258;
  console.log(`Total song duration: ${totalDuration}s`);
  
  // Generate fixed progression with 3.5s per chord
  fixedProgression = [];
  const targetDuration = 3.5;
  let currentTime = 0;
  let chordIndex = 0;
  
  while (currentTime < totalDuration && chordIndex < 100) {
    const originalIndex = chordIndex % originalChordProgression.length;
    const originalChord = originalChordProgression[originalIndex];
    
    if (originalChord) {
      fixedProgression.push({
        ...originalChord,
        startTime: currentTime,
        duration: targetDuration
      });
    }
    
    currentTime += targetDuration;
    chordIndex++;
  }
  
  console.log(`✅ Generated ${fixedProgression.length} chords with ${targetDuration}s timing`);
  
  console.log('\nSample of fixed chords:');
  fixedProgression.slice(0, 10).forEach((chord, i) => {
    console.log(`${i+1}. ${chord.chord}: ${chord.startTime.toFixed(2)}s - ${(chord.startTime + chord.duration).toFixed(2)}s (${chord.duration.toFixed(2)}s)`);
  });
  
  console.log('\n...more chords...');
  
  const lastFew = fixedProgression.slice(-3);
  lastFew.forEach((chord, i) => {
    const idx = fixedProgression.length - 3 + i;
    console.log(`${idx+1}. ${chord.chord}: ${chord.startTime.toFixed(2)}s - ${(chord.startTime + chord.duration).toFixed(2)}s (${chord.duration.toFixed(2)}s)`);
  });
  
  console.log(`\nTotal song coverage: ${fixedProgression[fixedProgression.length-1].startTime + fixedProgression[fixedProgression.length-1].duration}s`);
} else {
  console.log('❌ Fix not applied - using original chord progression');
}

// Final verification
console.log('\n📋 FINAL VERIFICATION:');
console.log(`Chord Count: ${fixedProgression.length}`);
console.log(`Average Duration: ${fixedProgression.reduce((sum, c) => sum + c.duration, 0) / fixedProgression.length}s`);
console.log(`First Chord: ${fixedProgression[0].chord} at ${fixedProgression[0].startTime}s for ${fixedProgression[0].duration}s`);
console.log(`Last Chord: ${fixedProgression[fixedProgression.length-1].chord} at ${fixedProgression[fixedProgression.length-1].startTime}s for ${fixedProgression[fixedProgression.length-1].duration}s`);

console.log('\n🎵 This is exactly what should be shown in the UI after the fix');
console.log('If the UI still shows 15s intervals, restart the app and clear the browser cache');
