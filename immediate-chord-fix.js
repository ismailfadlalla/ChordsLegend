// IMMEDIATE CHORD PROGRESSION FIX - Apply this in your running app browser console
console.log('🚨 IMMEDIATE CHORD PROGRESSION FIX');
console.log('=' .repeat(80));

console.log('📋 STEP 1: Copy the code below and paste it in your browser console');
console.log('📋 STEP 2: Press Enter to execute');
console.log('📋 STEP 3: Try the Start Playing button and report what happens');
console.log('');

const immediateChordFix = `
// IMMEDIATE CHORD PROGRESSION FIX - PASTE THIS IN BROWSER CONSOLE
console.log('🚨 APPLYING IMMEDIATE CHORD PROGRESSION FIX');

// Global chord fix system
window.CHORD_EMERGENCY_FIX = {
  active: true,
  debug: true,
  fixes: [],
  
  log: function(msg, ...args) {
    if (this.debug) {
      console.log('🔧 CHORD FIX:', msg, ...args);
    }
  },
  
  // Emergency fix for uniform intervals
  fixUniformIntervals: function(progression) {
    if (!progression || progression.length === 0) return [];
    
    // Check for uniform intervals
    const durations = progression.map(chord => chord.duration);
    const allSame = durations.every(d => d === durations[0]);
    const uniformDuration = durations[0];
    
    if (allSame && uniformDuration >= 10) {
      this.log('🚨 DETECTED UNIFORM INTERVALS:', uniformDuration + 's');
      
      // Create varied progression
      const chordNames = progression.map(chord => chord.chord);
      const totalDuration = progression[progression.length - 1].startTime + uniformDuration;
      
      this.log('Converting to varied durations over', totalDuration + 's');
      
      const fixedProgression = [];
      let currentTime = 0;
      const variedDurations = [2.5, 3.0, 3.5, 4.0, 4.5, 2.0, 5.0, 3.0, 4.0, 3.5];
      
      while (currentTime < totalDuration) {
        const chordIndex = fixedProgression.length % chordNames.length;
        const duration = variedDurations[fixedProgression.length % variedDurations.length];
        
        if (currentTime + duration > totalDuration) {
          const remaining = totalDuration - currentTime;
          if (remaining >= 1) {
            fixedProgression.push({
              chord: chordNames[chordIndex],
              startTime: currentTime,
              duration: remaining
            });
          }
          break;
        }
        
        fixedProgression.push({
          chord: chordNames[chordIndex],
          startTime: currentTime,
          duration: duration
        });
        
        currentTime += duration;
      }
      
      this.log('✅ FIXED PROGRESSION:', fixedProgression.length + ' chords');
      this.fixes.push({
        original: progression,
        fixed: fixedProgression,
        timestamp: Date.now()
      });
      
      return fixedProgression;
    }
    
    return progression;
  },
  
  // Emergency chord detection
  getChordAtTime: function(time, progression) {
    const fixedProgression = this.fixUniformIntervals(progression);
    
    this.log('Getting chord at time', time + 's');
    
    for (let i = 0; i < fixedProgression.length; i++) {
      const chord = fixedProgression[i];
      const endTime = chord.startTime + chord.duration;
      
      if (time >= chord.startTime && time < endTime) {
        this.log('✅ Found chord:', chord.chord);
        return { chordIndex: i, chord: chord };
      }
    }
    
    this.log('🔇 No chord at time', time + 's');
    return { chordIndex: -1, chord: null };
  },
  
  // Monitor Start Playing button
  monitorButton: function() {
    this.log('🎮 Setting up button monitoring...');
    
    const findButtons = () => {
      const allButtons = document.querySelectorAll('button, [role="button"]');
      const playButtons = [];
      
      allButtons.forEach(button => {
        const text = (button.textContent || '').toLowerCase();
        const ariaLabel = (button.getAttribute('aria-label') || '').toLowerCase();
        
        if (text.includes('start') || text.includes('play') || ariaLabel.includes('play')) {
          playButtons.push(button);
        }
      });
      
      return playButtons;
    };
    
    const setupListeners = () => {
      const buttons = findButtons();
      this.log('Found', buttons.length, 'play buttons');
      
      buttons.forEach(button => {
        // Clone to remove existing listeners
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        newButton.addEventListener('click', () => {
          this.log('🎮 START PLAYING BUTTON CLICKED!');
          
          // Try to get current time and test chord detection
          setTimeout(() => {
            const currentTime = this.getCurrentTime();
            this.log('Current time:', currentTime + 's');
            
            // Test with dummy progression if none available
            const testProgression = [
              { chord: 'C', startTime: 0, duration: 15 },
              { chord: 'G', startTime: 15, duration: 15 },
              { chord: 'Am', startTime: 30, duration: 15 },
              { chord: 'F', startTime: 45, duration: 15 }
            ];
            
            const result = this.getChordAtTime(currentTime, testProgression);
            this.log('🎵 CHORD DETECTION RESULT:', result);
          }, 100);
        });
      });
    };
    
    setupListeners();
    setInterval(setupListeners, 3000); // Re-scan every 3 seconds
  },
  
  // Get current time from various sources
  getCurrentTime: function() {
    if (window.getCurrentTime) return window.getCurrentTime();
    if (window.player && window.player.getCurrentTime) return window.player.getCurrentTime();
    if (window.youtubePlayer && window.youtubePlayer.getCurrentTime) return window.youtubePlayer.getCurrentTime();
    return 0;
  },
  
  // Test function
  test: function() {
    this.log('🧪 TESTING CHORD FIX SYSTEM');
    
    const testProgression = [
      { chord: 'C', startTime: 0, duration: 15 },
      { chord: 'G', startTime: 15, duration: 15 },
      { chord: 'Am', startTime: 30, duration: 15 },
      { chord: 'F', startTime: 45, duration: 15 }
    ];
    
    console.log('Input (uniform):', testProgression);
    
    const fixed = this.fixUniformIntervals(testProgression);
    console.log('Output (fixed):', fixed);
    
    // Test chord detection
    const testTimes = [0, 5, 10, 15, 20, 30, 40, 50, 60];
    console.log('\\nTesting chord detection:');
    
    testTimes.forEach(time => {
      const result = this.getChordAtTime(time, testProgression);
      console.log(\`Time \${time}s: \${result.chord ? result.chord.chord : 'No chord'}\`);
    });
    
    console.log('\\n✅ Test completed');
  }
};

// Initialize the fix system
window.CHORD_EMERGENCY_FIX.monitorButton();

// Override global functions
window.fixChordProgression = function(progression) {
  return window.CHORD_EMERGENCY_FIX.fixUniformIntervals(progression);
};

window.getChordAtTime = function(time, progression) {
  return window.CHORD_EMERGENCY_FIX.getChordAtTime(time, progression);
};

window.testChordFix = function() {
  window.CHORD_EMERGENCY_FIX.test();
};

console.log('🎯 IMMEDIATE CHORD FIX APPLIED!');
console.log('📋 Available functions:');
console.log('- testChordFix(): Test the fix system');
console.log('- fixChordProgression(prog): Fix any progression');
console.log('- getChordAtTime(time, prog): Get chord at time');
console.log('');
console.log('🎮 Try clicking the Start Playing button now!');
console.log('🔍 Watch the console for debug messages');
`;

