// Test script to understand the exact issues with Start Playing button and highlighting
console.log('🔍 DIAGNOSING START PLAYING BUTTON AND HIGHLIGHTING ISSUES\n');

// Test 1: Simulate the start playing button logic
console.log('📱 TEST 1: Start Playing Button Logic');

// Simulate what happens when Start Playing is pressed
const simulateStartPlayingButton = (chordProgression, currentTime = 0, timingOffset = 0) => {
  console.log(`\n🎵 START PLAYING pressed at time ${currentTime}s`);
  console.log(`📊 Chord progression: ${chordProgression.length} chords`);
  console.log(`⏰ Timing offset: ${timingOffset}s`);
  
  if (chordProgression.length === 0) {
    console.log('❌ No chord progression - button should be disabled');
    return;
  }
  
  // This is the current complex logic in the component
  let targetChordIndex = -1;
  const adjustedTime = currentTime + timingOffset;
  
  // Find chord at current time
  for (let i = 0; i < chordProgression.length; i++) {
    const chord = chordProgression[i];
    const chordEndTime = chord.startTime + chord.duration;
    
    if (adjustedTime >= chord.startTime && adjustedTime < chordEndTime) {
      targetChordIndex = i;
      console.log(`✅ Found chord at time ${adjustedTime}s: ${chord.chord} (index ${i})`);
      break;
    }
  }
  
  // If no chord found at current time, find the next upcoming chord
  if (targetChordIndex === -1) {
    for (let i = 0; i < chordProgression.length; i++) {
      const chord = chordProgression[i];
      if (adjustedTime < chord.startTime) {
        targetChordIndex = i;
        console.log(`🔜 Next chord: ${chord.chord} (index ${i}) starts at ${chord.startTime}s`);
        break;
      }
    }
  }
  
  // If still not found, use first or last chord
  if (targetChordIndex === -1) {
    if (adjustedTime < chordProgression[0].startTime) {
      targetChordIndex = 0;
      console.log(`🏁 Before first chord - using first: ${chordProgression[0].chord}`);
    } else {
      targetChordIndex = chordProgression.length - 1;
      console.log(`🏁 After last chord - using last: ${chordProgression[chordProgression.length - 1].chord}`);
    }
  }
  
  console.log(`🎯 Target chord index: ${targetChordIndex}`);
  return targetChordIndex;
};

// Test 2: Simulate highlighting during playback
console.log('\n🖍️ TEST 2: Highlighting During Playback');

const simulateHighlighting = (chordProgression, playbackTime, timingOffset = 0) => {
  console.log(`\n🎵 Highlighting at playback time ${playbackTime}s`);
  
  const adjustedTime = playbackTime + timingOffset;
  let activeChordIndex = -1;
  
  // Find the chord that should be active at this time
  for (let i = 0; i < chordProgression.length; i++) {
    const chord = chordProgression[i];
    const chordEndTime = chord.startTime + chord.duration;
    
    if (adjustedTime >= chord.startTime && adjustedTime < chordEndTime) {
      activeChordIndex = i;
      console.log(`🎸 Active chord: ${chord.chord} (${chord.startTime}s - ${chordEndTime}s)`);
      break;
    }
  }
  
  if (activeChordIndex === -1) {
    console.log(`🔇 No active chord at time ${adjustedTime}s`);
  }
  
  return activeChordIndex;
};

// Test with a realistic chord progression
const testProgression = [
  { chord: 'Em', startTime: 0, duration: 3.5 },
  { chord: 'Am', startTime: 3.5, duration: 4.0 },
  { chord: 'Dm', startTime: 7.5, duration: 3.0 },
  { chord: 'G', startTime: 10.5, duration: 4.5 },
  { chord: 'C', startTime: 15.0, duration: 3.5 },
  { chord: 'F', startTime: 18.5, duration: 4.0 }
];

console.log('\nTest progression:');
testProgression.forEach((chord, index) => {
  console.log(`${index}. ${chord.chord}: ${chord.startTime}s - ${(chord.startTime + chord.duration)}s`);
});

// Test Start Playing button at different times
console.log('\n🎮 Testing Start Playing Button:');
simulateStartPlayingButton(testProgression, 0, 0);    // At beginning
simulateStartPlayingButton(testProgression, 5, 0);    // During second chord
simulateStartPlayingButton(testProgression, 25, 0);   // After all chords

// Test highlighting at different times
console.log('\n🖍️ Testing Highlighting:');
simulateHighlighting(testProgression, 0);     // Beginning
simulateHighlighting(testProgression, 3.5);   // Transition point
simulateHighlighting(testProgression, 5);     // During second chord
simulateHighlighting(testProgression, 7.5);   // Another transition
simulateHighlighting(testProgression, 25);    // After all chords

console.log('\n🔍 IDENTIFIED ISSUES:');
console.log('1. Complex timing offset logic confuses chord detection');
console.log('2. Multiple fallback mechanisms create inconsistent behavior');
console.log('3. Start Playing button logic is different from highlighting logic');
console.log('4. No clear handling of silence periods between chords');
console.log('5. Forced chord index calculations override actual progression');

console.log('\n💡 RECOMMENDED FIXES:');
console.log('1. Simplify chord detection to use only startTime/duration');
console.log('2. Make Start Playing button use same logic as highlighting');
console.log('3. Remove complex timing offset and forced calculations');
console.log('4. Handle silence periods consistently');
console.log('5. Use a single, reliable chord detection function');
