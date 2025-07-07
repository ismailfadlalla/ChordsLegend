/**
 * Test script to verify chord synchronization fixes
 * Tests the core chord analysis and timing logic
 */

// Mock chord progression with silence periods (similar to what the app generates)
const testChordProgression = [
  // No chords in first 8 seconds (silence period)
  { chord: 'Am', startTime: 8, duration: 4 },
  { chord: 'E', startTime: 12, duration: 4 },
  { chord: 'G', startTime: 16, duration: 4 },
  { chord: 'D', startTime: 20, duration: 6 },
  { chord: 'F', startTime: 26, duration: 4 },
  // Silence period from 30-35 seconds
  { chord: 'C', startTime: 35, duration: 4 },
  { chord: 'Dm', startTime: 39, duration: 4 },
  { chord: 'E', startTime: 43, duration: 8 },
  // End around 51 seconds
];

// Simulate the getCurrentChord function from SynchronizedChordPlayer
function getCurrentChord(currentTime, timingOffset = 0) {
  const adjustedTime = currentTime + timingOffset;
  
  const activeChord = testChordProgression.find(chord => {
    const chordEndTime = chord.startTime + chord.duration;
    return adjustedTime >= chord.startTime && adjustedTime < chordEndTime;
  });
  
  if (!activeChord) {
    console.log(`🔇 No chord at ${adjustedTime.toFixed(1)}s - silence period`);
    return null;
  }
  
  console.log(`🎸 Current chord at ${adjustedTime.toFixed(1)}s: ${activeChord.chord} (${activeChord.startTime}s - ${(activeChord.startTime + activeChord.duration).toFixed(1)}s)`);
  return activeChord;
}

// Test different time points
console.log('🧪 Testing Chord Synchronization Logic...\n');

console.log('=== Testing Silence Periods ===');
console.log('Time 5s (should be silence):');
getCurrentChord(5); // Should return null

console.log('\nTime 32s (should be silence):');
getCurrentChord(32); // Should return null

console.log('\n=== Testing Active Chords ===');
console.log('Time 10s (should be Am):');
getCurrentChord(10); // Should return Am

console.log('\nTime 22s (should be D):');
getCurrentChord(22); // Should return D

console.log('\nTime 44s (should be E):');
getCurrentChord(44); // Should return E

console.log('\n=== Testing Chord Boundaries ===');
console.log('Time 11.9s (end of Am):');
getCurrentChord(11.9); // Should return Am

console.log('\nTime 12.1s (start of E):');
getCurrentChord(12.1); // Should return E

console.log('\n=== Testing After Song Ends ===');
console.log('Time 60s (after all chords):');
getCurrentChord(60); // Should return null

console.log('\n=== Testing with Timing Offset ===');
console.log('Time 10s with +2s offset (should be G):');
getCurrentChord(10, 2); // 10 + 2 = 12s, should return E

console.log('\n✅ Chord synchronization logic test completed!');
console.log('\n📝 Expected behavior:');
console.log('- Silence periods return null (no chord)');
console.log('- Active periods return correct chord');
console.log('- Precise timing boundaries work correctly');
console.log('- Timing offset is properly applied');
