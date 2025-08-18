import React, { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ChordTiming {
  chord: string;
  startTime: number;
  duration: number;
}

interface Beat {
  chord: string;
  isChordChange: boolean;
  time: number;
  beatNumber: number;
  measure: number;
}

interface EmbeddedRhythmSheetProps {
  chordProgression: ChordTiming[];
  currentTime: number;
  isPlaying: boolean;
  theme: any;
  onSeekToTime: (time: number) => void;
}

const EmbeddedRhythmSheet: React.FC<EmbeddedRhythmSheetProps> = ({
  chordProgression,
  currentTime,
  isPlaying,
  theme,
  onSeekToTime,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const lastScrolledBeatIndex = useRef<number>(-1); // Track last scrolled position

  // Convert chord progression to rhythm sheet using actual chord timing
  const generateRhythmSheet = (): Beat[] => {
    const beats: Beat[] = [];
    
    if (chordProgression.length === 0) {
      return beats;
    }
    
    console.log('🎼 EmbeddedRhythmSheet: Generating rhythm sheet from', chordProgression.length, 'chords');
    
    // Create beats directly from chord timing, not fixed intervals
    chordProgression.forEach((chordTiming, index) => {
      const { chord, startTime, duration } = chordTiming;
      
      console.log(`🎼 Processing chord ${index + 1}: ${chord} at ${startTime.toFixed(1)}s for ${duration.toFixed(1)}s`);
      
      // Add a beat for the chord start (chord change)
      beats.push({
        chord,
        isChordChange: true,
        time: startTime,
        beatNumber: 1, // Main beat for this chord
        measure: index + 1, // Each chord gets its own "measure" for display
      });
      
      // If chord duration is long (>2 seconds), add subdivision beats to show progression
      if (duration > 2) {
        const subdivisions = Math.floor(duration / 2); // Every 2 seconds
        for (let i = 1; i < subdivisions; i++) {
          const subdivisionTime = startTime + (i * 2);
          if (subdivisionTime < startTime + duration) {
            beats.push({
              chord,
              isChordChange: false,
              time: subdivisionTime,
              beatNumber: i + 1,
              measure: index + 1,
            });
          }
        }
      }
    });
    
    // Add silence periods between chords if there are gaps
    for (let i = 0; i < chordProgression.length - 1; i++) {
      const currentChord = chordProgression[i];
      const nextChord = chordProgression[i + 1];
      const currentEnd = currentChord.startTime + currentChord.duration;
      const gap = nextChord.startTime - currentEnd;
      
      // If there's a gap > 1 second, add a silence beat
      if (gap > 1) {
        beats.push({
          chord: '', // Empty chord for silence
          isChordChange: true,
          time: currentEnd,
          beatNumber: 1,
          measure: i + 0.5, // Between measures for sorting
        });
        console.log(`🎼 Added silence beat at ${currentEnd.toFixed(1)}s for ${gap.toFixed(1)}s gap`);
      }
    }
    
    // Sort beats by time
    beats.sort((a, b) => a.time - b.time);
    
    console.log('🎼 Generated', beats.length, 'beats from chord progression');
    return beats;
  };

  const rhythmSheet = generateRhythmSheet();
  
  // CRITICAL FIX: Auto-scroll to current position with stable real-time highlighting
  useEffect(() => {
    console.log('🎼 EmbeddedRhythmSheet: currentTime updated to', currentTime.toFixed(1), 'isPlaying:', isPlaying);
    
    if (scrollViewRef.current && rhythmSheet.length > 0) {
      // OPTIMIZED: Find the currently active chord with better performance and precision
      let activeChordIndex = -1;
      let activeBeatIndex = -1;
      let debugInfo: Record<string, any> = {};
      
      // First pass: Find the active chord in the original progression using precise timing
      for (let i = 0; i < chordProgression.length; i++) {
        const chord = chordProgression[i];
        if (!chord) {
          continue;
        }
        
        const chordEnd = chord.startTime + chord.duration;
        // Use a small tolerance for floating point precision
        const isInRange = currentTime >= (chord.startTime - 0.1) && currentTime < (chordEnd + 0.1);
        
        if (isInRange) {
          activeChordIndex = i;
          debugInfo = {
            index: i,
            chord: chord.chord,
            timeRange: `${chord.startTime.toFixed(1)}s - ${chordEnd.toFixed(1)}s`,
            progress: `${((currentTime - chord.startTime) / chord.duration * 100).toFixed(0)}%`
          };
          break;
        }
      }
      
      // If we found an active chord, find its corresponding beat in the rhythm sheet
      if (activeChordIndex >= 0) {
        const activeChord = chordProgression[activeChordIndex];
        
        // IMPROVED: More precise beat mapping with multiple fallback strategies
        // Strategy 1: Exact match by chord and time
        activeBeatIndex = rhythmSheet.findIndex(beat => 
          beat.isChordChange && 
          beat.chord === activeChord.chord && 
          Math.abs(beat.time - activeChord.startTime) < 0.5
        );
        
        // Strategy 2: If no exact time match, find any beat with this chord
        if (activeBeatIndex === -1) {
          activeBeatIndex = rhythmSheet.findIndex(beat => 
            beat.chord === activeChord.chord && beat.isChordChange
          );
          
          if (activeBeatIndex >= 0) {
            debugInfo.matchStrategy = 'chord-only';
          }
        } else {
          debugInfo.matchStrategy = 'exact';
        }
        
        debugInfo.beatIndex = activeBeatIndex;
        debugInfo.beatFound = activeBeatIndex >= 0;
      } else if (isPlaying) {
        // ENHANCED FALLBACK LOGIC: Better handling when no active chord
        
        // CASE 1: Before first chord - highlight first beat
        if (currentTime < chordProgression[0].startTime) {
          activeBeatIndex = rhythmSheet.findIndex(beat => beat.isChordChange);
          debugInfo = {
            reason: 'PRE_SONG',
            firstBeat: activeBeatIndex >= 0 ? rhythmSheet[activeBeatIndex].chord : 'none',
            timeUntilStart: (chordProgression[0].startTime - currentTime).toFixed(1) + 's'
          };
        }
        // CASE 2: After last chord - keep last beat visible
        else if (currentTime >= chordProgression[chordProgression.length - 1].startTime + 
                           chordProgression[chordProgression.length - 1].duration) {
          // Find the last chord change beat
          for (let i = rhythmSheet.length - 1; i >= 0; i--) {
            if (rhythmSheet[i].isChordChange) {
              activeBeatIndex = i;
              debugInfo = {
                reason: 'POST_SONG',
                lastBeat: rhythmSheet[i].chord
              };
              break;
            }
          }
        }
        // CASE 3: We're in a gap between chords - find nearest upcoming chord
        else {
          // Find the next upcoming chord
          const nextChordIndex = chordProgression.findIndex(c => currentTime < c.startTime);
          
          if (nextChordIndex > 0) {
            // We're after at least one chord but before an upcoming one
            const prevChord = chordProgression[nextChordIndex - 1];
            const nextChord = chordProgression[nextChordIndex];
            
            // Find the beat corresponding to the upcoming chord
            const nextBeatIndex = rhythmSheet.findIndex(beat => 
              beat.isChordChange && beat.chord === nextChord.chord
            );
            
            // Find the beat corresponding to the previous chord
            const prevBeatIndex = rhythmSheet.findIndex(beat => 
              beat.isChordChange && beat.chord === prevChord.chord
            );
            
            // Choose which one to highlight based on proximity
            const timeToNext = nextChord.startTime - currentTime;
            const timeSincePrev = currentTime - (prevChord.startTime + prevChord.duration);
            
            if (timeToNext <= timeSincePrev && nextBeatIndex >= 0) {
              // We're closer to the upcoming chord
              activeBeatIndex = nextBeatIndex;
              debugInfo = {
                reason: 'UPCOMING_CHORD',
                chord: nextChord.chord,
                timeUntil: timeToNext.toFixed(1) + 's'
              };
            } else if (prevBeatIndex >= 0) {
              // We're closer to the previous chord
              activeBeatIndex = prevBeatIndex;
              debugInfo = {
                reason: 'PREVIOUS_CHORD',
                chord: prevChord.chord,
                timeSince: timeSincePrev.toFixed(1) + 's'
              };
            }
          }
        }
      }
      
      // Log debug info if we have any
      if (Object.keys(debugInfo).length > 0) {
        console.log('🎼 RHYTHM SHEET STATUS:', debugInfo);
      }
      
      // IMPROVED SCROLL LOGIC: More stable, less jumpy scrolling
      if (activeBeatIndex >= 0) {
        const isSameAsBefore = activeBeatIndex === lastScrolledBeatIndex.current;
        const isTimeForRefresh = lastScrolledBeatIndex.current === -1 || 
                               Date.now() - lastScrolledBeatIndex.current > 2000;
        
        // Only scroll if this is a different beat OR we haven't scrolled in a while
        if (!isSameAsBefore || isTimeForRefresh) {
          const currentBeat = rhythmSheet[activeBeatIndex];
          
          console.log('🎼 SCROLLING TO BEAT:', {
            beatIndex: activeBeatIndex,
            chord: currentBeat.chord,
            time: currentBeat.time.toFixed(1),
            reason: isSameAsBefore ? 'REFRESH' : 'NEW_BEAT',
            measure: currentBeat.measure
          });
          
          // IMPROVED: Better scroll position calculation
          const segmentWidth = 180; // Width of each beat segment (matching actual UI size)
          const screenWidth = 300; // Approximate container width
          const targetPosition = screenWidth * 0.35; // 35% from left for better viewing
          
          // Calculate scroll position with a smooth offset
          const scrollPosition = Math.max(0, (activeBeatIndex * segmentWidth) - targetPosition);
          
          // Use smoother animation when playing, immediate when seeking
          scrollViewRef.current.scrollTo({ 
            x: scrollPosition, 
            animated: isPlaying && !isTimeForRefresh // Animate unless it's the first scroll
          });
          
          lastScrolledBeatIndex.current = activeBeatIndex;
        }
      }
    }
  }, [currentTime, isPlaying, rhythmSheet, chordProgression]);

  const getCurrentBeat = () => {
    // Enhanced beat detection with better stability
    if (chordProgression.length === 0 || rhythmSheet.length === 0) {
      return null;
    }
    
    // Find the currently active chord
    const activeChord = chordProgression.find(c => 
      currentTime >= c.startTime && currentTime < c.startTime + c.duration
    );
    
    if (activeChord) {
      // Find the corresponding beat in the rhythm sheet
      const activeBeat = rhythmSheet.find(beat => 
        beat.chord === activeChord.chord && 
        Math.abs(beat.time - activeChord.startTime) < 0.5
      );
      return activeBeat || null;
    }
    
    // If no active chord and we're playing, return appropriate fallback
    if (isPlaying) {
      // If we're before the first chord, return the first beat
      if (currentTime < chordProgression[0].startTime) {
        return rhythmSheet.find(beat => beat.isChordChange) || null;
      }
      
      // If we're after the last chord, return the last chord beat
      const lastChord = chordProgression[chordProgression.length - 1];
      if (currentTime >= lastChord.startTime + lastChord.duration) {
        const lastBeat = rhythmSheet.slice().reverse().find(beat => 
          beat.isChordChange && beat.chord === lastChord.chord
        );
        return lastBeat || null;
      }
      
      // If we're in a silence period, find the next upcoming chord
      const nextChord = chordProgression.find(c => currentTime < c.startTime);
      if (nextChord) {
        const nextBeat = rhythmSheet.find(beat => 
          beat.chord === nextChord.chord && 
          Math.abs(beat.time - nextChord.startTime) < 0.5
        );
        return nextBeat || null;
      }
    }
    
    return null;
  };

  const currentBeat = getCurrentBeat();

  const isBeatActive = (beat: Beat) => {
    // ENHANCED: More precise beat highlighting logic
    if (!beat) {
      return false;
    }
    
    // For chord change beats, check if we're in the chord's time range
    if (beat.isChordChange && beat.chord) {
      const chordTiming = chordProgression.find(c => 
        c.chord === beat.chord && Math.abs(c.startTime - beat.time) < 0.5
      );
      
      if (chordTiming) {
        const chordEnd = chordTiming.startTime + chordTiming.duration;
        const isInRange = currentTime >= (chordTiming.startTime - 0.1) && 
                         currentTime < (chordEnd + 0.1);
        
        if (isInRange) {
          console.log('🎼 EmbeddedRhythmSheet ACTIVE BEAT:', {
            chord: beat.chord,
            beatTime: beat.time.toFixed(1),
            currentTime: currentTime.toFixed(1),
            chordRange: `${chordTiming.startTime.toFixed(1)}-${chordEnd.toFixed(1)}s`,
            isChordChange: beat.isChordChange
          });
        }
        
        return isInRange;
      }
    }
    
    // For subdivision beats, check if we're close to the beat time
    if (!beat.isChordChange) {
      const timeDiff = Math.abs(currentTime - beat.time);
      return timeDiff < 1.0; // Within 1 second of subdivision beat
    }
    
    return false;
  };

  const isBeatNear = (beat: Beat) => {
    return Math.abs(beat.time - currentTime) < 1.0;
  };

  const isBeatUpcoming = (beat: Beat) => {
    return beat.time > currentTime && beat.time <= currentTime + 4; // Next 4 beats
  };

  const isBeatPast = (beat: Beat) => {
    return beat.time < currentTime - 0.5;
  };

  // Group beats by chord segments for rendering
  const getChordSegments = () => {
    const segments: { [key: string]: Beat[] } = {};
    rhythmSheet.forEach(beat => {
      const segmentKey = `${beat.measure}-${beat.chord || 'silence'}`;
      if (!segments[segmentKey]) {
        segments[segmentKey] = [];
      }
      segments[segmentKey].push(beat);
    });
    return segments;
  };

  const segments = getChordSegments();
  const segmentKeys = Object.keys(segments).sort((a, b) => {
    const [measureA] = a.split('-').map(Number);
    const [measureB] = b.split('-').map(Number);
    return measureA - measureB;
  });

  const renderChordSegment = (segmentKey: string, beats: Beat[]) => {
    const mainBeat = beats.find(b => b.isChordChange) || beats[0];
    const chordTiming = chordProgression.find(c => c.chord === mainBeat.chord);
    const isActiveSegment = chordTiming && 
      currentTime >= chordTiming.startTime && 
      currentTime < chordTiming.startTime + chordTiming.duration;
    
    return (
      <View key={segmentKey} style={[
        styles.measure, 
        { 
          borderColor: isActiveSegment ? theme.primary : theme.divider,
          backgroundColor: isActiveSegment ? theme.primary + '40' : 'transparent',
          borderWidth: isActiveSegment ? 3 : 1,
          minWidth: Math.max(120, (chordTiming?.duration || 2) * 30), // Width based on chord duration
          shadowColor: isActiveSegment ? theme.primary : 'transparent',
          shadowOpacity: isActiveSegment ? 0.5 : 0,
          shadowRadius: isActiveSegment ? 4 : 0,
          shadowOffset: isActiveSegment ? { width: 0, height: 2 } : { width: 0, height: 0 },
          elevation: isActiveSegment ? 4 : 0,
        }
      ]}>
        <Text style={[styles.measureNumber, { 
          color: isActiveSegment ? '#FFFFFF' : theme.secondaryText,
          fontWeight: isActiveSegment ? 'bold' : 'normal',
          textShadowColor: isActiveSegment ? 'rgba(0,0,0,0.5)' : 'transparent',
          textShadowOffset: isActiveSegment ? { width: 1, height: 1 } : { width: 0, height: 0 },
          textShadowRadius: isActiveSegment ? 1 : 0,
        }]}>
          {chordTiming ? `${chordTiming.startTime.toFixed(1)}s` : 'Silence'}
        </Text>
        <View style={styles.beatsRow}>
          {beats.map((beat, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.beat,
                {
                  backgroundColor: isBeatActive(beat) && isPlaying
                    ? theme.primary + '50'
                    : isBeatUpcoming(beat)
                      ? theme.secondary + '25'
                      : isBeatPast(beat)
                        ? theme.divider + '30'
                        : 'transparent',
                  borderColor: isBeatActive(beat) && isPlaying ? theme.primary : 'transparent',
                  borderWidth: isBeatActive(beat) && isPlaying ? 2 : 0,
                  shadowColor: isBeatActive(beat) && isPlaying ? theme.primary : 'transparent',
                  shadowOpacity: isBeatActive(beat) && isPlaying ? 0.6 : 0,
                  shadowRadius: isBeatActive(beat) && isPlaying ? 3 : 0,
                  shadowOffset: isBeatActive(beat) && isPlaying ? { width: 0, height: 2 } : { width: 0, height: 0 },
                  elevation: isBeatActive(beat) && isPlaying ? 3 : 0,
                }
              ]}
              onPress={() => onSeekToTime(beat.time)}
            >
              {/* Chord symbol - Enhanced visibility */}
              {beat.isChordChange && (
                <Text style={[
                  styles.chordSymbol,
                  {
                    color: isBeatActive(beat) && isPlaying
                      ? '#FFFFFF'
                      : isBeatActive(beat) 
                        ? theme.primary 
                        : isBeatUpcoming(beat)
                          ? theme.secondary
                          : theme.text,
                    fontWeight: isBeatActive(beat) ? '900' : isBeatUpcoming(beat) ? '600' : 'normal',
                    fontSize: isBeatActive(beat) ? 18 : isBeatUpcoming(beat) ? 16 : 14,
                    textShadowColor: isBeatActive(beat) && isPlaying ? 'rgba(0,0,0,0.5)' : 'transparent',
                    textShadowOffset: isBeatActive(beat) && isPlaying ? { width: 1, height: 1 } : { width: 0, height: 0 },
                    textShadowRadius: isBeatActive(beat) && isPlaying ? 2 : 0,
                  }
                ]}>
                  {beat.chord || '∅'}
                </Text>
              )}
              
              {/* Beat indicator - Enhanced visibility */}
              <View style={[
                styles.beatIndicator,
                {
                  backgroundColor: isBeatActive(beat) && isPlaying
                    ? '#FFFFFF'
                    : isBeatActive(beat)
                      ? theme.primary
                      : beat.beatNumber === 1
                        ? theme.text
                        : theme.secondaryText,
                  opacity: isBeatActive(beat) && isPlaying ? 1 : 0.6,
                  transform: isBeatActive(beat) && isPlaying 
                    ? [{ scale: 1.4 }] 
                    : [{ scale: 1 }],
                  shadowColor: isBeatActive(beat) && isPlaying ? theme.primary : 'transparent',
                  shadowOpacity: isBeatActive(beat) && isPlaying ? 0.8 : 0,
                  shadowRadius: isBeatActive(beat) && isPlaying ? 2 : 0,
                  shadowOffset: isBeatActive(beat) && isPlaying ? { width: 0, height: 1 } : { width: 0, height: 0 },
                  elevation: isBeatActive(beat) && isPlaying ? 2 : 0,
                }
              ]} />
              
              {/* Duration indicator for chord changes - Enhanced visibility */}
              {beat.isChordChange && chordTiming && (
                <Text style={[
                  styles.beatNumber,
                  {
                    color: isBeatActive(beat) && isPlaying
                      ? '#FFFFFF'
                      : isBeatActive(beat) 
                        ? theme.primary 
                        : theme.secondaryText,
                    fontWeight: isBeatActive(beat) ? '900' : 'bold',
                    textShadowColor: isBeatActive(beat) && isPlaying ? 'rgba(0,0,0,0.5)' : 'transparent',
                    textShadowOffset: isBeatActive(beat) && isPlaying ? { width: 1, height: 1 } : { width: 0, height: 0 },
                    textShadowRadius: isBeatActive(beat) && isPlaying ? 1 : 0,
                  }
                ]}>
                  {chordTiming.duration.toFixed(1)}s
                </Text>
              )}

              {/* Playing indicator - Enhanced visibility */}
              {isBeatActive(beat) && isPlaying && (
                <View style={[styles.playingPulse, { 
                  backgroundColor: '#FFFFFF',
                  shadowColor: theme.primary,
                  shadowOpacity: 0.8,
                  shadowRadius: 3,
                  shadowOffset: { width: 0, height: 2 },
                  elevation: 3,
                }]} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };
  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>
          Rhythm Sheet • Real Timing
        </Text>
        <Text style={[styles.currentInfo, { color: theme.primary }]}>
          {(() => {
            const activeChord = chordProgression.find(c => 
              currentTime >= c.startTime && currentTime < c.startTime + c.duration
            );
            
            if (activeChord) {
              const progress = ((currentTime - activeChord.startTime) / activeChord.duration * 100).toFixed(0);
              return `${activeChord.chord} • ${progress}%`;
            }
            
            return rhythmSheet.length > 0 ? 'Ready to play' : 'No chords';
          })()}
        </Text>
      </View>
      
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.sheetScroll}
        contentContainerStyle={styles.sheetContent}
      >
        {segmentKeys.map(segmentKey => 
          renderChordSegment(segmentKey, segments[segmentKey])
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    margin: 16,
    marginTop: 8,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  currentInfo: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  sheetScroll: {
    maxHeight: 100,
  },
  sheetContent: {
    paddingLeft: 32, // Extra padding on left to ensure measure 1 is visible
    paddingRight: 16,
    paddingVertical: 12,
  },
  measure: {
    width: 180,
    marginRight: 8,
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
  },
  measureNumber: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  beatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  beat: {
    width: 35,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    position: 'relative',
  },
  chordSymbol: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  beatIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginBottom: 2,
  },
  beatNumber: {
    fontSize: 8,
    fontWeight: 'bold',
  },
  playingPulse: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default EmbeddedRhythmSheet;
