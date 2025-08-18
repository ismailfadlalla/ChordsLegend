// Test script to understand the actual chord progression input structure
console.log('🎵 TESTING REAL CHORD PROGRESSION STRUCTURE\n');

// Simulate what might be the real chord progression for "Beat It" as it would come from analysis
const realBeatItProgression = [
  // Intro (8 seconds of instrumental)
  
  // Verse 1 starts
  { chord: 'Em', startTime: 8, duration: 4 },
  { chord: 'Am', startTime: 12, duration: 4 },
  { chord: 'Dm', startTime: 16, duration: 4 },
  { chord: 'G', startTime: 20, duration: 4 },
  
  // Verse continues
  { chord: 'Em', startTime: 24, duration: 4 },
  { chord: 'Am', startTime: 28, duration: 4 },
  { chord: 'Dm', startTime: 32, duration: 4 },
  { chord: 'G', startTime: 36, duration: 4 },
  
  // Chorus (with rapid chord changes)
  { chord: 'C', startTime: 40, duration: 2 },
  { chord: 'G', startTime: 42, duration: 2 },
  { chord: 'Am', startTime: 44, duration: 2 },
  { chord: 'F', startTime: 46, duration: 2 },
  { chord: 'C', startTime: 48, duration: 2 },
  { chord: 'G', startTime: 50, duration: 2 },
  { chord: 'Am', startTime: 52, duration: 4 },
  
  // Instrumental break (no chords for 8 seconds)
  
  // Verse 2 starts at 64s
  { chord: 'Em', startTime: 64, duration: 4 },
  { chord: 'Am', startTime: 68, duration: 4 },
  { chord: 'Dm', startTime: 72, duration: 4 },
  { chord: 'G', startTime: 76, duration: 4 },
  
  // And so on...
];

console.log('🎵 EXAMPLE REAL CHORD PROGRESSION (with silences and varied timing):');
realBeatItProgression.forEach((chord, index) => {
  const endTime = chord.startTime + chord.duration;
  console.log(`${index + 1}. ${chord.chord}: ${chord.startTime}s - ${endTime}s (${chord.duration}s)`);
});

// Analyze the structure
console.log('\n🔍 STRUCTURE ANALYSIS:');

let previousEnd = 0;
realBeatItProgression.forEach((chord, index) => {
  if (chord.startTime > previousEnd) {
    const silence = chord.startTime - previousEnd;
    console.log(`🔇 SILENCE: ${silence}s gap before ${chord.chord} (${previousEnd}s - ${chord.startTime}s)`);
  }
  previousEnd = chord.startTime + chord.duration;
});

const totalDuration = 240; // 4 minutes
const lastEnd = realBeatItProgression[realBeatItProgression.length - 1].startTime + 
               realBeatItProgression[realBeatItProgression.length - 1].duration;

if (lastEnd < totalDuration) {
  console.log(`🔇 FINAL SILENCE: ${totalDuration - lastEnd}s at end of song (${lastEnd}s - ${totalDuration}s)`);
}

console.log('\n📊 SUMMARY:');
console.log(`Total chords: ${realBeatItProgression.length}`);
console.log(`Song duration: ${totalDuration}s`);
console.log(`Chord coverage: ${lastEnd}s`);
console.log(`Actual coverage: ${((lastEnd / totalDuration) * 100).toFixed(1)}%`);

// Test rapid chord changes
const rapidChanges = realBeatItProgression.filter(chord => chord.duration <= 2);
console.log(`Rapid changes (≤2s): ${rapidChanges.length}`);

const normalChords = realBeatItProgression.filter(chord => chord.duration > 2 && chord.duration <= 6);
console.log(`Normal chords (2-6s): ${normalChords.length}`);

const longChords = realBeatItProgression.filter(chord => chord.duration > 6);
console.log(`Long chords (>6s): ${longChords.length}`);
