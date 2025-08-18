// Chord Synchronization Diagnostic - Check for gaps and overlaps in chord progressions
console.log('🔍 CHORD SYNCHRONIZATION DIAGNOSTIC');
console.log('===================================');

// Simulate a chord progression that might have synchronization issues
const sampleProgression = [
  { chord: 'C', startTime: 0, duration: 3.5 },
  { chord: 'G', startTime: 3.5, duration: 3.5 },
  { chord: 'Am', startTime: 7.0, duration: 3.5 },
  { chord: 'F', startTime: 10.5, duration: 3.5 },
  { chord: 'C', startTime: 14.0, duration: 3.5 },  // Potential gap here
  { chord: 'G', startTime: 18.0, duration: 3.5 },  // Another gap
];

function checkChordSynchronization(progression, songDuration = 240) {
  console.log(`\n🎵 Analyzing ${progression.length} chords over ${songDuration}s...`);
  
  const issues = [];
  let totalCoverage = 0;
  
  // Check for gaps and overlaps
  for (let i = 0; i < progression.length; i++) {
    const currentChord = progression[i];
    const nextChord = progression[i + 1];
    const currentEnd = currentChord.startTime + currentChord.duration;
    
    console.log(`${i + 1}. ${currentChord.chord}: ${currentChord.startTime.toFixed(1)}s - ${currentEnd.toFixed(1)}s (${currentChord.duration.toFixed(1)}s)`);
    
    if (nextChord) {
      const gap = nextChord.startTime - currentEnd;
      
      if (gap > 0.1) {
        const issue = `GAP: ${gap.toFixed(1)}s gap between ${currentChord.chord} and ${nextChord.chord}`;
        console.log(`   ❌ ${issue}`);
        issues.push(issue);
      } else if (gap < -0.1) {
        const issue = `OVERLAP: ${Math.abs(gap).toFixed(1)}s overlap between ${currentChord.chord} and ${nextChord.chord}`;
        console.log(`   ⚠️ ${issue}`);
        issues.push(issue);
      } else {
        console.log(`   ✅ Perfect transition to ${nextChord.chord}`);
      }
    }
    
    totalCoverage += currentChord.duration;
  }
  
  // Check total coverage
  const lastChord = progression[progression.length - 1];
  const actualEndTime = lastChord ? lastChord.startTime + lastChord.duration : 0;
  const coverageGap = songDuration - actualEndTime;
  
  console.log(`\n📊 COVERAGE ANALYSIS:`);
  console.log(`   Song duration: ${songDuration}s`);
  console.log(`   Progression ends at: ${actualEndTime.toFixed(1)}s`);
  console.log(`   Coverage gap: ${coverageGap.toFixed(1)}s`);
  
  if (Math.abs(coverageGap) > 1) {
    const issue = `COVERAGE: ${Math.abs(coverageGap).toFixed(1)}s ${coverageGap > 0 ? 'missing' : 'excess'} coverage`;
    console.log(`   ❌ ${issue}`);
    issues.push(issue);
  } else {
    console.log(`   ✅ Good coverage`);
  }
  
  // Summary
  console.log(`\n📋 SYNCHRONIZATION SUMMARY:`);
  if (issues.length === 0) {
    console.log('✅ Perfect synchronization - no gaps or overlaps detected');
  } else {
    console.log(`❌ ${issues.length} synchronization issues found:`);
    issues.forEach(issue => console.log(`   • ${issue}`));
  }
  
  return {
    hasIssues: issues.length > 0,
    issues: issues,
    actualEndTime: actualEndTime,
    coverageGap: coverageGap
  };
}

// Test the sample progression
const result = checkChordSynchronization(sampleProgression, 60);

// Provide fix suggestions
console.log(`\n🔧 FIX SUGGESTIONS:`);
if (result.hasIssues) {
  console.log('To fix synchronization issues:');
  console.log('1. Ensure chord.startTime[i+1] = chord.startTime[i] + chord.duration[i]');
  console.log('2. Fill any gaps with extended chord durations or silence markers');
  console.log('3. Ensure the last chord ends exactly at song duration');
  console.log('4. Use continuous timing: currentTime += duration for each chord');
} else {
  console.log('✅ No fixes needed - progression is perfectly synchronized');
}

console.log(`\n💡 IMPLEMENTATION FIX:`);
console.log('In generateRealisticTiming(), ensure:');
console.log('• currentTime is incremented continuously without gaps');
console.log('• Each chord starts exactly when the previous one ends');
console.log('• Final chord is extended to cover remaining song duration');
console.log('• No breaks or early exits that leave coverage gaps');
