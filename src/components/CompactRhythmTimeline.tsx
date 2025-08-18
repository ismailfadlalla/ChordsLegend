import React, { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ChordTiming {
  chord: string;
  startTime: number;
  duration: number;
}

interface CompactRhythmTimelineProps {
  chordProgression: ChordTiming[];
  currentTime: number;
  isPlaying: boolean;
  theme: any;
  onSeekToTime: (time: number) => void;
}

const CompactRhythmTimeline: React.FC<CompactRhythmTimelineProps> = ({
  chordProgression,
  currentTime,
  isPlaying,
  theme,
  onSeekToTime,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const lastScrollInfo = useRef<{ index: number; time: number }>({ index: -1, time: 0 }); // Track last scrolled position and time

  // CRITICAL FIX: Auto-scroll to current position with stable highlighting and timing precision
  useEffect(() => {
    console.log('🎹 CompactRhythmTimeline: currentTime updated to', currentTime.toFixed(1), 'isPlaying:', isPlaying);
    
    if (scrollViewRef.current && chordProgression.length > 0) {
      // OPTIMIZED: Find current chord index with direct iteration for better performance and control
      let currentIndex = -1;
      let debugInfo = {};
      
      // First pass: find exact match within chord time range
      for (let i = 0; i < chordProgression.length; i++) {
        const chord = chordProgression[i];
        if (!chord) {
          continue;
        }
        
        const chordEnd = chord.startTime + chord.duration;
        // Use a small tolerance window for floating point precision
        const isInRange = currentTime >= (chord.startTime - 0.1) && currentTime < (chordEnd + 0.1);
        
        if (isInRange) {
          currentIndex = i;
          debugInfo = {
            index: i,
            chord: chord.chord,
            timeRange: `${chord.startTime.toFixed(1)}s - ${chordEnd.toFixed(1)}s`,
            currentTime: currentTime.toFixed(1),
            progress: `${Math.min(100, Math.max(0, ((currentTime - chord.startTime) / chord.duration * 100))).toFixed(0)}%`
          };
          break;
        }
      }
      
      // If no direct match but we're playing, find appropriate fallback
      if (currentIndex === -1 && isPlaying) {
        // Before first chord
        if (currentTime < chordProgression[0].startTime) {
          currentIndex = 0;
          debugInfo = {
            reason: 'PRE_SONG',
            chord: chordProgression[0].chord,
            timeUntilStart: (chordProgression[0].startTime - currentTime).toFixed(1) + 's'
          };
        }
        // After last chord
        else if (currentTime > chordProgression[chordProgression.length - 1].startTime + 
                           chordProgression[chordProgression.length - 1].duration) {
          currentIndex = chordProgression.length - 1;
          debugInfo = {
            reason: 'POST_SONG',
            chord: chordProgression[currentIndex].chord
          };
        }
        // In a gap between chords
        else {
          // Find the previous and next chords
          let prevIndex = -1;
          let nextIndex = -1;
          
          for (let i = 0; i < chordProgression.length - 1; i++) {
            const currentEnd = chordProgression[i].startTime + chordProgression[i].duration;
            const nextStart = chordProgression[i + 1].startTime;
            
            if (currentTime >= currentEnd && currentTime < nextStart) {
              prevIndex = i;
              nextIndex = i + 1;
              break;
            }
          }
          
          if (prevIndex >= 0 && nextIndex >= 0) {
            // We're in a gap, use the previous chord as fallback
            currentIndex = prevIndex;
            debugInfo = {
              reason: 'IN_GAP',
              prevChord: chordProgression[prevIndex].chord,
              nextChord: chordProgression[nextIndex].chord,
              gapPosition: `${(currentTime - (chordProgression[prevIndex].startTime + chordProgression[prevIndex].duration)).toFixed(1)}s into gap`
            };
          } else {
            // No clear gap, find nearest chord
            currentIndex = chordProgression.reduce((nearest, chord, index) => {
              const currentDistance = Math.abs(chord.startTime + (chord.duration / 2) - currentTime);
              const nearestDistance = Math.abs(chordProgression[nearest].startTime + 
                                           (chordProgression[nearest].duration / 2) - currentTime);
              return currentDistance < nearestDistance ? index : nearest;
            }, 0);
            
            debugInfo = {
              reason: 'NEAREST',
              chord: chordProgression[currentIndex].chord,
              distance: Math.abs(chordProgression[currentIndex].startTime - currentTime).toFixed(1) + 's'
            };
          }
        }
      }

      if (Object.keys(debugInfo).length > 0) {
        console.log('🎹 CHORD DETECTION:', debugInfo);
      }
      
      // IMPROVED SCROLL LOGIC: More stable, less jumpy scrolling
      if (currentIndex >= 0) {
        // Only scroll if:
        // 1. It's a different chord than last time
        // 2. OR enough time has passed (prevents excessive scrolling)
        // 3. OR it's the first scroll action (index was -1)
        const isNewChord = currentIndex !== lastScrollInfo.current.index;
        const timeSinceLastScroll = Date.now() - lastScrollInfo.current.time;
        const isTimeForRefresh = timeSinceLastScroll > 3000; // At least 3 seconds between scrolls for same chord
        const isFirstScroll = lastScrollInfo.current.index === -1;
        
        const shouldScroll = isNewChord || isTimeForRefresh || isFirstScroll;
        
        if (shouldScroll) {
          console.log('🎹 SCROLLING TO CHORD:', { 
            index: currentIndex,
            chord: chordProgression[currentIndex].chord,
            reason: isNewChord ? 'NEW_CHORD' : isFirstScroll ? 'FIRST_SCROLL' : 'REFRESH'
          });
          
          // Calculate scroll position for optimal viewing
          const itemWidth = 80; // Width of each chord item + margin
          const screenWidth = 300; // Approximate container width
          const targetPosition = screenWidth * 0.30; // 30% from left = good viewing position
          
          // CRITICAL FIX: More consistent scroll position calculation
          const scrollPosition = Math.max(0, (currentIndex * itemWidth) - targetPosition);
          
          // Smoother scrolling when playing, immediate when seeking
          scrollViewRef.current.scrollTo({ 
            x: scrollPosition, 
            animated: isPlaying && !isFirstScroll // Animate unless it's the first scroll
          });
          
          // Update last scrolled position with timestamp
          lastScrollInfo.current = { index: currentIndex, time: Date.now() };
        }
      }
    }
  }, [currentTime, isPlaying, chordProgression]);

  const getCurrentChordIndex = () => {
    // Enhanced chord index calculation with better stability
    if (chordProgression.length === 0) {
      return -1;
    }
    
    // Find the currently active chord based on timing
    const activeIndex = chordProgression.findIndex((chord, index) => {
      const chordEnd = chord.startTime + chord.duration;
      return currentTime >= chord.startTime && currentTime < chordEnd;
    });
    
    // If we found an active chord, use it
    if (activeIndex !== -1) {
      return activeIndex;
    }
    
    // If no active chord and we're playing, find the most appropriate chord to highlight
    if (isPlaying) {
      // If we're before the first chord, highlight the first chord
      if (currentTime < chordProgression[0].startTime) {
        return 0;
      }
      
      // If we're after the last chord, highlight the last chord
      const lastChord = chordProgression[chordProgression.length - 1];
      if (currentTime >= lastChord.startTime + lastChord.duration) {
        return chordProgression.length - 1;
      }
      
      // If we're in a silence period between chords, find the next upcoming chord
      const nextIndex = chordProgression.findIndex(chord => currentTime < chord.startTime);
      if (nextIndex !== -1) {
        return nextIndex;
      }
    }
    
    // Default: no highlighting during silence when not playing
    return -1;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentChordIndex = getCurrentChordIndex();

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>
          Rhythm Timeline
        </Text>
        <Text style={[styles.timeIndicator, { color: theme.primary }]}>
          {formatTime(currentTime)}
        </Text>
      </View>
      
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.timeline}
        contentContainerStyle={styles.timelineContent}
      >
        {chordProgression.map((chord, index) => {
          // Use enhanced chord index calculation for stable highlighting
          const currentChordIndex = getCurrentChordIndex();
          const isActive = index === currentChordIndex;
          const isPast = currentTime > chord.startTime + chord.duration;
          const isNext = index === currentChordIndex + 1;
          const isUpcoming = index > currentChordIndex && index <= currentChordIndex + 3;
          
          // Enhanced highlighting that persists better during scrolling
          const isHighlighted = isActive || 
                               (currentChordIndex === -1 && index === 0 && currentTime < chord.startTime) ||
                               (currentChordIndex === -1 && index === chordProgression.length - 1 && currentTime > chord.startTime + chord.duration);
          
          // Calculate progress within current chord
          const progress = isActive ? 
            Math.min(1, Math.max(0, (currentTime - chord.startTime) / chord.duration)) : 
            isPast ? 1 : 0;

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.chordItem,
                {
                  backgroundColor: isHighlighted 
                    ? theme.primary + '40'
                    : isNext 
                      ? theme.secondary + '25'
                      : isUpcoming 
                        ? theme.surface + '80'
                        : isPast 
                          ? theme.divider + '30'
                          : theme.surface,
                  borderColor: isHighlighted 
                    ? theme.primary 
                    : isNext 
                      ? theme.secondary 
                      : 'transparent',
                  borderWidth: isHighlighted ? 3 : isNext ? 2 : 1,
                  shadowColor: isHighlighted ? theme.primary : 'transparent',
                  shadowOpacity: isHighlighted ? 0.5 : 0,
                  shadowRadius: isHighlighted ? 4 : 0,
                  shadowOffset: isHighlighted ? { width: 0, height: 2 } : { width: 0, height: 0 },
                  elevation: isHighlighted ? 4 : 0,
                }
              ]}
              onPress={() => onSeekToTime(chord.startTime)}
            >
              {/* Progress bar for current chord - Enhanced visibility */}
              {isHighlighted && (
                <View style={[styles.progressBar, { backgroundColor: theme.divider + '60' }]}>
                  <View 
                    style={[
                      styles.progressFill,
                      { 
                        backgroundColor: theme.primary,
                        width: `${progress * 100}%`,
                        shadowColor: theme.primary,
                        shadowOpacity: 0.8,
                        shadowRadius: 2,
                        shadowOffset: { width: 0, height: 0 },
                        elevation: 2,
                      }
                    ]}
                  />
                </View>
              )}
              
              {/* Chord name - Enhanced visibility for highlighted chord */}
              <Text style={[
                styles.chordName,
                {
                  color: isHighlighted 
                    ? '#FFFFFF'
                    : isNext 
                      ? theme.secondary
                      : isPast 
                        ? theme.secondaryText + '80'
                        : theme.text,
                  fontWeight: isHighlighted ? '900' : isNext ? '600' : 'normal',
                  fontSize: isHighlighted ? 18 : isNext ? 16 : 14,
                  textShadowColor: isHighlighted ? 'rgba(0,0,0,0.5)' : 'transparent',
                  textShadowOffset: isHighlighted ? { width: 1, height: 1 } : { width: 0, height: 0 },
                  textShadowRadius: isHighlighted ? 2 : 0,
                }
              ]}>
                {chord.chord}
              </Text>
              
              {/* Time indicator - Enhanced visibility for highlighted chord */}
              <Text style={[
                styles.timeText,
                { 
                  color: isHighlighted ? '#FFFFFF' : isNext ? theme.secondary : theme.secondaryText,
                  fontSize: isHighlighted ? 13 : isNext ? 12 : 11,
                  fontWeight: isHighlighted ? 'bold' : 'normal',
                  textShadowColor: isHighlighted ? 'rgba(0,0,0,0.5)' : 'transparent',
                  textShadowOffset: isHighlighted ? { width: 1, height: 1 } : { width: 0, height: 0 },
                  textShadowRadius: isHighlighted ? 1 : 0,
                }
              ]}>
                {formatTime(chord.startTime)}
              </Text>
              
              {/* Duration indicator - Enhanced for highlighted chord */}
              <Text style={[
                styles.durationText,
                { 
                  color: isHighlighted ? '#FFFFFF' : theme.secondaryText,
                  fontWeight: isHighlighted ? 'bold' : 'normal',
                  textShadowColor: isHighlighted ? 'rgba(0,0,0,0.5)' : 'transparent',
                  textShadowOffset: isHighlighted ? { width: 1, height: 1 } : { width: 0, height: 0 },
                  textShadowRadius: isHighlighted ? 1 : 0,
                }
              ]}>
                {chord.duration.toFixed(1)}s
              </Text>
              
              {/* Status indicators - Enhanced visibility */}
              {isActive && isPlaying && (
                <View style={[styles.playingIndicator, { 
                  backgroundColor: '#FFFFFF',
                  shadowColor: theme.primary,
                  shadowOpacity: 0.8,
                  shadowRadius: 3,
                  shadowOffset: { width: 0, height: 2 },
                  elevation: 3,
                }]}>
                  <Text style={[styles.playingIcon, { color: theme.primary }]}>♪</Text>
                </View>
              )}
              
              {isNext && (
                <Text style={[styles.nextLabel, { 
                  color: theme.secondary,
                  fontWeight: 'bold',
                  textShadowColor: 'rgba(255,255,255,0.8)',
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 1,
                }]}>
                  NEXT
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      
      {/* Timeline controls */}
      <View style={styles.controls}>
        <Text style={[styles.positionText, { color: theme.secondaryText }]}>
          Chord {currentChordIndex + 1} of {chordProgression.length}
        </Text>
        <View style={[styles.globalProgress, { backgroundColor: theme.divider }]}>
          <View 
            style={[
              styles.globalProgressFill,
              { 
                backgroundColor: theme.primary,
                width: `${((currentChordIndex + 1) / chordProgression.length) * 100}%`
              }
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    margin: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
  timeIndicator: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  timeline: {
    maxHeight: 120,
  },
  timelineContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  chordItem: {
    width: 75,
    height: 90,
    marginRight: 8,
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  progressBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    borderRadius: 1.5,
  },
  progressFill: {
    height: '100%',
    borderRadius: 1.5,
  },
  chordName: {
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  timeText: {
    fontFamily: 'monospace',
    marginBottom: 2,
  },
  durationText: {
    fontSize: 11,
    fontFamily: 'monospace',
  },
  playingIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playingIcon: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  nextLabel: {
    position: 'absolute',
    bottom: 2,
    fontSize: 10,
    fontWeight: 'bold',
  },
  controls: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  positionText: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
  },
  globalProgress: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  globalProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
});

export default CompactRhythmTimeline;
