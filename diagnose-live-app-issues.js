// Live App Diagnostic - Check what's actually happening in the app
console.log('🔍 LIVE APP DIAGNOSTIC - ACTUAL ISSUE DETECTION');
console.log('=' .repeat(70));

// First, let's check if the issue is in the data coming from the backend
// or in the frontend processing

// Read the current professionalChordAnalysis.ts to see what's being generated
const fs = require('fs');
const path = require('path');

const professionalChordAnalysisPath = path.join(__dirname, 'src', 'services', 'professionalChordAnalysis.ts');
const professionalChordAnalysisContent = fs.readFileSync(professionalChordAnalysisPath, 'utf8');

console.log('📊 BACKEND ANALYSIS:');
console.log('-' .repeat(50));

// Check if the generateRealisticTiming function is actually being called
const hasGenerateRealisticTiming = professionalChordAnalysisContent.includes('generateRealisticTiming');
console.log('✅ generateRealisticTiming function exists:', hasGenerateRealisticTiming);

// Check for the uniform interval detection
const hasUniformIntervalFix = professionalChordAnalysisContent.includes('Chordify-style');
console.log('✅ Chordify-style fix exists:', hasUniformIntervalFix);

// Check if there are any console.log statements that would show up during actual usage
const hasDebugLogs = professionalChordAnalysisContent.includes('console.log');
console.log('✅ Debug logging exists:', hasDebugLogs);

// Now check the frontend
const synchronizedChordPlayerPath = path.join(__dirname, 'src', 'components', 'SynchronizedChordPlayer.tsx');
const synchronizedChordPlayerContent = fs.readFileSync(synchronizedChordPlayerPath, 'utf8');

console.log('\n📱 FRONTEND ANALYSIS:');
console.log('-' .repeat(50));

// Check if the getChordAtTime function exists
const hasGetChordAtTime = synchronizedChordPlayerContent.includes('getChordAtTime');
console.log('✅ getChordAtTime function exists:', hasGetChordAtTime);

// Check if the uniform interval detection exists in frontend
const hasFrontendUniformFix = synchronizedChordPlayerContent.includes('uniform intervals');
console.log('✅ Frontend uniform interval fix exists:', hasFrontendUniformFix);

// Check if there's debugging info
const hasFrontendDebugLogs = synchronizedChordPlayerContent.includes('console.log');
console.log('✅ Frontend debug logging exists:', hasFrontendDebugLogs);

console.log('\n🎯 PROBLEM DETECTION:');
console.log('-' .repeat(50));

// The issue might be that the fixes are not being applied because:
// 1. The backend is not being called correctly
// 2. The frontend logic is being bypassed
// 3. There's cached data
// 4. The conditions for applying fixes are not met

console.log('🔍 POSSIBLE ISSUES:');
console.log('1. Backend generateRealisticTiming might not be called');
console.log('2. Frontend uniform interval detection might not trigger');
console.log('3. Cached chord progressions might be used instead of fresh ones');
console.log('4. The conditions for applying fixes might not be met');
console.log('5. The original chord progression might be overriding the fixes');

// Let's create a simple test to verify the backend is working correctly
console.log('\n🧪 BACKEND FUNCTION TEST:');
console.log('-' .repeat(50));

// Extract and test the backend function
const backendFunction = `
// Test the backend chord generation directly
function testBackendChordGeneration() {
  // Simulate typical chord analysis response that would have uniform intervals
  const uniformProgressions = [
    { chord: 'C', measures: 2, timestamp: 0 },
    { chord: 'G', measures: 2, timestamp: 15 },
    { chord: 'Am', measures: 2, timestamp: 30 },
    { chord: 'F', measures: 2, timestamp: 45 }
  ];
  
  // This is what might be happening - the backend gets uniform data
  // but the fixes might not be applied properly
  
  console.log('📥 INPUT (uniform intervals):');
  uniformProgressions.forEach((prog, i) => {
    console.log(\`   \${i + 1}. \${prog.chord} at \${prog.timestamp}s\`);
  });
  
  // The issue might be that we're getting this uniform data
  // but it's not being processed through generateRealisticTiming
  
  console.log('\\n❌ POTENTIAL PROBLEM: Backend not applying realistic timing');
  console.log('❌ POTENTIAL PROBLEM: Frontend not detecting uniform intervals');
  console.log('❌ POTENTIAL PROBLEM: Cached data being used');
  
  return uniformProgressions;
}
`;

eval(backendFunction);
const testResult = testBackendChordGeneration();

console.log('\n🎮 FRONTEND PROCESSING TEST:');
console.log('-' .repeat(50));

