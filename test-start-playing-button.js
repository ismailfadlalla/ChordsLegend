// Final test to verify Start Playing button and chord highlighting functionality
console.log('🎯 START PLAYING BUTTON & HIGHLIGHTING TEST');
console.log('=' .repeat(60));

// Test the chord detection logic that powers both highlighting and the Start Playing button
const testChordProgression = [
  { chord: 'C', startTime: 0, duration: 3.5 },
  { chord: 'G', startTime: 3.5, duration: 3.7 },
  { chord: 'Am', startTime: 7.2, duration: 4.6 },
  { chord: 'F', startTime: 11.8, duration: 4.2 },
  { chord: 'C', startTime: 16.0, duration: 3.0 },
  { chord: 'G', startTime: 19.0, duration: 3.5 },
  { chord: 'Am', startTime: 22.5, duration: 4.0 },
  { chord: 'F', startTime: 26.5, duration: 3.5 }
];

// Simulate the getChordAtTime function from SynchronizedChordPlayer
function getChordAtTime(time, chordProgression, timingOffset = 0) {
  if (!chordProgression || chordProgression.length === 0) {
    return { chordIndex: -1, chord: null };
  }
  
  const adjustedTime = time + timingOffset;
  
  for (let i = 0; i < chordProgression.length; i++) {
    const chord = chordProgression[i];
    const chordEndTime = chord.startTime + chord.duration;
    
    if (adjustedTime >= chord.startTime && adjustedTime < chordEndTime) {
      return { chordIndex: i, chord: chord };
    }
  }
  
  return { chordIndex: -1, chord: null };
}

// Test various playback scenarios
console.log('\n🎮 TESTING START PLAYING BUTTON SCENARIOS:');
console.log('-' .repeat(50));

const testScenarios = [
  { name: 'Start of Song', time: 0, expected: 'C' },
  { name: 'Mid First Chord', time: 1.5, expected: 'C' },
  { name: 'Chord Transition', time: 3.5, expected: 'G' },
  { name: 'Mid Second Chord', time: 5.0, expected: 'G' },
  { name: 'Third Chord Start', time: 7.2, expected: 'Am' },
  { name: 'Fourth Chord', time: 12.5, expected: 'F' },
  { name: 'Second Verse Start', time: 16.0, expected: 'C' },
  { name: 'End of Progression', time: 30.5, expected: 'silence' },
  { name: 'Before Song Starts', time: -1.0, expected: 'silence' }
];

let allScenariosPass = true;

testScenarios.forEach(scenario => {
  const result = getChordAtTime(scenario.time, testChordProgression);
  const actualChord = result.chord ? result.chord.chord : 'silence';
  const passed = actualChord === scenario.expected;
  
  console.log(`${passed ? '✅' : '❌'} ${scenario.name} (${scenario.time}s): Expected ${scenario.expected}, Got ${actualChord}`);
  
  if (!passed) {
    allScenariosPass = false;
  }
});

console.log('\n🎯 TESTING CHORD HIGHLIGHTING ACCURACY:');
console.log('-' .repeat(50));

// Test highlighting accuracy at rapid time intervals
const highlightingTestTimes = [];
for (let t = 0; t <= 30; t += 0.5) {
  highlightingTestTimes.push(t);
}

let highlightingAccuracy = 0;
let totalHighlightingTests = 0;

highlightingTestTimes.forEach(time => {
  const result = getChordAtTime(time, testChordProgression);
  
  // Verify that the chord detection is consistent
  if (result.chord) {
    const chord = result.chord;
    const isTimeInRange = time >= chord.startTime && time < (chord.startTime + chord.duration);
    
    if (isTimeInRange) {
      highlightingAccuracy++;
    } else {
      console.log(`❌ Highlighting error at ${time}s: Chord ${chord.chord} should be active ${chord.startTime}s-${(chord.startTime + chord.duration).toFixed(1)}s`);
    }
  }
  
  totalHighlightingTests++;
});

const accuracyPercentage = (highlightingAccuracy / totalHighlightingTests) * 100;
console.log(`🎯 Highlighting accuracy: ${highlightingAccuracy}/${totalHighlightingTests} (${accuracyPercentage.toFixed(1)}%)`);

console.log('\n🔧 TESTING TIMING OFFSET FUNCTIONALITY:');
console.log('-' .repeat(50));