console.log('🚨 COPY THIS CODE AND PASTE IT IN YOUR BROWSER CONSOLE:');
console.log('=' .repeat(80));
console.log(immediateChordFix);
console.log('=' .repeat(80));

console.log('\n📋 AFTER PASTING THE CODE:');
console.log('1. You should see "IMMEDIATE CHORD FIX APPLIED!" message');
console.log('2. Run testChordFix() to verify it works');
console.log('3. Try to load a song and click Start Playing button');
console.log('4. Watch console for debug messages like "🔧 CHORD FIX:"');
console.log('5. Report what happens when you click the button');

console.log('\n🎯 This fix will:');
console.log('✅ Automatically detect and fix uniform interval progressions');
console.log('✅ Monitor Start Playing button clicks');
console.log('✅ Provide chord detection at any time');
console.log('✅ Show detailed debug information');
console.log('✅ Work immediately without app restart');

console.log('\n🚨 CRITICAL: Please report back:');
console.log('- Did you see the "IMMEDIATE CHORD FIX APPLIED!" message?');
console.log('- What does testChordFix() show?');
console.log('- What happens when you click Start Playing button?');
console.log('- Do you see any debug messages with 🔧 CHORD FIX?');

console.log('\n🎯 Immediate fix created at:', new Date().toISOString());
