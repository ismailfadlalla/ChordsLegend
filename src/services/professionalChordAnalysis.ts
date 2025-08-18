// Professional chord detection and analysis system
import { analyzeChords } from '../api/chords';

export interface AudioAnalysisOptions {
  useRealTimeDetection?: boolean;
  useChordAPI?: boolean;
  allowManualAdjustment?: boolean;
  confidenceThreshold?: number;
}

export interface ChordTiming {
  chord: string;
  startTime: number;
  duration: number;
  confidence: number; // 0-1 scale
  source: 'detected' | 'predicted' | 'manual';
}

export interface SongAnalysis {
  songTitle: string;
  videoId: string;
  chordProgression: ChordTiming[];
  key: string;
  timeSignature: string;
  bpm: number;
  analysisMethod: string;
  confidence: number;
}

// Enhanced chord analysis that combines multiple detection methods
export class ProfessionalChordAnalyzer {
  
  // Analyze YouTube video for chord progression - PRIORITIZE REAL DETECTION
  static async analyzeYouTubeVideo(
    videoId: string, 
    songTitle: string,
    options: AudioAnalysisOptions = {}
  ): Promise<SongAnalysis> {
    console.log('🎵 Starting FORCED REAL chord analysis for:', songTitle || 'Unknown Title');
    console.log('🎵 Video ID:', videoId || 'Unknown Video ID');
    
    // Input validation
    if (!videoId) {
      console.error('❌ No video ID provided');
      throw new Error('Video ID is required for chord analysis');
    }
    
    if (!songTitle) {
      console.warn('⚠️ No song title provided, using fallback');
      songTitle = 'Unknown Song';
    }
    
    const {
      useRealTimeDetection = true,
      useChordAPI = true,
      allowManualAdjustment = true,
      confidenceThreshold = 0.6
    } = options;

    try {
      // 🚨 FORCE REAL CHORD DETECTION FIRST - NO EXCEPTIONS!
      console.log('🎤 🚨 FORCING REAL AUDIO CHORD DETECTION FIRST...');
      console.log('🎤 Calling backend API with FULL YouTube URL');
      
      try {
        const fullYouTubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
        console.log('📞 API Call URL:', fullYouTubeUrl);
        
        const chordData = await analyzeChords(fullYouTubeUrl);
        
        if (chordData && chordData.length > 0) {
          console.log('✅ 🎉 REAL CHORD DETECTION SUCCESSFUL!');
          console.log(`🎵 Detected ${chordData.length} chord changes from REAL audio analysis`);
          
          const chordProgression: ChordTiming[] = chordData.map((chord, index) => {
            const nextChord = chordData[index + 1];
            const duration = nextChord ? nextChord.time - chord.time : Math.max(2, chord.duration || 2);
            return {
              chord: chord.chord,
              startTime: chord.time,
              duration: Math.max(0.5, duration),
              confidence: chord.confidence || 0.8,
              source: 'detected'
            };
          });
          
          const key = this.detectKey(chordProgression);
          const bpm = this.estimateBPM(chordProgression);
          
          console.log('🎵 🎉 REAL ANALYSIS RESULT:', {
            chords: chordProgression.length,
            key,
            bpm,
            duration: `${Math.max(...chordProgression.map(c => c.startTime + c.duration)).toFixed(1)}s`,
            firstFewChords: chordProgression.slice(0, 5).map(c => `${c.chord}@${c.startTime}s`)
          });
          
          return {
            songTitle,
            videoId,
            chordProgression,
            key,
            timeSignature: '4/4',
            bpm,
            analysisMethod: '🎤 REAL Audio Analysis',
            confidence: 0.95
          };
        }
        
        console.log('⚠️ Real API returned empty results, will retry once...');
        
        // Try again with just video ID in case URL format is wrong
        const chordDataRetry = await analyzeChords(videoId);
        if (chordDataRetry && chordDataRetry.length > 0) {
          console.log('✅ 🎉 REAL CHORD DETECTION SUCCESSFUL ON RETRY!');
          
          const chordProgression: ChordTiming[] = chordDataRetry.map((chord, index) => {
            const nextChord = chordDataRetry[index + 1];
            const duration = nextChord ? nextChord.time - chord.time : Math.max(2, chord.duration || 2);
            return {
              chord: chord.chord,
              startTime: chord.time,
              duration: Math.max(0.5, duration),
              confidence: chord.confidence || 0.8,
              source: 'detected'
            };
          });
          
          return {
            songTitle,
            videoId,
            chordProgression,
            key: this.detectKey(chordProgression),
            timeSignature: '4/4',
            bpm: this.estimateBPM(chordProgression),
            analysisMethod: '🎤 REAL Audio Analysis (Retry)',
            confidence: 0.95
          };
        }
        
      } catch (apiError) {
        console.error('❌ REAL chord API analysis failed:', apiError);
        console.error('Error details:', apiError);
        console.error('Error type:', typeof apiError);
        console.error('Error message:', apiError instanceof Error ? apiError.message : String(apiError));
        
        // Check if it's a network error vs server error
        if (apiError instanceof Error) {
          if (apiError.message.includes('Failed to fetch')) {
            console.error('🔥 NETWORK ERROR: Backend server may not be running!');
            throw new Error('Backend server is not accessible. Please ensure the Flask server is running on port 5000.');
          } else if (apiError.message.includes('timeout') || apiError.message.includes('aborted')) {
            console.error('⏰ TIMEOUT ERROR: Request took too long');
            throw new Error('Request timed out - server may be overloaded');
          } else {
            console.error('🚨 API ERROR:', apiError.message);
            throw new Error(`API Error: ${apiError.message}`);
          }
        } else {
          console.error('🚨 UNKNOWN ERROR TYPE');
          throw new Error(`Unknown error type: ${String(apiError)}`);
        }
      }

      // Method 2: Use intelligent song pattern recognition ONLY if real detection fails
      console.log('⚠️ Real detection failed, trying pattern recognition...');
      const patternResult = await this.analyzeWithPatternRecognition(songTitle, videoId);
      if (patternResult && patternResult.confidence >= confidenceThreshold) {
        console.log('✅ Pattern recognition successful');
        patternResult.analysisMethod = '📋 Pattern Recognition (Real API Failed)';
        return patternResult;
      }

      // Method 3: Fallback to enhanced prediction
      console.log('⚠️ Pattern recognition failed, using enhanced prediction...');
      const fallbackResult = await this.generateIntelligentProgression(songTitle, videoId);
      fallbackResult.analysisMethod = '🎯 Enhanced Prediction (All Methods Failed)';
      return fallbackResult;

    } catch (error) {
      console.error('❌ All chord analysis methods failed:', error);
      throw new Error(`Chord analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Method 1: Real chord detection using audio analysis APIs
  private static async detectChordsFromAPI(videoId: string, songTitle: string): Promise<SongAnalysis | null> {
    try {
      console.log('🔍 Analyzing real audio for chord detection...');
      
      // Use the existing chord analysis API with video ID for actual audio analysis
      const chordData = await analyzeChords(videoId); // Pass videoId instead of songTitle for real analysis
      
      if (chordData && chordData.length > 0) {
        console.log(`✅ API detected ${chordData.length} chord changes from audio analysis`);
        
        const chordProgression: ChordTiming[] = chordData.map((chord, index) => {
          const nextChord = chordData[index + 1];
          // Use actual detected timing from audio analysis
          const duration = nextChord ? nextChord.time - chord.time : Math.max(2, chord.duration || 2);
          
          return {
            chord: chord.chord,
            startTime: chord.time, // Real timing from audio analysis
            duration: Math.max(0.5, duration),
            confidence: chord.confidence || 0.8,
            source: 'detected'
          };
        });

        // Calculate actual song duration from the chord data
        const songDuration = Math.max(...chordProgression.map(c => c.startTime + c.duration));
        console.log(`🎵 Song duration from analysis: ${songDuration} seconds (${Math.floor(songDuration/60)}:${String(Math.floor(songDuration%60)).padStart(2, '0')})`);

        // Detect key and other musical properties from actual chords
        const key = this.detectKey(chordProgression);
        const bpm = this.estimateBPM(chordProgression);

        return {
          songTitle,
          videoId,
          chordProgression,
          key,
          timeSignature: '4/4', // Could be detected from audio in future
          bpm,
          analysisMethod: 'Real Audio Analysis',
          confidence: 0.9 // High confidence for real audio analysis
        };
      }
    } catch (error) {
      console.warn('Real audio chord detection failed:', error);
    }
    return null;
  }

  // Method 2: Intelligent pattern recognition based on song database
  private static async analyzeWithPatternRecognition(songTitle: string, videoId: string): Promise<SongAnalysis | null> {
    console.log('🔍 Checking pattern database for:', songTitle);
    
    // Get actual song duration from YouTube API or estimate - with null safety
    let estimatedDuration: number;
    try {
      const durationResult = await this.getYouTubeDuration(videoId);
      estimatedDuration = durationResult || 240; // fallback to 4 minutes
      console.log(`📏 Estimated song duration: ${estimatedDuration} seconds (${Math.floor(estimatedDuration/60)}:${String(Math.floor(estimatedDuration%60)).padStart(2, '0')})`);
    } catch (error) {
      console.warn('Duration lookup failed, using fallback:', error);
      estimatedDuration = 240;
    }
    const songDatabase = {
      'beat it': {
        key: 'E',
        progression: [
          { chord: 'E', beat: 1, measures: 2 },
          { chord: 'D', beat: 1, measures: 2 },
          { chord: 'E', beat: 1, measures: 2 },
          { chord: 'D', beat: 1, measures: 2 },
          { chord: 'E', beat: 1, measures: 2 },
          { chord: 'D', beat: 1, measures: 2 },
          { chord: 'E', beat: 1, measures: 2 },
          { chord: 'B', beat: 1, measures: 2 },
          { chord: 'D', beat: 1, measures: 2 },
          { chord: 'A', beat: 1, measures: 2 },
          { chord: 'E', beat: 1, measures: 2 },
        ],
        bpm: 138,
        timeSignature: '4/4',
        structure: ['intro', 'verse', 'chorus', 'bridge', 'verse', 'chorus', 'outro']
      },
      'wonderwall': {
        key: 'G',
        progression: [
          { chord: 'Em7', beat: 1, measures: 1 },
          { chord: 'G', beat: 1, measures: 1 },
          { chord: 'D', beat: 1, measures: 1 },
          { chord: 'C', beat: 1, measures: 1 },
        ],
        bpm: 87,
        timeSignature: '4/4',
        structure: ['intro', 'verse', 'chorus', 'verse', 'chorus', 'outro']
      },
      'let it be': {
        key: 'C',
        progression: [
          { chord: 'C', beat: 1, measures: 2 },
          { chord: 'G', beat: 1, measures: 1 },
          { chord: 'Am', beat: 1, measures: 1 },
          { chord: 'F', beat: 1, measures: 2 },
        ],
        bpm: 76,
        timeSignature: '4/4',
        structure: ['intro', 'verse', 'chorus', 'verse', 'chorus', 'outro']
      },
      'hotel california': {
        key: 'Am',
        progression: [
          { chord: 'Am', beat: 1, measures: 2 },
          { chord: 'E', beat: 1, measures: 2 },
          { chord: 'G', beat: 1, measures: 2 },
          { chord: 'D', beat: 1, measures: 2 },
        ],
        bpm: 75,
        timeSignature: '4/4',
        structure: ['intro', 'verse', 'chorus', 'verse', 'chorus', 'outro']
      },
      'stairway to heaven': {
        key: 'Am',
        progression: [
          { chord: 'Am', beat: 1, measures: 2 },
          { chord: 'C', beat: 1, measures: 1 },
          { chord: 'D', beat: 1, measures: 1 },
          { chord: 'F', beat: 1, measures: 2 },
        ],
        bpm: 82,
        timeSignature: '4/4',
        structure: ['intro', 'verse', 'chorus', 'verse', 'chorus', 'outro']
      }
    };

    // Safely handle song title input
    const title = (songTitle || '').toLowerCase().trim();
    console.log('🔍 Searching patterns for title:', title);
    
    // Return null immediately if no valid title
    if (!title) {
      console.log('❌ No valid song title provided');
      return null;
    }
    
    // Enhanced direct matching with multiple variations
    for (const [songKey, songData] of Object.entries(songDatabase)) {
      if (!songKey || !songData) {
        continue; // Skip invalid entries
      }
      
      const keyWords = songKey.split(' ').filter(word => word.length > 0);
      let matchCount = 0;
      let totalWords = keyWords.length;
      
      if (totalWords === 0) {
        continue; // Skip entries with no valid words
      }
      
      for (const word of keyWords) {
        if (title.includes(word)) {
          matchCount++;
        }
      }
      
      // If most words match, consider it a match
      const matchRatio = matchCount / totalWords;
      console.log(`🔍 "${songKey}": ${matchCount}/${totalWords} words match (${(matchRatio * 100).toFixed(0)}%)`);
      
      if (matchRatio >= 0.5) { // At least 50% of words match
        console.log(`🎯 Found pattern match for: ${songKey} (${(matchRatio * 100).toFixed(0)}% match)`);
        
        try {
          console.log('💡 IMPORTANT: Applying optimized timing for all songs with 2-6s chord durations');
          
          // Initialize for TypeScript
          let progressionWithTiming: ChordTiming[] = [];
          
          // Use the standard optimized approach for all songs
          progressionWithTiming = this.generateRealisticTiming(
            songData.progression,
            songData.bpm,
            songData.structure,
            estimatedDuration
          );
          
          console.log(`🎵 Generated ${progressionWithTiming.length} chords over ${estimatedDuration} seconds`);
          
          return {
            songTitle,
            videoId,
            chordProgression: progressionWithTiming.map(chord => ({
              ...chord,
              source: 'predicted' as const
            })),
            key: songData.key,
            timeSignature: songData.timeSignature,
            bpm: songData.bpm,
            analysisMethod: `Pattern Recognition (${songKey})`,
            confidence: 0.85 + (matchRatio * 0.1)
          };
        } catch (error) {
          console.error('Failed to generate timing for matched song:', error);
          continue; // Try next match
        }
      }
    }
    
    console.log('❌ No pattern match found');
    return null;
  }

  // Method 3: Enhanced intelligent progression generation - with null safety
  private static async generateIntelligentProgression(songTitle: string, videoId: string): Promise<SongAnalysis> {
    console.log('🎼 Generating intelligent chord progression...');
    console.log('🎼 Input validation - Title:', songTitle || 'None', 'VideoId:', videoId || 'None');
    
    try {
      // Get actual song duration with fallback
      let songDuration: number;
      try {
        const durationResult = await this.getYouTubeDuration(videoId);
        songDuration = durationResult || 240;
      } catch (error) {
        console.warn('Duration lookup failed, using fallback:', error);
        songDuration = 240;
      }
      
      console.log(`📏 Song duration for intelligent generation: ${songDuration} seconds`);
      
      // 🚨 FALLBACK MODE: Generate MUCH FEWER chords to distinguish from real analysis
      const key = 'C';
      const bpm = 120;
      const progression = [
        { chord: 'C', measures: 2 },
        { chord: 'G', measures: 2 },
        { chord: 'Am', measures: 2 },
        { chord: 'F', measures: 2 }
      ];
      
      console.log(`🎵 Using fallback progression: ${progression.map(p => p?.chord || 'Unknown').join(' - ')}`);
      
      // 🚨 CRITICAL: Generate ONLY 4-8 chords maximum for fallback to distinguish from real analysis
      const chordProgression: ChordTiming[] = [];
      let currentTime = 0;
      const maxChords = 6; // Much fewer chords for fallback
      const chordDuration = songDuration / maxChords; // Distribute evenly
      
      console.log(`🚨 FALLBACK MODE: Creating ONLY ${maxChords} chords with ${chordDuration.toFixed(1)}s duration each`);
      console.log(`🚨 This should NEVER be used if real API works - only ${maxChords} chords vs 97!`);
      
      for (let i = 0; i < maxChords; i++) {
        const chordData = progression[i % progression.length];
        
        if (!chordData || !chordData.chord) {
          console.warn('Invalid chord data, skipping');
          continue;
        }
        
        const remainingTime = songDuration - currentTime;
        const duration = Math.min(chordDuration, remainingTime);
        
        if (duration > 1) {
          chordProgression.push({
            chord: chordData.chord,
            startTime: currentTime,
            duration: duration,
            confidence: 0.6, // Lower confidence for fallback
            source: 'predicted'
          });
          
          currentTime += duration;
        }
      }
      
      console.log(`🎵 Generated ONLY ${chordProgression.length} chords for fallback (should be ${maxChords} max)`);
      console.log(`🚨 IF YOU SEE 97 CHORDS: This function is NOT the problem - check real API calls!`);
      
      return {
        songTitle: songTitle || 'Unknown Song',
        videoId: videoId || '',
        chordProgression,
        key,
        timeSignature: '4/4',
        bpm,
        analysisMethod: 'Simple Fallback (6 chords max)',
        confidence: 0.6
      };
    } catch (error) {
      console.error('Error in generateIntelligentProgression:', error);
      // Ultimate emergency fallback - ONLY 4 chords
      return {
        songTitle: songTitle || 'Unknown Song',
        videoId: videoId || '',
        chordProgression: [
          { chord: 'C', startTime: 0, duration: 60, confidence: 0.5, source: 'predicted' },
          { chord: 'G', startTime: 60, duration: 60, confidence: 0.5, source: 'predicted' },
          { chord: 'Am', startTime: 120, duration: 60, confidence: 0.5, source: 'predicted' },
          { chord: 'F', startTime: 180, duration: 60, confidence: 0.5, source: 'predicted' }
        ],
        key: 'C',
        timeSignature: '4/4',
        bpm: 120,
        analysisMethod: 'Emergency Fallback (4 chords only)',
        confidence: 0.4
      };
    }
  }

  // Extract musical hints from song title
  private static extractMusicalHints(title: string) {
    const titleLower = title.toLowerCase();
    
    // Genre detection
    let genre = 'pop';
    if (titleLower.includes('blues') || titleLower.includes('bb king')) {
      genre = 'blues';
    }
    if (titleLower.includes('jazz') || titleLower.includes('swing')) {
      genre = 'jazz';
    }
    if (titleLower.includes('rock') || titleLower.includes('metal')) {
      genre = 'rock';
    }
    if (titleLower.includes('country') || titleLower.includes('folk')) {
      genre = 'country';
    }
    if (titleLower.includes('classical') || titleLower.includes('symphony')) {
      genre = 'classical';
    }
    
    // Mood detection
    let mood = 'neutral';
    if (titleLower.includes('sad') || titleLower.includes('cry') || titleLower.includes('blue')) {
      mood = 'sad';
    }
    if (titleLower.includes('happy') || titleLower.includes('joy') || titleLower.includes('dance')) {
      mood = 'happy';
    }
    if (titleLower.includes('dark') || titleLower.includes('minor') || titleLower.includes('death')) {
      mood = 'dark';
    }
    
    // Key detection (basic)
    let key = 'C';
    const keyMatches = titleLower.match(/\b([a-g])\s?(major|minor|maj|min)?\b/);
    if (keyMatches) {
      key = keyMatches[1].toUpperCase();
      if (keyMatches[2] && keyMatches[2].includes('min')) {
        key += 'm';
      }
    }
    
    return { genre, mood, key };
  }

  // Generate theory-based chord progression
  private static generateTheoryBasedProgression(key: string, genre: string, mood: string): ChordTiming[] {
    console.log(`🎼 Generating ${genre} progression in ${key} with ${mood} mood`);
    
    const progressions = {
      pop: {
        major: ['I', 'V', 'vi', 'IV'], // C-G-Am-F
        minor: ['i', 'VII', 'VI', 'VII'] // Am-G-F-G
      },
      rock: {
        major: ['I', 'V', 'vi', 'IV', 'I', 'V', 'IV', 'V'],
        minor: ['i', 'VII', 'VI', 'i', 'iv', 'VII', 'i', 'V']
      },
      blues: {
        major: ['I7', 'I7', 'I7', 'I7', 'IV7', 'IV7', 'I7', 'I7', 'V7', 'IV7', 'I7', 'V7'],
        minor: ['i7', 'i7', 'i7', 'i7', 'iv7', 'iv7', 'i7', 'i7', 'V7', 'iv7', 'i7', 'V7']
      }
    };
    
    const isMinor = key.includes('m');
    const rootKey = key.replace('m', '');
    const pattern = progressions[genre as keyof typeof progressions] || progressions.pop;
    const chordPattern = pattern[isMinor ? 'minor' : 'major'];
    
    console.log(`🎵 Base pattern: ${chordPattern.join(' - ')}`);
    
    // Convert Roman numerals to actual chords
    const actualChords = chordPattern.map(roman => this.romanToChord(roman, rootKey, isMinor));
    console.log(`🎸 Actual chords: ${actualChords.join(' - ')}`);
    
    // 🚨 FIXED: Create much shorter timing structure to prevent 97-chord issue
    const progression: ChordTiming[] = [];
    let currentTime = 0;
    const chordDuration = 8; // Longer chord duration
    const maxChords = 8; // Limit to 8 chords maximum
    
    console.log(`🚨 THEORY-BASED FALLBACK: Creating max ${maxChords} chords to prevent 97-chord issue`);
    
    // Generate only limited chords to distinguish from real analysis
    for (let i = 0; i < maxChords; i++) {
      const chord = actualChords[i % actualChords.length];
      progression.push({
        chord,
        startTime: currentTime,
        duration: chordDuration,
        confidence: 0.7,
        source: 'predicted'
      });
      currentTime += chordDuration;
    }
    
    console.log(`✅ Theory-based progression: ${progression.length} chords (limited to prevent 97-chord issue)`);
    return progression;
  }

  // Convert Roman numeral to actual chord
  private static romanToChord(roman: string, rootKey: string, isMinor: boolean): string {
    const majorScale = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const minorScale = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    
    const scale = isMinor ? minorScale : majorScale;
    const rootIndex = majorScale.indexOf(rootKey);
    
    // Transpose scale to correct key
    const keyScale = scale.map((_, i) => majorScale[(rootIndex + i) % 7]);
    
    // Roman numeral mappings
    const romanMap: { [key: string]: number } = {
      'I': 0, 'i': 0,
      'II': 1, 'ii': 1,
      'III': 2, 'iii': 2,
      'IV': 3, 'iv': 3,
      'V': 4, 'v': 4,
      'VI': 5, 'vi': 5,
      'VII': 6, 'vii': 6
    };
    
    const cleanRoman = roman.replace(/7/g, ''); // Remove 7 for now
    const degree = romanMap[cleanRoman];
    
    if (degree === undefined) {
      return 'C';
    }
    
    let chord = keyScale[degree];
    
    // Add chord quality
    if (roman.toLowerCase() === roman && !isMinor) {
      chord += 'm'; // Minor chord in major key
    }
    if (roman.includes('7')) {
      chord += '7';
    }
    
    return chord;
  }

  // Extend a short progression to full song length
  private static extendProgression(baseProgression: any[], targetDuration: number): ChordTiming[] {
    console.log(`🔄 Extending progression: ${baseProgression.length} base chords to ${targetDuration} seconds`);
    
    const result: ChordTiming[] = [];
    let currentTime = 0;
    let patternIndex = 0;
    const maxChords = 10; // 🚨 SAFETY LIMIT to prevent 97-chord issue
    
    console.log(`🚨 EXTEND FALLBACK: Limited to ${maxChords} chords to prevent 97-chord issue`);
    
    while (currentTime < targetDuration && result.length < maxChords) {
      const baseChord = baseProgression[patternIndex % baseProgression.length];
      
      result.push({
        chord: baseChord.chord,
        startTime: currentTime,
        duration: baseChord.duration,
        confidence: baseChord.confidence,
        source: 'predicted'
      });
      
      currentTime += baseChord.duration;
      patternIndex++;
      
      // Safety check
      if (result.length >= maxChords) {
        console.log(`⚠️ EXTEND Safety limit reached (${maxChords} chords), stopping extension`);
        break;
      }
    }
    
    console.log(`✅ Extended progression complete: ${result.length} chords over ${currentTime} seconds (limited to prevent 97-chord issue)`);
    return result;
  }

  // Detect key from chord progression
  private static detectKey(progression: ChordTiming[]): string {
    const chordCounts: { [key: string]: number } = {};
    
    progression.forEach(chord => {
      const root = chord.chord.replace(/[^A-G]/g, '');
      chordCounts[root] = (chordCounts[root] || 0) + 1;
    });
    
    // Most common chord is likely the key
    const mostCommon = Object.entries(chordCounts)
      .sort(([,a], [,b]) => b - a)[0];
    
    return mostCommon ? mostCommon[0] : 'C';
  }

  // Estimate BPM from chord changes
  private static estimateBPM(progression: ChordTiming[]): number {
    if (progression.length < 2) {
      return 120;
    }
    
    const avgChordDuration = progression.reduce((sum, chord) => sum + chord.duration, 0) / progression.length;
    
    // Assume 1 chord per measure in 4/4 time
    const measuresPerMinute = 60 / avgChordDuration;
    const bpm = measuresPerMinute * 4; // 4 beats per measure
    
    return Math.round(Math.max(60, Math.min(200, bpm))); // Clamp to reasonable range
  }

  // Allow manual chord adjustments
  static adjustChord(
    progression: ChordTiming[], 
    index: number, 
    newChord: string, 
    newStartTime?: number, 
    newDuration?: number
  ): ChordTiming[] {
    const updated = [...progression];
    
    if (updated[index]) {
      updated[index] = {
        ...updated[index],
        chord: newChord,
        startTime: newStartTime ?? updated[index].startTime,
        duration: newDuration ?? updated[index].duration,
        source: 'manual',
        confidence: 1.0 // Manual adjustments are 100% confident
      };
      
      console.log(`🎼 Manual adjustment: ${index} -> ${newChord}`);
    }
    
    return updated;
  }

  // Get YouTube video duration using YouTube API or estimate
  private static async getYouTubeDuration(videoId: string): Promise<number | null> {
    try {
      console.log('📏 Getting actual duration for video:', videoId);
      
      // Try to get actual duration from YouTube API
      // For now, we'll use known song durations for popular songs
      const knownDurations: { [key: string]: number } = {
        // Michael Jackson songs
        'beat it': 258, // 4:18
        'billie jean': 294, // 4:54
        'thriller': 357, // 5:57
        'smooth criminal': 249, // 4:09
        
        // Other popular songs with known durations
        'hotel california': 391, // 6:31
        'stairway to heaven': 482, // 8:02
        'bohemian rhapsody': 355, // 5:55
        'wonderwall': 258, // 4:18
        'let it be': 243, // 4:03
        'house of the rising sun': 266, // 4:26
        'mad world': 186, // 3:06
        'hallelujah': 274, // 4:34
        'hurt': 219, // 3:39
        'zombie': 307, // 5:07
        'nothing else matters': 388, // 6:28
        'sweet child o mine': 356, // 5:56
      };
      
      // Check if we have the duration for this video ID or can match by title patterns
      for (const [songPattern, duration] of Object.entries(knownDurations)) {
        console.log(`🔍 Checking duration pattern: "${songPattern}" against videoId: "${videoId}"`);
        
        if (videoId.toLowerCase().includes(songPattern)) {
          console.log(`📏 Found known duration for ${songPattern}: ${duration}s (${Math.floor(duration/60)}:${String(duration%60).padStart(2, '0')})`);
          return duration;
        }
      }
      
      // Enhanced estimation based on video ID patterns or use longer default
      console.log('📏 Using enhanced estimation for unknown song');
      return 300; // 5 minutes default for unknown songs
    } catch (error) {
      console.warn('Could not get YouTube duration:', error);
      return 300; // 5 minutes fallback
    }
  }

  // Generate realistic timing based on BPM and song structure - with null safety
  private static generateRealisticTiming(
    progression: any[],
    bpm: number,
    structure: string[],
    songDuration: number
  ): ChordTiming[] {
    try {
      // Input validation and null safety
      if (!progression || !Array.isArray(progression) || progression.length === 0) {
        console.warn('Invalid progression provided, using fallback');
        progression = [{ chord: 'C', measures: 2 }, { chord: 'G', measures: 2 }];
      }

      if (!bpm || bpm <= 0) {
        console.warn('Invalid BPM provided, using fallback');
        bpm = 120;
      }

      if (!songDuration || songDuration <= 0) {
        console.warn('Invalid song duration provided, using fallback');
        songDuration = 240;
      }

      console.log(`🎼 Generating realistic timing: ${bpm} BPM, ${songDuration}s duration`);
      console.log(`🎼 Base progression: ${progression.map(p => p?.chord || 'Unknown').join(' - ')}`);
      console.log(`🎼 Song structure: ${structure?.join(' -> ') || 'No structure'}`);
      
      const result: ChordTiming[] = [];
      
      // 🎵 AUTHENTIC SONG STRUCTURE APPROACH
      // Instead of filling the entire song with chords, create realistic song sections with silences
      
      // Calculate realistic chord durations based on BPM and song type
      const secondsPerBeat = 60 / bpm;
      const secondsPerMeasure = secondsPerBeat * 4; // 4/4 time
      
      // Typical chord durations in real songs
      const minChordDuration = 1.5;  // Fast chord changes
      const maxChordDuration = 6.0;  // Slow chord changes
      const typicalChordDuration = Math.max(minChordDuration, Math.min(maxChordDuration, secondsPerMeasure / 2));
      
      console.log(`⏱️ Realistic timing: ${typicalChordDuration.toFixed(1)}s per chord (based on ${bpm} BPM)`);
      
      // Create realistic song structure with appropriate silences
      const introSilence = Math.min(8, songDuration * 0.05);  // 5% of song or max 8s
      const outroStart = songDuration * 0.7;  // Last 30% is often instrumental
      const chordsPerSection = Math.min(progression.length, 8);  // Max 8 chords per section
      
      console.log(`🎵 STRUCTURE: Full song coverage with varied chord durations`);
      
      // CHORDIFY-STYLE PROGRESSION: Generate realistic chord progression that covers full song
      let currentTime = 0;
      let chordIndex = 0;
      
      // Generate varied chord durations (like Chordify)
      const getVariedChordDuration = (index: number, totalChords: number) => {
        // Create realistic variation based on musical patterns
        const patterns = [
          2.5, 3.0, 3.5, 4.0, 4.5,  // Common durations
          2.0, 5.0, 3.0, 4.0, 3.5,  // Mix of short and medium
          6.0, 2.0, 3.0, 4.0, 3.0   // Occasional longer chords
        ];
        
        const baseDuration = patterns[index % patterns.length];
        const variation = 0.9 + (Math.random() * 0.2);  // ±10% variation
        
        return Math.max(1.5, Math.min(8.0, baseDuration * variation));
      };
      
      // Generate chords to cover the full song duration
      while (currentTime < songDuration) {
        const patternIndex = chordIndex % progression.length;
        const chordPattern = progression[patternIndex];
        
        if (!chordPattern || !chordPattern.chord) {
          console.warn(`Invalid chord pattern at index ${patternIndex}, skipping`);
          chordIndex++;
          continue;
        }
        
        const remainingTime = songDuration - currentTime;
        let chordDuration = getVariedChordDuration(chordIndex, progression.length);
        
        // If we're near the end, adjust the last chord to finish exactly at song end
        if (remainingTime < chordDuration + 1) {
          chordDuration = remainingTime;
        }
        
        // Ensure minimum meaningful duration
        if (chordDuration < 1) {
          console.log(`⚠️ Remaining time too short (${chordDuration.toFixed(1)}s), stopping`);
          break;
        }
        
        // Add the chord with perfect timing
        result.push({
          chord: chordPattern.chord,
          startTime: currentTime,
          duration: chordDuration,
          confidence: 0.8,
          source: 'predicted'
        });
        
        // Move to next chord with NO GAPS
        currentTime += chordDuration;
        chordIndex++;
        
        // Log progress periodically
        if (result.length % 10 === 0 || result.length <= 5) {
          console.log(`🎼 Added chord ${result.length}: ${chordPattern.chord} at ${(currentTime - chordDuration).toFixed(1)}s for ${chordDuration.toFixed(1)}s`);
        }
        
        // Safety check to prevent infinite loops - MUCH LOWER LIMIT FOR FALLBACK
        if (result.length > 10) {
          console.log('⚠️ FALLBACK Safety limit reached (10 chords max), stopping generation');
          console.log('🚨 This prevents 97-chord fallback - real API should generate proper timing');
          break;
        }
      }
      
      console.log(`✅ Generated ${result.length} chords with Chordify-style full coverage`);
      
      if (result.length > 0) {
        const lastChord = result[result.length - 1];
        const chordCoverage = lastChord.startTime + lastChord.duration;
        const coveragePercent = (chordCoverage / songDuration) * 100;
        
        console.log(`📊 CHORDIFY-STYLE COVERAGE: ${coveragePercent.toFixed(1)}% of song (${chordCoverage.toFixed(1)}s / ${songDuration}s)`);
        console.log(`🎵 Varied durations: ${result.map(c => c.duration.toFixed(1)).slice(0, 5).join('s, ')}s...`);
      }
      
      return result;
      
    } catch (error) {
      console.error('Error in generateRealisticTiming:', error);
      // Return fallback progression with realistic structure
      const chordDuration = Math.min(4, songDuration / 8);
      const introTime = Math.min(4, songDuration * 0.1);
      
      return [
        { chord: 'C', startTime: introTime, duration: chordDuration, confidence: 0.5, source: 'predicted' },
        { chord: 'G', startTime: introTime + chordDuration, duration: chordDuration, confidence: 0.5, source: 'predicted' },
        { chord: 'Am', startTime: introTime + chordDuration * 2, duration: chordDuration, confidence: 0.5, source: 'predicted' },
        { chord: 'F', startTime: introTime + chordDuration * 3, duration: chordDuration, confidence: 0.5, source: 'predicted' }
      ];
    }
  }

  // Get duration for different song sections
  private static getSectionDuration(section: string, totalDuration: number, totalSections: number): number {
    const baseDuration = totalDuration / totalSections;
    
    switch (section) {
      case 'intro':
        return baseDuration * 0.5;
      case 'verse':
        return baseDuration * 1.2;
      case 'chorus':
        return baseDuration * 1.0;
      case 'bridge':
        return baseDuration * 0.8;
      case 'outro':
        return baseDuration * 0.6;
      default:
        return baseDuration;
    }
  }

  // Estimate BPM based on genre
  private static estimateBPMFromGenre(genre: string): number {
    const genreBPM = {
      'pop': 120,
      'rock': 120,
      'blues': 90,
      'jazz': 120,
      'country': 110,
      'classical': 100,
      'folk': 100,
      'electronic': 128,
      'hip-hop': 90,
      'ballad': 70
    };
    
    return genreBPM[genre as keyof typeof genreBPM] || 120;
  }

  // Generate dynamic progression based on actual song characteristics
  private static generateDynamicProgression(
    key: string,
    genre: string,
    mood: string,
    bpm: number,
    songDuration: number
  ): ChordTiming[] {
    console.log(`🎼 Generating dynamic ${genre} progression in ${key} with ${mood} mood`);
    console.log(`⏱️ Duration: ${songDuration}s, BPM: ${bpm}`);
    
    const progressions = {
      pop: {
        major: ['I', 'V', 'vi', 'IV'], // C-G-Am-F
        minor: ['i', 'VII', 'VI', 'VII'] // Am-G-F-G
      },
      rock: {
        major: ['I', 'V', 'vi', 'IV', 'I', 'V', 'IV', 'V'],
        minor: ['i', 'VII', 'VI', 'i', 'iv', 'VII', 'i', 'V']
      },
      blues: {
        major: ['I7', 'I7', 'I7', 'I7', 'IV7', 'IV7', 'I7', 'I7', 'V7', 'IV7', 'I7', 'V7'],
        minor: ['i7', 'i7', 'i7', 'i7', 'iv7', 'iv7', 'i7', 'i7', 'V7', 'iv7', 'i7', 'V7']
      }
    };
    
    const isMinor = key.includes('m');
    const rootKey = key.replace('m', '');
    const pattern = progressions[genre as keyof typeof progressions] || progressions.pop;
    const chordPattern = pattern[isMinor ? 'minor' : 'major'];
    
    console.log(`🎵 Base pattern: ${chordPattern.join(' - ')}`);
    
    // Convert Roman numerals to actual chords
    const actualChords = chordPattern.map(roman => this.romanToChord(roman, rootKey, isMinor));
    console.log(`🎸 Actual chords: ${actualChords.join(' - ')}`);
    
    // Generate realistic song structure
    const structure = this.generateSongStructure(genre, songDuration);
    console.log(`🏗️ Song structure: ${structure.join(' -> ')}`);
    
    // Create timing structure based on BPM and song structure
    const progression: ChordTiming[] = [];
    const secondsPerBeat = 60 / bpm;
    const secondsPerMeasure = secondsPerBeat * 4; // 4/4 time
    
    let currentTime = 0;
    let structureIndex = 0;
    
    // Continue generating chords until we reach the full song duration
    while (currentTime < songDuration) {
      // If we've used all structure sections, repeat the last few sections
      if (structureIndex >= structure.length) {
        const repeatSections = ['chorus', 'verse', 'chorus', 'outro'];
        structure.push(...repeatSections);
        console.log('🔄 Extended structure to cover full song duration');
      }
      
      const section = structure[structureIndex];
      const sectionDuration = this.getSectionDuration(section, songDuration, structure.length);
      const sectionEndTime = Math.min(currentTime + sectionDuration, songDuration); // Don't exceed song duration
      
      console.log(`🎵 ${section}: ${currentTime.toFixed(1)}s - ${sectionEndTime.toFixed(1)}s`);
      
      // Vary chord duration based on section type
      const chordDurationMultiplier = this.getChordDurationMultiplier(section);
      
      while (currentTime < sectionEndTime) {
        for (const chord of actualChords) {
          if (currentTime >= sectionEndTime || currentTime >= songDuration) {
            break;
          }
          
          const baseDuration = secondsPerMeasure * chordDurationMultiplier;
          const duration = Math.min(baseDuration, sectionEndTime - currentTime, songDuration - currentTime);
          
          if (duration > 0.5) { // Only add chord if duration is meaningful
            progression.push({
              chord,
              startTime: currentTime,
              duration: duration,
              confidence: 0.7,
              source: 'predicted'
            });
            
            currentTime += duration;
            
            // 🚨 SAFETY LIMIT: Prevent excessive chord generation
            if (progression.length >= 12) {
              console.log('⚠️ DYNAMIC Safety limit reached (12 chords max), stopping generation');
              console.log('🚨 This prevents 97-chord dynamic fallback - real API should generate proper timing');
              return progression;
            }
          } else {
            break;
          }
        }
        
        // Safety break if we're not making progress
        if (currentTime >= sectionEndTime) {
          break;
        }
      }
      
      structureIndex++;
    }
    
    console.log(`🎵 Generated ${progression.length} chords over ${currentTime.toFixed(1)} seconds`);
    return progression;
  }

  // Generate realistic song structure based on genre and duration
  private static generateSongStructure(genre: string, duration: number): string[] {
    const structures = {
      'pop': ['intro', 'verse', 'chorus', 'verse', 'chorus', 'bridge', 'chorus', 'outro'],
      'rock': ['intro', 'verse', 'verse', 'chorus', 'verse', 'chorus', 'solo', 'chorus', 'outro'],
      'blues': ['intro', 'verse', 'verse', 'verse', 'verse', 'verse', 'verse', 'outro'],
      'ballad': ['intro', 'verse', 'chorus', 'verse', 'chorus', 'bridge', 'chorus', 'outro']
    };
    
    let structure = structures[genre as keyof typeof structures] || structures.pop;
    
    // Adjust structure based on song duration
    if (duration < 180) { // Less than 3 minutes
      structure = structure.slice(0, -2); // Remove some sections
    } else if (duration > 300) { // More than 5 minutes
      structure = [...structure, 'chorus', 'outro']; // Add more sections
    }
    
    return structure;
  }

  // Get chord duration multiplier based on section type
  private static getChordDurationMultiplier(section: string): number {
    switch (section) {
      case 'intro':
        return 2; // Longer, more atmospheric chords
      case 'verse':
        return 1; // Standard chord changes
      case 'chorus':
        return 1; // Standard chord changes
      case 'bridge':
        return 1.5; // Slightly longer for emphasis
      case 'solo':
        return 0.5; // Faster chord changes during solos
      case 'outro':
        return 2; // Longer, more sustained chords
      default:
        return 1;
    }
  }

  // Calculate match score between song title and database entry using fuzzy matching
  private static calculateMatchScore(title: string, songKey: string): number {
    const titleWords = title.toLowerCase().split(/[\s\-_]+/).filter(word => word.length > 1);
    const keyWords = songKey.toLowerCase().split(/[\s\-_]+/).filter(word => word.length > 1);
    
    let totalScore = 0;
    let maxPossibleScore = keyWords.length;
    
    console.log(`🔍 Comparing "${title}" vs "${songKey}"`);
    console.log(`📝 Title words: [${titleWords.join(', ')}]`);
    console.log(`📝 Key words: [${keyWords.join(', ')}]`);
    
    for (const keyWord of keyWords) {
      let bestWordScore = 0;
      
      for (const titleWord of titleWords) {
        // Exact match gets highest score
        if (titleWord === keyWord) {
          bestWordScore = Math.max(bestWordScore, 1.0);
          console.log(`✅ Exact match: "${titleWord}" = "${keyWord}" (score: 1.0)`);
        }
        // Substring match gets good score
        else if (titleWord.includes(keyWord) || keyWord.includes(titleWord)) {
          const score = Math.min(titleWord.length, keyWord.length) / Math.max(titleWord.length, keyWord.length);
          bestWordScore = Math.max(bestWordScore, score * 0.8);
          console.log(`🔤 Substring match: "${titleWord}" ~ "${keyWord}" (score: ${(score * 0.8).toFixed(2)})`);
        }
        // Levenshtein distance for fuzzy matching
        else {
          const distance = this.levenshteinDistance(titleWord, keyWord);
          const maxLength = Math.max(titleWord.length, keyWord.length);
          const similarity = 1 - (distance / maxLength);
          
          if (similarity > 0.6) {
            const score = similarity * 0.6;
            bestWordScore = Math.max(bestWordScore, score);
            console.log(`🔀 Fuzzy match: "${titleWord}" ~ "${keyWord}" (score: ${score.toFixed(2)})`);
          }
        }
      }
      
      totalScore += bestWordScore;
      console.log(`📊 Best score for "${keyWord}": ${bestWordScore.toFixed(2)}`);
    }
    
    const finalScore = totalScore / maxPossibleScore;
    console.log(`🎯 Final match score: ${finalScore.toFixed(2)}`);
    return finalScore;
  }

  // Calculate Levenshtein distance for fuzzy string matching
  private static levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) {
      matrix[0][i] = i;
    }
    
    for (let j = 0; j <= str2.length; j++) {
      matrix[j][0] = j;
    }
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1, // deletion
          matrix[j - 1][i] + 1, // insertion
          matrix[j - 1][i - 1] + indicator // substitution
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }
}