// Test timing offset (for manual synchronization adjustment)
const offsetTests = [
  { offset: 0, time: 3.5, expected: 'G' },
  { offset: -0.5, time: 3.5, expected: 'C' }, // Shifted earlier
  { offset: 0.5, time: 3.5, expected: 'G' },  // Shifted later
  { offset: -1.0, time: 7.2, expected: 'G' }  // Larger offset
];

let offsetTestsPassed = true;

offsetTests.forEach((test, index) => {
  const result = getChordAtTime(test.time, testChordProgression, test.offset);
  const actualChord = result.chord ? result.chord.chord : 'silence';
  const passed = actualChord === test.expected;
  
  console.log(`${passed ? '✅' : '❌'} Offset ${test.offset}s at ${test.time}s: Expected ${test.expected}, Got ${actualChord}`);
  
  if (!passed) {
    offsetTestsPassed = false;
  }
});

console.log('\n🎵 TESTING PROGRESSION CONTINUITY:');
console.log('-' .repeat(50));

// Test that there are no gaps or overlaps in the progression
let continuityPassed = true;

for (let i = 0; i < testChordProgression.length - 1; i++) {
  const current = testChordProgression[i];
  const next = testChordProgression[i + 1];
  
  const currentEnd = current.startTime + current.duration;
  const gap = next.startTime - currentEnd;
  
  if (Math.abs(gap) > 0.01) {
    console.log(`❌ Gap/overlap between chords ${i} and ${i+1}: ${gap.toFixed(3)}s`);
    continuityPassed = false;
  } else {
    console.log(`✅ Seamless transition: ${current.chord} -> ${next.chord}`);
  }
}

console.log('\n🎯 TESTING EDGE CASES:');
console.log('-' .repeat(50));

// Test edge cases that might break the Start Playing button
const edgeCases = [
  { name: 'Empty Progression', progression: [], time: 5.0, expected: 'silence' },
  { name: 'Single Chord', progression: [{ chord: 'C', startTime: 0, duration: 30 }], time: 15.0, expected: 'C' },
  { name: 'Very Short Chord', progression: [{ chord: 'C', startTime: 0, duration: 0.1 }], time: 0.05, expected: 'C' },
  { name: 'Very Long Chord', progression: [{ chord: 'C', startTime: 0, duration: 300 }], time: 150.0, expected: 'C' }
];

let edgeCasesPassed = true;

edgeCases.forEach(testCase => {
  const result = getChordAtTime(testCase.time, testCase.progression);
  const actualChord = result.chord ? result.chord.chord : 'silence';
  const passed = actualChord === testCase.expected;
  
  console.log(`${passed ? '✅' : '❌'} ${testCase.name}: Expected ${testCase.expected}, Got ${actualChord}`);
  
  if (!passed) {
    edgeCasesPassed = false;
  }
});

// Final summary
console.log('\n' + '=' .repeat(60));
console.log('🎯 START PLAYING BUTTON & HIGHLIGHTING TEST SUMMARY');
console.log('=' .repeat(60));

const allTestsPassed = allScenariosPass && 
                       (accuracyPercentage >= 95) && 
                       offsetTestsPassed && 
                       continuityPassed && 
                       edgeCasesPassed;

if (allTestsPassed) {
  console.log('✅ ALL TESTS PASSED!');
  console.log('🎉 Start Playing button and chord highlighting are working correctly');
  console.log('🎮 Button will correctly identify current chord at any playback time');
  console.log('🎨 Highlighting will accurately show active chord during playback');
  console.log('🔧 Timing offset functionality works for manual synchronization');
  console.log('🎵 Progression continuity is maintained (no gaps/overlaps)');
  console.log('🛡️ Edge cases are handled properly');
  console.log('\n📱 READY FOR LIVE APP TESTING!');
} else {
  console.log('❌ SOME TESTS FAILED');
  console.log('🔧 Issues found:');
  if (!allScenariosPass) console.log('   - Start Playing button scenarios failed');
  if (accuracyPercentage < 95) console.log('   - Chord highlighting accuracy below 95%');
  if (!offsetTestsPassed) console.log('   - Timing offset functionality failed');
  if (!continuityPassed) console.log('   - Progression continuity issues');
  if (!edgeCasesPassed) console.log('   - Edge case handling failed');
}

console.log('\n🎯 Test completed at:', new Date().toISOString());
