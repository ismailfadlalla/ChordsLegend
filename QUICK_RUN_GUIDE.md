# Quick Run Guide for ChordsLegend App

This guide provides step-by-step instructions for running the ChordsLegend app with our recently implemented fixes.

## Running the App

### Option 1: Using VS Code Tasks (Recommended)

We've set up convenient VS Code tasks that make it easy to run the app:

1. Open VS Code's Command Palette with `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
2. Type `Tasks: Run Task` and select it
3. Choose one of the following tasks:
   - **Start ChordsLegend App** - Starts the Metro bundler (default)
   - **Start ChordsLegend Web** - Runs the app in your web browser
   - **Start ChordsLegend Android** - Runs the app on Android device/emulator
   - **Run Beat It Timing Test** - Runs the Beat It timing test
   - **Run Comprehensive Timing Test** - Runs the comprehensive timing test

### Option 2: Using Terminal Commands

You can also use these commands directly from the terminal:

```bash
# Start the Metro bundler (main development server)
npm run start

# Run on web browser
npm run web

# Run on Android
npm run android

# Run on iOS (Mac only)
npm run ios

# Run tests
node test-beat-it-timing.js
node test-comprehensive-timing.js
```

## Testing the Fixes

To test the specific fixes we've implemented:

### 1. Testing Chord Timing and Synchronization

1. Launch the app using one of the methods above
2. Navigate to a song (e.g., "Beat It" by Michael Jackson)
3. Press the "Start Playing" button
4. Verify:
   - Chord progression starts immediately
   - Chords change every ~3.5 seconds (not fixed 15s intervals)
   - The progression covers the entire song duration
   - Highlighting is stable and consistent

### 2. Running the Automated Tests

Run the Beat It timing test to verify the fixes:

```bash
node test-beat-it-timing.js
```

Expected output:

```
🎸 TEST PASSED: Beat It chord progression has perfect timing and coverage
✅ No more fixed 15-second chord durations
✅ Entire song duration covered perfectly
✅ No timing gaps or overlaps between chords
✅ All chord durations are reasonable (~3.5s)
```

## Troubleshooting

If you encounter any issues:

1. **Metro Bundler Not Starting**:

   - Ensure Node.js is properly installed
   - Try running `npm install` to reinstall dependencies
   - Delete the `.expo` folder and try again

2. **App Not Displaying Properly**:

   - Check the console output for any errors
   - Verify your environment variables in `.env` file are correctly set

3. **Chord Timing Issues**:
   - Run the timing tests to verify the algorithm is working correctly
   - Check the browser console for any JavaScript errors

## Key Files

The main files we've modified to fix the synchronization issues:

- `src/services/professionalChordAnalysis.ts` - Improved chord timing algorithm
- `src/components/SynchronizedChordPlayer.tsx` - Fixed play button and synchronization
- `src/components/CompactRhythmTimeline.tsx` - Optimized highlighting and scrolling
- `src/components/EmbeddedRhythmSheet.tsx` - Enhanced beat detection and visual stability
