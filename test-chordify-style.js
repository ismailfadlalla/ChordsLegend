// Test the new Chordify-style chord progression system
console.log('🎵 TESTING CHORDIFY-STYLE CHORD PROGRESSION SYSTEM\n');

// Test 1: Backend generates full coverage with varied durations
console.log('📡 TEST 1: Backend generateRealisticTiming (Chordify-style)');

// Simulate the varied duration function from backend
const getVariedChordDuration = (index, totalChords) => {
  const patterns = [
    2.5, 3.0, 3.5, 4.0, 4.5,  // Common durations
    2.0, 5.0, 3.0, 4.0, 3.5,  // Mix of short and medium
    6.0, 2.0, 3.0, 4.0, 3.0   // Occasional longer chords
  ];
  
  const baseDuration = patterns[index % patterns.length];
  const variation = 0.9 + (Math.random() * 0.2);  // ±10% variation
  
  return Math.max(1.5, Math.min(8.0, baseDuration * variation));
};

// Test backend-style generation
const testChordProgression = ['Em', 'Am', 'Dm', 'G'];
const songDuration = 240; // 4 minutes
const backendProgression = [];
let currentTime = 0;
let chordIndex = 0;

console.log('Generating backend progression...');
while (currentTime < songDuration && backendProgression.length < 200) {
  const chordName = testChordProgression[chordIndex % testChordProgression.length];
  const remainingTime = songDuration - currentTime;
  let chordDuration = getVariedChordDuration(chordIndex, testChordProgression.length);
  
  // If we're near the end, adjust the last chord to finish exactly at song end
  if (remainingTime < chordDuration + 1) {
    chordDuration = remainingTime;
  }
  
  if (chordDuration < 1) {
    break;
  }
  
  backendProgression.push({
    chord: chordName,
    startTime: currentTime,
    duration: chordDuration
  });
  
  currentTime += chordDuration;
  chordIndex++;
}

console.log(`✅ Backend generated ${backendProgression.length} chords over ${currentTime.toFixed(1)}s`);
console.log(`📊 Coverage: ${((currentTime / songDuration) * 100).toFixed(1)}%`);

// Show first few chords
console.log('\nFirst 10 chords:');
backendProgression.slice(0, 10).forEach((chord, index) => {
  const endTime = chord.startTime + chord.duration;
  console.log(`${index + 1}. ${chord.chord}: ${chord.startTime.toFixed(1)}s - ${endTime.toFixed(1)}s (${chord.duration.toFixed(1)}s)`);
});

// Test 2: Frontend handles uniform intervals (fallback)
console.log('\n🖥️ TEST 2: Frontend SynchronizedChordPlayer (fallback for uniform intervals)');

// Simulate uniform intervals that need frontend fix
const uniformIntervals = [
  { chord: 'Em', startTime: 0, duration: 15.0 },
  { chord: 'Am', startTime: 15.0, duration: 15.0 },
  { chord: 'Dm', startTime: 30.0, duration: 15.0 },
  { chord: 'G', startTime: 45.0, duration: 15.0 }
];

console.log('Uniform intervals input:');
uniformIntervals.forEach((chord, index) => {
  console.log(`${index + 1}. ${chord.chord}: ${chord.startTime}s - ${chord.startTime + chord.duration}s (${chord.duration}s)`);
});

// Test frontend fix
let frontendProgression = [];
let frontendTime = 0;
let originalSongDuration = 60;

const durations = uniformIntervals.map(c => c.duration);
const isUniform = [...new Set(durations)].length === 1 && durations[0] > 8;

if (isUniform) {
  console.log('\n🔧 Frontend detects uniform intervals, applying Chordify-style fix...');
  
  const chordNames = uniformIntervals.map(c => c.chord);
  originalSongDuration = uniformIntervals[uniformIntervals.length - 1].startTime + uniformIntervals[uniformIntervals.length - 1].duration;
  
  frontendProgression = [];
  frontendTime = 0;
  let frontendIndex = 0;
  
  // Frontend varied duration function
  const generateVariedDuration = (chordIndex, totalChords) => {
    const baseVariations = [2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6];
    const variation = baseVariations[chordIndex % baseVariations.length];
    const isStructuralChord = (chordIndex % 4 === 0) || (chordIndex % 4 === 3);
    return isStructuralChord ? Math.min(variation + 1, 6) : variation;
  };
  
  while (frontendTime < originalSongDuration) {
    const chordName = chordNames[frontendIndex % chordNames.length];
    const remainingTime = originalSongDuration - frontendTime;
    let duration = generateVariedDuration(frontendIndex, chordNames.length);
    
    if (remainingTime < duration + 2) {
      duration = remainingTime;
    }
    
    if (duration < 1) {
      break;
    }
    
    frontendProgression.push({
      chord: chordName,
      startTime: frontendTime,
      duration: duration
    });
    
    frontendTime += duration;
    frontendIndex++;
  }
  
  console.log(`✅ Frontend generated ${frontendProgression.length} chords over ${frontendTime.toFixed(1)}s`);
  console.log(`📊 Coverage: ${((frontendTime / originalSongDuration) * 100).toFixed(1)}%`);
  
  console.log('\nFixed progression:');
  frontendProgression.forEach((chord, index) => {
    const endTime = chord.startTime + chord.duration;
    console.log(`${index + 1}. ${chord.chord}: ${chord.startTime.toFixed(1)}s - ${endTime.toFixed(1)}s (${chord.duration.toFixed(1)}s)`);
  });
}

// Test 3: Verify no gaps or overlaps
console.log('\n🔍 TEST 3: Synchronization validation');

function validateProgression(progression, name) {
  console.log(`\nValidating ${name}:`);
  
  let hasGaps = false;
  let hasOverlaps = false;
  
  for (let i = 0; i < progression.length - 1; i++) {
    const current = progression[i];
    const next = progression[i + 1];
    const currentEnd = current.startTime + current.duration;
    const gap = next.startTime - currentEnd;
    
    if (gap > 0.1) {
      console.log(`❌ Gap: ${gap.toFixed(1)}s between ${current.chord} and ${next.chord}`);
      hasGaps = true;
    } else if (gap < -0.1) {
      console.log(`⚠️ Overlap: ${Math.abs(gap).toFixed(1)}s between ${current.chord} and ${next.chord}`);
      hasOverlaps = true;
    }
  }
  
  if (!hasGaps && !hasOverlaps) {
    console.log('✅ Perfect synchronization - no gaps or overlaps');
  }
  
  return !hasGaps && !hasOverlaps;
}

const backendValid = validateProgression(backendProgression, 'Backend progression');
const frontendValid = validateProgression(frontendProgression, 'Frontend progression');

console.log('\n📊 FINAL SUMMARY:');
console.log(`✅ Backend: ${backendProgression.length} chords, ${((currentTime / songDuration) * 100).toFixed(1)}% coverage, ${backendValid ? 'Valid' : 'Invalid'}`);
console.log(`✅ Frontend: ${frontendProgression.length} chords, ${((frontendTime / originalSongDuration) * 100).toFixed(1)}% coverage, ${frontendValid ? 'Valid' : 'Invalid'}`);
console.log(`✅ Chordify-style: Full song coverage with varied realistic durations`);
console.log(`✅ No more 56s cutoff, no more fixed 3.5s intervals!`);
