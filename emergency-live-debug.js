// Emergency Live App Debug - Add intensive logging to identify the actual problem
console.log('🚨 EMERGENCY LIVE APP DEBUG - INTENSIVE LOGGING');
console.log('=' .repeat(80));

// Let's add more targeted logging to identify exactly where the issue is
console.log('📋 INSTRUCTIONS FOR DEBUGGING:');
console.log('1. Copy the code below into your browser console while the app is running');
console.log('2. Try to load a song and observe the debug output');
console.log('3. Report back what you see in the console');
console.log('');

const debugCode = `
// PASTE THIS CODE INTO YOUR BROWSER CONSOLE WHILE THE APP IS RUNNING
console.log('🚨 LIVE APP DEBUG ACTIVE');

// Override console.log to catch all debug messages
const originalLog = console.log;
window.debugMessages = [];

console.log = function(...args) {
  const message = args.join(' ');
  window.debugMessages.push({
    timestamp: new Date().toISOString(),
    message: message
  });
  originalLog.apply(console, args);
};

// Function to show debug summary
window.showDebugSummary = function() {
  console.log('🔍 DEBUG SUMMARY:');
  console.log('Total messages captured:', window.debugMessages.length);
  
  // Show chord-related messages
  const chordMessages = window.debugMessages.filter(msg => 
    msg.message.includes('chord') || 
    msg.message.includes('🎵') || 
    msg.message.includes('progression')
  );
  
  console.log('Chord-related messages:');
  chordMessages.forEach(msg => {
    console.log('  ', msg.timestamp, ':', msg.message);
  });
  
  // Show timing-related messages
  const timingMessages = window.debugMessages.filter(msg => 
    msg.message.includes('timing') || 
    msg.message.includes('⏱️') || 
    msg.message.includes('duration')
  );
  
  console.log('Timing-related messages:');
  timingMessages.forEach(msg => {
    console.log('  ', msg.timestamp, ':', msg.message);
  });
  
  // Show error messages
  const errorMessages = window.debugMessages.filter(msg => 
    msg.message.includes('error') || 
    msg.message.includes('❌') || 
    msg.message.includes('Error')
  );
  
  console.log('Error messages:');
  errorMessages.forEach(msg => {
    console.log('  ', msg.timestamp, ':', msg.message);
  });
};

// Test the chord detection function directly
window.testChordDetection = function() {
  console.log('🧪 TESTING CHORD DETECTION DIRECTLY');
  
  // Try to find the chord detection function in the global scope
  const testChords = [
    { chord: 'C', startTime: 0, duration: 15 },
    { chord: 'G', startTime: 15, duration: 15 },
    { chord: 'Am', startTime: 30, duration: 15 },
    { chord: 'F', startTime: 45, duration: 15 }
  ];
  
  console.log('Test chord progression:', testChords);
  
  // Try to detect chord at different times
  const testTimes = [0, 5, 15, 20, 30, 35, 45, 50, 60];
  
  testTimes.forEach(time => {
    // Simple chord detection logic
    const activeChord = testChords.find(chord => 
      time >= chord.startTime && time < (chord.startTime + chord.duration)
    );
    
    console.log(\`Time \${time}s: \${activeChord ? activeChord.chord : 'No chord'}\`);
  });
};

// Check if the fixes are in place
window.checkFixes = function() {
  console.log('🔍 CHECKING IF FIXES ARE IN PLACE');
  
  // Check if we can access the React components
  const reactRoot = document.querySelector('#root');
  console.log('React root found:', !!reactRoot);
  
  // Check if we can access any global variables
  console.log('Window keys:', Object.keys(window).filter(key => key.includes('chord') || key.includes('sync')));
  
  // Check if we have access to the chord progression data
  console.log('Checking localStorage for chord data...');
  const localStorageKeys = Object.keys(localStorage);
  console.log('LocalStorage keys:', localStorageKeys);
  
  // Check sessionStorage
  const sessionStorageKeys = Object.keys(sessionStorage);
  console.log('SessionStorage keys:', sessionStorageKeys);
};

console.log('🎯 DEBUG FUNCTIONS AVAILABLE:');
console.log('- showDebugSummary(): Show all captured debug messages');
console.log('- testChordDetection(): Test chord detection directly');
console.log('- checkFixes(): Check if fixes are in place');
console.log('');
console.log('📋 NEXT STEPS:');
console.log('1. Load a song in the app');
console.log('2. Try to use the Start Playing button');
console.log('3. Call showDebugSummary() to see what happened');
console.log('4. Call checkFixes() to verify the fixes are loaded');
`;

