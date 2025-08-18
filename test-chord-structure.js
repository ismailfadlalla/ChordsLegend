const fs = require('fs');

// Read the professionalChordAnalysis.ts file to test the generateRealisticTiming function
const analysisCode = fs.readFileSync('./src/services/professionalChordAnalysis.ts', 'utf8');

// Use native console - no mocking needed

// Extract the generateRealisticTiming function by evaluating the TypeScript code as JavaScript
// This is a quick hack to test the function without setting up a full TypeScript environment
const functionMatch = analysisCode.match(/const generateRealisticTiming[\s\S]*?(?=export|const [A-Z]|$)/);

if (!functionMatch) {
  console.error('Could not find generateRealisticTiming function');
  process.exit(1);
}

let extractedFunction = functionMatch[0];

// Remove TypeScript annotations for JavaScript execution
extractedFunction = extractedFunction
  .replace(/: number/g, '')
  .replace(/: string/g, '')
  .replace(/: \{[^}]+\}/g, '')
  .replace(/: ChordTiming\[\]/g, '')
  .replace(/: ChordTiming/g, '')
  .replace(/interface ChordTiming[\s\S]*?}/g, '')
  .replace(/Math\.floor\(Math\.random\(\) \* 3\) \+ 1/g, '2'); // Make deterministic

console.log('🎵 Testing generateRealisticTiming function with Beat It progression...\n');

// Evaluate the function
eval(extractedFunction);

// Test with "Beat It" chord progression
const beatItProgression = [
  { chord: 'Em', startTime: 0, duration: 15.0 },
  { chord: 'Am', startTime: 15.0, duration: 15.0 },
  { chord: 'Dm', startTime: 30.0, duration: 15.0 },
  { chord: 'G', startTime: 45.0, duration: 15.0 },
  { chord: 'Em', startTime: 60.0, duration: 15.0 },
  { chord: 'Am', startTime: 75.0, duration: 15.0 },
  { chord: 'Dm', startTime: 90.0, duration: 15.0 },
  { chord: 'G', startTime: 105.0, duration: 15.0 },
  { chord: 'C', startTime: 120.0, duration: 15.0 },
  { chord: 'G', startTime: 135.0, duration: 15.0 },
  { chord: 'Am', startTime: 150.0, duration: 15.0 },
  { chord: 'F', startTime: 165.0, duration: 15.0 },
  { chord: 'C', startTime: 180.0, duration: 15.0 },
  { chord: 'G', startTime: 195.0, duration: 15.0 },
  { chord: 'Am', startTime: 210.0, duration: 15.0 },
  { chord: 'F', startTime: 225.0, duration: 15.0 }
];

console.log('🎵 ORIGINAL "Beat It" progression (with 15s intervals):');
beatItProgression.forEach((chord, index) => {
  console.log(`${index + 1}. ${chord.chord}: ${chord.startTime}s - ${chord.startTime + chord.duration}s (${chord.duration}s)`);
});

console.log('\n🔧 GENERATING REALISTIC TIMING...');

const songDuration = 240; // 4 minutes
const realisticProgression = generateRealisticTiming(beatItProgression, songDuration);

console.log('\n🎵 REALISTIC "Beat It" progression:');
realisticProgression.forEach((chord, index) => {
  const endTime = chord.startTime + chord.duration;
  console.log(`${index + 1}. ${chord.chord}: ${chord.startTime.toFixed(1)}s - ${endTime.toFixed(1)}s (${chord.duration.toFixed(1)}s)`);
});

// Check for gaps and overlaps
console.log('\n🔍 VALIDATION:');
let hasGaps = false;
let hasOverlaps = false;
let totalCoverage = 0;

for (let i = 0; i < realisticProgression.length; i++) {
  const current = realisticProgression[i];
  const next = realisticProgression[i + 1];
  
  totalCoverage += current.duration;
  
  if (next) {
    const currentEnd = current.startTime + current.duration;
    const nextStart = next.startTime;
    
    if (currentEnd < nextStart) {
      const gap = nextStart - currentEnd;
      console.log(`❌ GAP: ${gap.toFixed(1)}s gap between ${current.chord} and ${next.chord}`);
      hasGaps = true;
    } else if (currentEnd > nextStart) {
      const overlap = currentEnd - nextStart;
      console.log(`❌ OVERLAP: ${overlap.toFixed(1)}s overlap between ${current.chord} and ${next.chord}`);
      hasOverlaps = true;
    } else {
      console.log(`✅ ${current.chord} → ${next.chord}: Perfect transition`);
    }
  }
}

const lastChord = realisticProgression[realisticProgression.length - 1];
const actualEnd = lastChord.startTime + lastChord.duration;
const coverage = (totalCoverage / songDuration) * 100;

console.log(`\n📊 SUMMARY:`);
console.log(`Total chords: ${realisticProgression.length}`);
console.log(`Song duration: ${songDuration}s`);
console.log(`Last chord ends at: ${actualEnd.toFixed(1)}s`);
console.log(`Coverage: ${coverage.toFixed(1)}%`);
console.log(`Gaps: ${hasGaps ? '❌' : '✅'}`);
console.log(`Overlaps: ${hasOverlaps ? '❌' : '✅'}`);
console.log(`Covers full song: ${actualEnd >= songDuration ? '✅' : '❌'}`);
