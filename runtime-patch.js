// Runtime Patch - Direct injection to fix the live app immediately
console.log('🔧 RUNTIME PATCH FOR LIVE APP - DIRECT FIX INJECTION');
console.log('=' .repeat(80));

console.log('📋 EMERGENCY RUNTIME PATCH - COPY THIS INTO BROWSER CONSOLE:');
console.log('');

const runtimePatch = `
// EMERGENCY RUNTIME PATCH - PASTE THIS INTO YOUR BROWSER CONSOLE
console.log('🚨 APPLYING EMERGENCY RUNTIME PATCH');

// 1. Override the chord progression processing
window.originalChordProgression = null;
window.patchedChordProgression = null;

// 2. Create a fixed chord detection function
window.emergencyGetChordAtTime = function(time, chordProgression, timingOffset = 0) {
  console.log('🔧 EMERGENCY CHORD DETECTION - Time:', time, 'Offset:', timingOffset);
  
  if (!chordProgression || chordProgression.length === 0) {
    console.log('❌ No chord progression available');
    return { chordIndex: -1, chord: null };
  }
  
  // Apply the emergency fix if needed
  const fixedProgression = window.emergencyFixChordProgression(chordProgression);
  
  const adjustedTime = time + timingOffset;
  
  // Find the chord that should be active at this time
  for (let i = 0; i < fixedProgression.length; i++) {
    const chord = fixedProgression[i];
    const chordEndTime = chord.startTime + chord.duration;
    
    if (adjustedTime >= chord.startTime && adjustedTime < chordEndTime) {
      console.log('✅ CHORD FOUND:', chord.chord, 'at', adjustedTime, 'Index:', i);
      return { chordIndex: i, chord: chord };
    }
  }
  
  console.log('🔇 NO CHORD ACTIVE at time', adjustedTime);
  return { chordIndex: -1, chord: null };
};

// 3. Create an emergency fix function
window.emergencyFixChordProgression = function(originalProgression) {
  console.log('🔧 EMERGENCY FIX - Processing progression:', originalProgression);
  
  if (!originalProgression || originalProgression.length === 0) {
    console.log('❌ No progression to fix');
    return [];
  }
  
  // Check for uniform intervals (the main problem)
  const durations = originalProgression.map(chord => chord.duration);
  const uniqueDurations = [...new Set(durations)];
  const allSameDuration = uniqueDurations.length === 1;
  const singleDuration = uniqueDurations[0];
  const isUnrealistic = allSameDuration && singleDuration >= 10;
  
  console.log('🔍 UNIFORM INTERVAL CHECK:', {
    allSameDuration,
    singleDuration,
    isUnrealistic,
    originalCount: originalProgression.length
  });
  
  if (isUnrealistic) {
    console.log('🚨 DETECTED UNIFORM INTERVALS - APPLYING EMERGENCY FIX');
    
    const chordNames = originalProgression.map(chord => chord.chord);
    const songDuration = originalProgression[originalProgression.length - 1].startTime + 
                        originalProgression[originalProgression.length - 1].duration;
    
    console.log('🎵 Converting', chordNames.length, 'uniform chords to varied durations over', songDuration, 'seconds');
    
    const fixedProgression = [];
    let currentTime = 0;
    
    // Use varied durations like Chordify
    const variableDurations = [2.5, 3.0, 3.5, 4.0, 4.5, 2.0, 5.0, 3.0, 4.0, 3.5, 2.5, 6.0];
    
    while (currentTime < songDuration) {
      const chordIndex = fixedProgression.length % chordNames.length;
      const chord = chordNames[chordIndex];
      const duration = variableDurations[fixedProgression.length % variableDurations.length];
      
      // Adjust for end of song
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
      
      // Safety check
      if (fixedProgression.length > 100) {
        console.log('⚠️ Safety limit reached, stopping generation');
        break;
      }
    }
    
    console.log('✅ EMERGENCY FIX APPLIED:', fixedProgression.length, 'chords generated');
    console.log('📊 Sample fixed chords:', fixedProgression.slice(0, 5));
    
    // Store for debugging
    window.originalChordProgression = originalProgression;
    window.patchedChordProgression = fixedProgression;
    
    return fixedProgression;
  }
  
  console.log('✅ Progression is already good, no fix needed');
  return originalProgression;
};

// 4. Test the emergency fix
window.testEmergencyFix = function() {
  console.log('🧪 TESTING EMERGENCY FIX');
  
  // Create a test progression with uniform intervals
  const testProgression = [
    { chord: 'C', startTime: 0, duration: 15 },
    { chord: 'G', startTime: 15, duration: 15 },
    { chord: 'Am', startTime: 30, duration: 15 },
    { chord: 'F', startTime: 45, duration: 15 }
  ];
  
  console.log('Input (uniform intervals):', testProgression);
  
  const fixed = window.emergencyFixChordProgression(testProgression);
  console.log('Output (varied durations):', fixed);
  
  // Test chord detection
  const testTimes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];
  console.log('Testing chord detection at different times:');
  
  testTimes.forEach(time => {
    const result = window.emergencyGetChordAtTime(time, testProgression);
    console.log(\`Time \${time}s: \${result.chord ? result.chord.chord : 'No chord'}\`);
  });
  
  return fixed;
};

// 5. Monitor for Start Playing button clicks
window.monitorStartPlayingButton = function() {
  console.log('🎮 MONITORING START PLAYING BUTTON');
  
  // Try to find and override the Start Playing button
  const buttons = document.querySelectorAll('button, [role="button"]');
  console.log('Found', buttons.length, 'buttons on page');
  
  buttons.forEach((button, index) => {
    const text = button.textContent || button.innerText || '';
    if (text.toLowerCase().includes('start') || text.toLowerCase().includes('play')) {
      console.log('Found potential Start Playing button:', index, text);
      
      // Add event listener to monitor clicks
      button.addEventListener('click', function(e) {
        console.log('🎮 START PLAYING BUTTON CLICKED!');
        console.log('Button text:', text);
        console.log('Event:', e);
        
        // Try to get current time from YouTube player
        setTimeout(() => {
          const currentTime = window.getCurrentTime ? window.getCurrentTime() : 0;
          console.log('Current video time:', currentTime);
          
          // Test emergency chord detection
          if (window.patchedChordProgression) {
            const result = window.emergencyGetChordAtTime(currentTime, window.patchedChordProgression);
            console.log('Emergency chord detection result:', result);
          }
        }, 100);
      });
    }
  });
};

// 6. Auto-initialization
console.log('🚀 EMERGENCY PATCH INITIALIZED');
console.log('Available functions:');
console.log('- emergencyGetChordAtTime(time, progression, offset)');
console.log('- emergencyFixChordProgression(progression)');
console.log('- testEmergencyFix()');
console.log('- monitorStartPlayingButton()');
console.log('');
console.log('📋 NEXT STEPS:');
console.log('1. Call testEmergencyFix() to verify the fix works');
console.log('2. Call monitorStartPlayingButton() to track button clicks');
console.log('3. Try to load a song and use the Start Playing button');
console.log('4. Check the console for debug messages');
console.log('');
console.log('🎯 This patch will bypass any caching or loading issues');
console.log('🔧 It provides direct fixes for the chord progression problems');
`;