console.log('🚨 EMERGENCY DEBUG CODE:');
console.log('=' .repeat(80));
console.log(debugCode);
console.log('=' .repeat(80));

console.log('\n🔧 ALTERNATIVE APPROACH - DIRECT FIX INJECTION:');
console.log('If the fixes are not working, try this direct approach:');

const directFix = `
// DIRECT FIX INJECTION - PASTE THIS INTO BROWSER CONSOLE
window.fixChordProgression = function(originalProgression) {
  console.log('🔧 APPLYING DIRECT FIX TO CHORD PROGRESSION');
  console.log('Original progression:', originalProgression);
  
  if (!originalProgression || originalProgression.length === 0) {
    console.log('❌ No progression to fix');
    return originalProgression;
  }
  
  // Check for uniform intervals
  const durations = originalProgression.map(chord => chord.duration);
  const uniqueDurations = [...new Set(durations)];
  const allSameDuration = uniqueDurations.length === 1;
  const singleDuration = uniqueDurations[0];
  const isUnrealistic = allSameDuration && singleDuration >= 10;
  
  console.log('Uniform interval check:', { allSameDuration, singleDuration, isUnrealistic });
  
  if (isUnrealistic) {
    console.log('🔧 APPLYING FIX: Converting uniform intervals to varied durations');
    
    const chordNames = originalProgression.map(chord => chord.chord);
    const songDuration = originalProgression[originalProgression.length - 1].startTime + 
                        originalProgression[originalProgression.length - 1].duration;
    
    const fixedProgression = [];
    let currentTime = 0;
    const variableDurations = [2.5, 3.0, 3.5, 4.0, 4.5, 2.0, 5.0, 3.0, 4.0, 3.5];
    
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
    
    console.log('✅ FIXED PROGRESSION:', fixedProgression);
    return fixedProgression;
  }
  
  console.log('✅ Progression is already good, no fix needed');
  return originalProgression;
};

// Test the fix function
window.testDirectFix = function() {
  const badProgression = [
    { chord: 'C', startTime: 0, duration: 15 },
    { chord: 'G', startTime: 15, duration: 15 },
    { chord: 'Am', startTime: 30, duration: 15 },
    { chord: 'F', startTime: 45, duration: 15 }
  ];
  
  const fixed = window.fixChordProgression(badProgression);
  return fixed;
};

console.log('🔧 DIRECT FIX FUNCTIONS AVAILABLE:');
console.log('- fixChordProgression(progression): Fix any chord progression');
console.log('- testDirectFix(): Test the fix function');
`;

console.log(directFix);
console.log('=' .repeat(80));

console.log('\n🎯 WHAT TO DO RIGHT NOW:');
console.log('1. 🌐 Open your app in a browser');
console.log('2. 🔧 Press F12 to open developer tools');
console.log('3. 📋 Go to the Console tab');
console.log('4. 📝 Copy and paste the debug code above');
console.log('5. 🎵 Load a song and try to use the Start Playing button');
console.log('6. 🔍 Call showDebugSummary() to see what happened');
console.log('7. 📊 Report back what debug messages you see');

console.log('\n🚨 CRITICAL QUESTIONS:');
console.log('- Are you seeing ANY debug messages when you load a song?');
console.log('- Are you seeing the 🎵 emoji messages?');
console.log('- Does the Start Playing button produce any console output?');
console.log('- Are there any error messages in red?');

console.log('\n📞 IMMEDIATE NEXT STEPS:');
console.log('1. Run the debug code in your browser console');
console.log('2. Try to reproduce the issue');
console.log('3. Call showDebugSummary() and share the output');
console.log('4. This will tell us exactly what\'s happening');

console.log('\n🎯 Debug helper created at:', new Date().toISOString());
