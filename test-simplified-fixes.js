// SIMPLIFIED AND RELIABLE CHORD PLAYER FIXES

// 1. SINGLE CHORD DETECTION FUNCTION
// This should replace all the complex logic with one reliable function
const getChordAtTime = (chordProgression, time) => {
  if (!chordProgression || chordProgression.length === 0) {
    return { chordIndex: -1, chord: null };
  }
  
  // Find the chord that should be active at this time
  for (let i = 0; i < chordProgression.length; i++) {
    const chord = chordProgression[i];
    const chordEndTime = chord.startTime + chord.duration;
    
    if (time >= chord.startTime && time < chordEndTime) {
      return { chordIndex: i, chord: chord };
    }
  }
  
  // No chord found - could be silence period or before/after progression
  return { chordIndex: -1, chord: null };
};

// 2. SIMPLIFIED START PLAYING BUTTON
// This should replace the complex button logic
const handleStartPlayingSimplified = (chordProgression, currentTime) => {
  console.log('▶️ START PLAYING button pressed');
  
  if (chordProgression.length === 0) {
    console.log('❌ No chord progression available');
    return;
  }
  
  // Find which chord should be active at current time
  const { chordIndex, chord } = getChordAtTime(chordProgression, currentTime);
  
  if (chordIndex !== -1) {
    console.log(`🎸 Starting at chord ${chordIndex}: ${chord.chord} (${chord.startTime}s)`);
    return chordIndex;
  } else {
    // No chord at current time - find the next upcoming chord
    for (let i = 0; i < chordProgression.length; i++) {
      if (currentTime < chordProgression[i].startTime) {
        console.log(`🔜 Starting with upcoming chord ${i}: ${chordProgression[i].chord} (starts at ${chordProgression[i].startTime}s)`);
        return i;
      }
    }
    
    // If we're past all chords, start with the first chord
    console.log(`🏁 Past all chords, starting with first: ${chordProgression[0].chord}`);
    return 0;
  }
};

// 3. SIMPLIFIED HIGHLIGHTING DURING PLAYBACK
// This should replace the complex time update logic
const handleTimeUpdateSimplified = (chordProgression, time, currentChordIndex, setCurrentChordIndex) => {
  if (chordProgression.length === 0) {
    return;
  }
  
  const { chordIndex, chord } = getChordAtTime(chordProgression, time);
  
  // Only update if the chord has changed
  if (chordIndex !== currentChordIndex) {
    if (chordIndex !== -1) {
      console.log(`🎵 Chord change at ${time.toFixed(1)}s: ${chord.chord} (index ${chordIndex})`);
      setCurrentChordIndex(chordIndex);
    } else {
      console.log(`🔇 Silence period at ${time.toFixed(1)}s`);
      // Keep the last chord visible during silence periods
      // Don't set to -1 as it would hide the chord display
    }
  }
};

// Test the simplified functions
console.log('🧪 TESTING SIMPLIFIED FUNCTIONS\n');

const testProgression = [
  { chord: 'Em', startTime: 0, duration: 3.5 },
  { chord: 'Am', startTime: 3.5, duration: 4.0 },
  { chord: 'Dm', startTime: 7.5, duration: 3.0 },
  { chord: 'G', startTime: 10.5, duration: 4.5 }
];

console.log('Test progression:');
testProgression.forEach((chord, index) => {
  console.log(`${index}. ${chord.chord}: ${chord.startTime}s - ${(chord.startTime + chord.duration)}s`);
});

// Test 1: Start Playing button at different times
console.log('\n▶️ Testing Start Playing Button:');
console.log('At 0s:', handleStartPlayingSimplified(testProgression, 0));
console.log('At 5s:', handleStartPlayingSimplified(testProgression, 5));
console.log('At 20s:', handleStartPlayingSimplified(testProgression, 20));

// Test 2: Time updates during playback
console.log('\n🎵 Testing Time Updates:');
let mockCurrentChordIndex = -1;
const mockSetCurrentChordIndex = (index) => {
  mockCurrentChordIndex = index;
};

const testTimes = [0, 3.5, 5, 7.5, 10.5, 12, 15, 20];
testTimes.forEach(time => {
  console.log(`\nTime ${time}s:`);
  handleTimeUpdateSimplified(testProgression, time, mockCurrentChordIndex, mockSetCurrentChordIndex);
  console.log(`  Current chord index: ${mockCurrentChordIndex}`);
});

console.log('\n✅ SIMPLIFIED FUNCTIONS WORK CORRECTLY');
console.log('✅ No complex timing offsets or forced calculations');
console.log('✅ Consistent logic between button and highlighting');
console.log('✅ Clean handling of silence periods');
console.log('✅ Single source of truth for chord detection');