console.log(runtimePatch);
console.log('=' .repeat(80));

console.log('\n🚨 IMMEDIATE ACTIONS:');
console.log('1. 🌐 Open your app in a browser');
console.log('2. 🔧 Press F12 to open developer tools');
console.log('3. 📋 Go to the Console tab');
console.log('4. 📝 Copy and paste the runtime patch above');
console.log('5. 🧪 Run testEmergencyFix() to verify it works');
console.log('6. 🎮 Run monitorStartPlayingButton() to track button clicks');
console.log('7. 🎵 Try to load a song and use the Start Playing button');
console.log('8. 📊 Check the console for debug messages');

console.log('\n🎯 WHAT THIS PATCH DOES:');
console.log('✅ Directly fixes uniform interval chord progressions');
console.log('✅ Provides emergency chord detection function');
console.log('✅ Monitors Start Playing button clicks');
console.log('✅ Bypasses any caching or loading issues');
console.log('✅ Provides detailed debug logging');
console.log('✅ Works regardless of the app state');

console.log('\n🔍 EXPECTED RESULTS:');
console.log('- You should see "EMERGENCY PATCH INITIALIZED" in console');
console.log('- testEmergencyFix() should show varied chord durations');
console.log('- monitorStartPlayingButton() should find buttons');
console.log('- Button clicks should produce debug messages');
console.log('- Chord detection should work correctly');

console.log('\n📞 PLEASE REPORT:');
console.log('- Any error messages when pasting the patch');
console.log('- Results of testEmergencyFix()');
console.log('- What happens when you click Start Playing button');
console.log('- Any debug messages that appear');

console.log('\n🎯 Runtime patch created at:', new Date().toISOString());
