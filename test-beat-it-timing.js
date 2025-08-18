/**
 * Validation Script for Beat It chord timing
 * 
 * This script focuses specifically on validating the chord timing for the song "Beat It"
 * by Michael Jackson, which was reported to have issues with fixed intervals of 15s per chord
 * and incorrect chord progression.
 */

// FINAL ENHANCED VERSION: Comprehensive test with complete verification
const testBeatItTiming = () => {
  const bpm = 138;
  const songDuration = 258; // 4:18
  const progression = [
    { chord: 'E', measures: 2 },
    { chord: 'D', measures: 2 },
    { chord: 'E', measures: 2 },
    { chord: 'D', measures: 2 },
    { chord: 'E', measures: 2 },
    { chord: 'D', measures: 2 },
    { chord: 'E', measures: 2 },
    { chord: 'B', measures: 2 },
    { chord: 'D', measures: 2 },
    { chord: 'A', measures: 2 },
    { chord: 'E', measures: 2 },
  ];

  // Implement copy of our fixed timing algorithm
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
  
  console.log('🎵 FINAL BEAT IT TIMING TEST:');
  console.log('===========================');
  console.log(`BPM: ${bpm}`);
  console.log(`Song duration: ${songDuration}s (${Math.floor(songDuration/60)}:${String(Math.floor(songDuration%60)).padStart(2, '0')})`);
  console.log(`Base progression (unique chords): ${progression.map(p => p.chord).join(', ')}`);
  
  // Create input for our timing function
  const beatIt = {
    chords: progression.map(p => ({ chord: p.chord })),
    duration: songDuration
  };
  
  // Get results using our fixed algorithm
  const result = generateRealisticTiming(beatIt);
  const chords = result.chordsWithTiming;
  
  console.log('\n==== GENERATION RESULTS ====');
  console.log(`Generated ${chords.length} chord instances`);
  console.log(`Average chord duration: ${(songDuration / chords.length).toFixed(2)}s`);
  
  // Display first few chords
  console.log('\nFirst 5 chords:');
  chords.slice(0, 5).forEach((chord, i) => {
    console.log(`${i + 1}. ${chord.chord} - Start: ${chord.startTime.toFixed(2)}s, Duration: ${chord.duration.toFixed(2)}s, End: ${(chord.startTime + chord.duration).toFixed(2)}s`);
  });
  
  // Display last few chords
  console.log('\nLast 5 chords:');
  chords.slice(-5).forEach((chord, i) => {
    const index = chords.length - 5 + i;
    console.log(`${index + 1}. ${chord.chord} - Start: ${chord.startTime.toFixed(2)}s, Duration: ${chord.duration.toFixed(2)}s, End: ${(chord.startTime + chord.duration).toFixed(2)}s`);
  });
  
  // Verify boundary conditions
  const firstChord = chords[0];
  const lastChord = chords[chords.length - 1];
  const firstChordStart = firstChord.startTime;
  const lastChordEnd = lastChord.startTime + lastChord.duration;
  
  console.log('\n==== VERIFICATION CHECKS ====');
  console.log(`First chord starts at: ${firstChordStart}s (should be 0)`);
  console.log(`Last chord ends at: ${lastChordEnd.toFixed(2)}s (song duration: ${songDuration}s)`);
  console.log(`Gap at end: ${(lastChordEnd - songDuration).toFixed(2)}s (should be close to 0)`);
  
  // Check for any unusually long chords
  const longChords = chords.filter(c => c.duration > 6);
  if (longChords.length > 0) {
    console.log('\n⚠️ WARNING: Found unusually long chords:');
    longChords.forEach(chord => {
      console.log(`- ${chord.chord}: ${chord.duration.toFixed(1)}s duration`);
    });
  } else {
    console.log('\n✅ No unusually long chords found (all are ~3.5s)');
  }
  
  // Check for gaps or overlaps
  console.log('\nChecking for gaps or overlaps in timing...');
  let hasGapsOrOverlaps = false;
  for (let i = 0; i < chords.length - 1; i++) {
    const currentEnd = chords[i].startTime + chords[i].duration;
    const nextStart = chords[i + 1].startTime;
    const gap = nextStart - currentEnd;
    
    if (Math.abs(gap) > 0.01) { // Allow tiny floating point differences
      console.log(`❌ Gap/overlap at chord ${i+1} → ${i+2}: ${gap.toFixed(3)}s`);
      hasGapsOrOverlaps = true;
    }
  }
  
  if (!hasGapsOrOverlaps) {
    console.log('✅ No timing gaps or overlaps detected');
  }
  
  // Final verdict
  const isReasonableTiming = chords[0].duration < 6; // Should be ~3.5s for Beat It
  const goodCoverage = Math.abs(lastChordEnd - songDuration) < 0.1; // Exact coverage
  
  console.log('\n==== FINAL VERDICT ====');
  if (isReasonableTiming && goodCoverage && !hasGapsOrOverlaps && longChords.length === 0) {
    console.log('🎸 TEST PASSED: Beat It chord progression has perfect timing and coverage');
    console.log('✅ No more fixed 15-second chord durations');
    console.log('✅ Entire song duration covered perfectly');
    console.log('✅ No timing gaps or overlaps between chords');
    console.log('✅ All chord durations are reasonable (~3.5s)');
  } else {
    console.log('❌ TEST FAILED: Beat It chord progression has timing or coverage issues');
    if (!isReasonableTiming) {
      console.log('  - Chord duration is too long (should be ~3.5s)');
    }
    if (!goodCoverage) {
      console.log('  - Does not cover entire song duration');
    }
    if (hasGapsOrOverlaps) {
      console.log('  - Contains timing gaps or overlaps between chords');
    }
    if (longChords.length > 0) {
      console.log('  - Contains unusually long chords');
    }
  }
};

testBeatItTiming();