// Test the frontend uniform interval detection
const frontendTest = `
function testFrontendUniformDetection() {
  // This simulates what the frontend should receive
  const uniformChordProgression = [
    { chord: 'C', startTime: 0, duration: 15 },
    { chord: 'G', startTime: 15, duration: 15 },
    { chord: 'Am', startTime: 30, duration: 15 },
    { chord: 'F', startTime: 45, duration: 15 }
  ];
  
  console.log('📥 FRONTEND INPUT (uniform intervals):');
  uniformChordProgression.forEach((chord, i) => {
    console.log(\`   \${i + 1}. \${chord.chord}: \${chord.startTime}s-\${chord.startTime + chord.duration}s (\${chord.duration}s)\`);
  });
  
  // Test the uniform interval detection logic
  const durations = uniformChordProgression.map(chord => chord.duration);
  const uniqueDurations = [...new Set(durations)];
  const allSameDuration = uniqueDurations.length === 1;
  const singleDuration = uniqueDurations[0];
  const isUnrealistic = allSameDuration && singleDuration > 8;
  
  console.log('\\n🔍 UNIFORM INTERVAL DETECTION:');
  console.log(\`   All same duration: \${allSameDuration}\`);
  console.log(\`   Single duration: \${singleDuration}s\`);
  console.log(\`   Is unrealistic: \${isUnrealistic}\`);
  
  if (isUnrealistic) {
    console.log('✅ FRONTEND SHOULD APPLY FIX');
    console.log('   Converting to Chordify-style progression...');
    
    // This is where the frontend fix should kick in
    // If it's not working, there might be an issue with this logic
    
    const chordNames = uniformChordProgression.map(chord => chord.chord);
    const songDuration = uniformChordProgression[uniformChordProgression.length - 1].startTime + 
                        uniformChordProgression[uniformChordProgression.length - 1].duration;
    
    console.log(\`   Chord names: \${chordNames.join(', ')}\`);
    console.log(\`   Song duration: \${songDuration}s\`);
    
    // Generate fixed progression
    const fixedProgression = [];
    let currentTime = 0;
    const variableDurations = [2.5, 3.0, 3.5, 4.0, 4.5, 2.0, 5.0, 3.0];
    
    while (currentTime < songDuration) {
      const chordIndex = fixedProgression.length % chordNames.length;
      const chord = chordNames[chordIndex];
      const duration = variableDurations[fixedProgression.length % variableDurations.length];
      
      if (currentTime + duration > songDuration) {
        const remainingTime = songDuration - currentTime;
        if (remainingTime >= 1) {
          fixedProgression.push({
            chord: chord,
            startTime: currentTime,
            duration: remainingTime
          });
        }
        break;
      }
      
      fixedProgression.push({
        chord: chord,
        startTime: currentTime,
        duration: duration
      });
      
      currentTime += duration;
    }
    
    console.log('\\n✅ FIXED PROGRESSION (should be applied):');
    fixedProgression.forEach((chord, i) => {
      console.log(\`   \${i + 1}. \${chord.chord}: \${chord.startTime}s-\${(chord.startTime + chord.duration).toFixed(1)}s (\${chord.duration}s)\`);
    });
    
    return fixedProgression;
  } else {
    console.log('❌ FRONTEND WILL NOT APPLY FIX');
    console.log('   Uniform interval detection failed');
    return uniformChordProgression;
  }
}
`;

eval(frontendTest);
const frontendResult = testFrontendUniformDetection();

console.log('\n🎯 DIAGNOSIS SUMMARY:');
console.log('=' .repeat(70));

console.log('📋 WHAT TO CHECK IN LIVE APP:');
console.log('1. Are debug logs appearing in console during chord analysis?');
console.log('2. Is the backend generateRealisticTiming function being called?');
console.log('3. Is the frontend uniform interval detection triggering?');
console.log('4. Are you seeing "DETECTED UNREALISTIC UNIFORM INTERVALS" messages?');
console.log('5. Are you seeing "Converting to Chordify-style progression" messages?');

console.log('\n🔧 IMMEDIATE ACTIONS TO TAKE:');
console.log('1. Open browser developer tools (F12)');
console.log('2. Go to Console tab');
console.log('3. Load a song and watch for debug messages');
console.log('4. Look for messages starting with 🎵, 🔧, or ✅');
console.log('5. Check if "Start Playing" button logs appear when clicked');

console.log('\n❓ QUESTIONS TO ANSWER:');
console.log('- Do you see ANY debug logs in the console?');
console.log('- Are chord progressions being generated fresh or from cache?');
console.log('- What does the actual chord progression data look like?');
console.log('- Is the Start Playing button calling getChordAtTime?');

console.log('\n📋 NEXT STEPS:');
console.log('1. Run the app and check console for debug messages');
console.log('2. Report what debug messages (if any) appear');
console.log('3. Check if the uniform interval detection is working');
console.log('4. Verify that fixes are being applied in real-time');

console.log('\n🎯 Diagnostic completed at:', new Date().toISOString());
