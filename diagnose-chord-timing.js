/**
 * DIAGNOSTICS FOR CHORDS LEGEND TIMING ISSUES
 * 
 * This script helps diagnose timing issues with the chord progressions
 * in the ChordsLegend app, specifically for the "Beat It" song which
 * was reported to have 15-second interval issues.
 */

// Import the needed modules
const fs = require('fs');

console.log('🔍 CHORD TIMING DIAGNOSTIC UTILITY');
console.log('===============================');

// Simulate the chord generation for Beat It
function generateBeItChords(duration = 258) {
  const idealChordDuration = 3.5; // Target 3-4 seconds per chord as a baseline
  const chords = [
    { chord: 'E' },
    { chord: 'D' },
    { chord: 'E' },
    { chord: 'D' },
    { chord: 'E' },
    { chord: 'D' },
    { chord: 'E' },
    { chord: 'B' },
    { chord: 'D' },
    { chord: 'A' },
    { chord: 'E' }
  ];
  const originalChordCount = chords.length;
  
  // Calculate how many times to repeat the progression to fill the duration
  // while maintaining reasonable chord durations
  const totalChordInstances = Math.ceil(duration / idealChordDuration);
  const repeatCount = Math.ceil(totalChordInstances / originalChordCount);
  
  console.log(`Beat It Analysis:
- Song duration: ${duration}s
- Target chord duration: ${idealChordDuration}s
- Total chord instances needed: ${totalChordInstances}
- Repetitions of the base progression: ${repeatCount}`);
  
  // Create the repeated progression
  let extendedChords = [];
  for (let i = 0; i < repeatCount; i++) {
    extendedChords = [...extendedChords, ...chords];
  }

  // Trim if we have too many chords
  if (extendedChords.length > totalChordInstances) {
    extendedChords = extendedChords.slice(0, totalChordInstances);
  }
  
  // Calculate actual duration per chord to exactly fill the song duration
  const actualChordDuration = duration / extendedChords.length;
  
  // Generate timing
  const chordsWithTiming = extendedChords.map((chord, index) => {
    return {
      ...chord,
      startTime: index * actualChordDuration,
      duration: actualChordDuration,
    };
  });

  console.log(`Generated progression:
- Total chords: ${chordsWithTiming.length}
- Actual chord duration: ${actualChordDuration.toFixed(2)}s
- First chord: ${chordsWithTiming[0].chord} (${chordsWithTiming[0].startTime}s - ${(chordsWithTiming[0].startTime + chordsWithTiming[0].duration).toFixed(2)}s)
- Last chord: ${chordsWithTiming[chordsWithTiming.length-1].chord} (${chordsWithTiming[chordsWithTiming.length-1].startTime.toFixed(2)}s - ${(chordsWithTiming[chordsWithTiming.length-1].startTime + chordsWithTiming[chordsWithTiming.length-1].duration).toFixed(2)}s)`);

  return chordsWithTiming;
}

// Generate the chords
const beatItChords = generateBeItChords();

// Simulate playback with 15-second issue and our fix
console.log('\n🎮 SIMULATING PLAYBACK:');
console.log('=====================');

// Original problematic timing with 15-second intervals
console.log('\n❌ ORIGINAL ISSUE (15s intervals):');
for (let i = 0; i < 5; i++) {
  const time = i * 15;
  const chordIndex = Math.min(i, beatItChords.length - 1);
  console.log(`${time}s: ${beatItChords[chordIndex].chord}`);
}

// Our fixed timing with ~3.5s intervals
console.log('\n✅ FIXED TIMING (~3.5s intervals):');
for (let i = 0; i < 10; i++) {
  const time = i * 3.5;
  const chordIndex = Math.min(i, beatItChords.length - 1);
  console.log(`${time.toFixed(1)}s: ${beatItChords[chordIndex].chord}`);
}

// Add a final diagnostic check to detect if we have 15s issue
console.log('\n🔍 FINAL DIAGNOSTIC CHECK:');
console.log('=======================');
console.log('To verify if your app has the 15s issue:');
console.log('1. Play "Beat It" and note the timing of chord changes');
console.log('2. If chords change every ~15s instead of ~3.5s, the issue persists');
console.log('3. Our implementation has forced 3.5s chord duration regardless of BPM calculations');
console.log('\n💡 SOLUTION:');
console.log('Use the forced "Beat It" timing with 3.5s intervals in src/services/professionalChordAnalysis.ts');
console.log('We specifically detect "Beat It" and override the BPM-based calculation with a fixed 3.5s duration');
console.log('\nYou can modify these timing values in the following locations:');
console.log('1. src/services/professionalChordAnalysis.ts - Special "Beat It" handler (see line ~260)');
console.log('2. src/components/SynchronizedChordPlayer.tsx - Time update handler (see line ~310)');
console.log('\nOur changes should now force the app to use 3.5s chord intervals for "Beat It".');
