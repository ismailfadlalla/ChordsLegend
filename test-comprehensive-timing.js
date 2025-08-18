/**
 * Comprehensive Test Script for Chord Timing and Synchronization
 * 
 * This script tests the timing logic for chord progression generation, 
 * focusing on ensuring realistic durations, complete song coverage,
 * and appropriate chord counts.
 */

// Note: This test is standalone and doesn't require TypeScript imports
// Instead, we'll recreate the timing function here for testing purposes

/**
 * Generate realistic timing for chord progression
 * This is a copy of the function in professionalChordAnalysis.ts for testing
 */
function generateRealisticTiming({ chords, duration }) {
  // Ensure we have valid input
  if (!Array.isArray(chords) || chords.length === 0 || !duration || duration <= 0) {
    return {
      chordsWithTiming: [],
      totalDuration: 0
    };
  }

  // Calculate how many complete progressions can fit
  // Based on ideal chord duration
  const idealChordDuration = 3.5; // Target 3-4 seconds per chord as a baseline
  const originalChordCount = chords.length;
  
  // Calculate how many times to repeat the progression to fill the duration
  // while maintaining reasonable chord durations
  const totalChordInstances = Math.ceil(duration / idealChordDuration);
  const repeatCount = Math.ceil(totalChordInstances / originalChordCount);
  
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

  return {
    chordsWithTiming,
    totalDuration: duration
  };
}

// Test songs with different durations and chord complexity
const SONGS_TO_TEST = [
  {
    name: 'Beat It',
    duration: 258, // 4:18 in seconds
    chords: ['E', 'D', 'E', 'D', 'E', 'D', 'E', 'B', 'D', 'A', 'E'],
    expectedChordCount: 75, // Approximate, based on 3.5s per chord
    minChordDuration: 2.5, // Minimum acceptable chord duration
    maxChordDuration: 5.0  // Maximum acceptable chord duration
  },
  {
    name: 'Short Test',
    duration: 60, // 1 minute song
    chords: ['C', 'G', 'Am', 'F'],
    expectedChordCount: 15, // Approximate, based on 4s per chord
    minChordDuration: 2.0,
    maxChordDuration: 6.0
  },
  {
    name: 'Long Complex Song',
    duration: 480, // 8 minutes
    chords: ['Em', 'C', 'G', 'D', 'Am', 'B7', 'Cmaj7', 'F#m'],
    expectedChordCount: 120, // Approximate
    minChordDuration: 3.0,
    maxChordDuration: 5.0
  }
];

/**
 * Tests timing generation for a song
 * @param {Object} song - The song to test
 * @returns {boolean} - Whether all tests passed
 */
function testSongTiming(song) {
  console.log(`\n===== Testing timing for "${song.name}" =====`);
  console.log(`Song duration: ${song.duration}s, Chord count: ${song.chords.length}`);
  
  // Generate timing for the song
  const timingResult = generateRealisticTiming({
    chords: song.chords.map(chord => ({ chord })),
    duration: song.duration,
  });
  
  // Check for array with timing and total duration
  if (!Array.isArray(timingResult.chordsWithTiming)) {
    console.error("❌ Failed: Result doesn't contain chordsWithTiming array");
    return false;
  }
  
  const generatedChords = timingResult.chordsWithTiming;
  
  // Test 1: Verify the chord count makes sense
  const chordCount = generatedChords.length;
  console.log(`Generated ${chordCount} chord instances (original unique chords: ${song.chords.length})`);
  const isChordCountReasonable = chordCount >= song.chords.length && 
                                chordCount <= song.expectedChordCount * 1.5;
  console.log(`${isChordCountReasonable ? '✅' : '❌'} Chord count is reasonable`);
  
  // Test 2: Verify first chord starts at beginning
  const firstChordStart = generatedChords[0].startTime;
  const firstChordCorrect = firstChordStart === 0;
  console.log(`${firstChordCorrect ? '✅' : '❌'} First chord starts at 0s (actual: ${firstChordStart}s)`);
  
  // Test 3: Verify last chord ends at song duration
  const lastChord = generatedChords[generatedChords.length - 1];
  const lastChordEnd = lastChord.startTime + lastChord.duration;
  const lastChordCorrect = Math.abs(lastChordEnd - song.duration) < 0.1;
  console.log(`${lastChordCorrect ? '✅' : '❌'} Last chord ends at song duration: ${lastChordEnd}s vs ${song.duration}s (diff: ${Math.abs(lastChordEnd - song.duration)}s)`);
  
  // Test 4: Check for chord durations within reasonable limits
  let allDurationsReasonable = true;
  let minDuration = Infinity;
  let maxDuration = 0;
  let totalDuration = 0;
  
  generatedChords.forEach((chord, index) => {
    if (chord.duration < song.minChordDuration || chord.duration > song.maxChordDuration) {
      allDurationsReasonable = false;
    }
    minDuration = Math.min(minDuration, chord.duration);
    maxDuration = Math.max(maxDuration, chord.duration);
    totalDuration += chord.duration;
  });
  
  console.log(`${allDurationsReasonable ? '✅' : '⚠️'} Chord durations are within reasonable limits`);
  console.log(`   Min duration: ${minDuration.toFixed(2)}s, Max duration: ${maxDuration.toFixed(2)}s`);
  console.log(`   Average duration: ${(totalDuration / chordCount).toFixed(2)}s`);
  
  // Test 5: Verify no gaps or overlaps in timing
  let hasGapsOrOverlaps = false;
  let totalGapTime = 0;
  for (let i = 0; i < generatedChords.length - 1; i++) {
    const currentEnd = generatedChords[i].startTime + generatedChords[i].duration;
    const nextStart = generatedChords[i + 1].startTime;
    const gap = nextStart - currentEnd;
    
    if (Math.abs(gap) > 0.001) { // Allow tiny floating point differences
      hasGapsOrOverlaps = true;
      totalGapTime += Math.abs(gap);
      console.log(`   Gap/overlap at index ${i}: ${gap.toFixed(3)}s`);
    }
  }
  
  console.log(`${!hasGapsOrOverlaps ? '✅' : '❌'} No significant gaps or overlaps in timing (total: ${totalGapTime.toFixed(3)}s)`);
  
  // Test 6: Verify chord progression repeats in original order
  const originalPattern = song.chords.join('');
  let generatedPattern = '';
  generatedChords.forEach(c => {
    generatedPattern += c.chord;
  });
  
  const patternRepeats = generatedPattern.includes(originalPattern);
  console.log(`${patternRepeats ? '✅' : '❌'} Generated progression contains the original pattern`);
  
  // Final summary
  const allTestsPassed = isChordCountReasonable && firstChordCorrect && lastChordCorrect && 
                        allDurationsReasonable && !hasGapsOrOverlaps && patternRepeats;
  
  console.log(`\n${allTestsPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'} for "${song.name}"`);
  return allTestsPassed;
}

// Run tests for all songs
let allPassed = true;
SONGS_TO_TEST.forEach(song => {
  allPassed = testSongTiming(song) && allPassed;
});

// Final summary
console.log('\n==========================================================');
console.log(`${allPassed ? '✅ ALL SONGS PASSED TIMING TESTS' : '❌ SOME SONGS FAILED TIMING TESTS'}`);
console.log('==========================================================');

process.exit(allPassed ? 0 : 1);
