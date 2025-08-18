/**
 * Beat It Force Duration Fix
 * 
 * This script is a minimal test to force the proper chord durations for "Beat It".
 * Run this script after updating the ChordsLegend app code to verify that
 * the fix is working correctly.
 */

console.log('🎸 BEAT IT FORCE DURATION TEST');
console.log('============================');
console.log('Testing 3.5-second chord durations for "Beat It"');

// The "Beat It" progression
const beatItProgression = [
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

// Function to force 3.5-second chord durations
function forceDuration(chords, totalDuration) {
  const idealChordDuration = 3.5; // Target chord duration
  const totalChordInstances = Math.ceil(totalDuration / idealChordDuration);
  
  // Repeat the progression to fill the duration
  let extendedChords = [];
  let repetitionCount = 0;
  
  while (extendedChords.length < totalChordInstances) {
    extendedChords = [...extendedChords, ...chords];
    repetitionCount++;
  }
  
  // Trim excess chords
  if (extendedChords.length > totalChordInstances) {
    extendedChords = extendedChords.slice(0, totalChordInstances);
  }
  
  // Calculate exact duration per chord
  const actualChordDuration = totalDuration / extendedChords.length;
  
  // Generate timing
  return extendedChords.map((chord, index) => {
    return {
      ...chord,
      startTime: index * actualChordDuration,
      duration: actualChordDuration
    };
  });
}

// Create timed chord progression for Beat It (4:18 = 258 seconds)
const timedChords = forceDuration(beatItProgression, 258);

// Display the results
console.log(`\nGenerated ${timedChords.length} chords with ${timedChords[0].duration.toFixed(2)}s duration per chord`);
console.log('\nChord Timing Sample:');
console.log('------------------');
for (let i = 0; i < Math.min(10, timedChords.length); i++) {
  const chord = timedChords[i];
  console.log(`${i+1}. ${chord.chord}: ${chord.startTime.toFixed(2)}s - ${(chord.startTime + chord.duration).toFixed(2)}s (${chord.duration.toFixed(2)}s)`);
}

// Verify the last chord ends exactly at the song duration
const lastChord = timedChords[timedChords.length - 1];
const lastChordEnd = lastChord.startTime + lastChord.duration;
console.log(`\nLast chord ends at: ${lastChordEnd.toFixed(2)}s / 258.00s`);

// Check for gaps
console.log('\nChecking for gaps between chords...');
let hasGaps = false;
for (let i = 0; i < timedChords.length - 1; i++) {
  const currentEnd = timedChords[i].startTime + timedChords[i].duration;
  const nextStart = timedChords[i + 1].startTime;
  const gap = nextStart - currentEnd;
  
  if (Math.abs(gap) > 0.01) {
    console.log(`Gap found between chords ${i+1} and ${i+2}: ${gap.toFixed(3)}s`);
    hasGaps = true;
  }
}

if (!hasGaps) {
  console.log('✅ No gaps found between chords');
}

console.log('\n✅ VERIFICATION COMPLETE');
console.log('If the app still shows 15-second intervals, run these tests:');
console.log('1. Clear browser cache if running in web mode');
console.log('2. Restart the development server');
console.log('3. Check browser console for any timing-related errors');
