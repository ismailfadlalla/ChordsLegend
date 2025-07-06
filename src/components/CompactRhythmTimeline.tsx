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

  // Auto-scroll to current position
  useEffect(() => {
    console.log('🎹 CompactRhythmTimeline: currentTime updated to', currentTime.toFixed(1), 'isPlaying:', isPlaying);
    
    if (scrollViewRef.current && isPlaying) {
      // Find current chord index
      const currentIndex = chordProgression.findIndex((chord, index) => {
        const nextChord = chordProgression[index + 1];
        return currentTime >= chord.startTime && 
               (!nextChord || currentTime < nextChord.startTime);
      });

      if (currentIndex >= 0) {
        const currentChord = chordProgression[currentIndex];
        console.log('🎹 Current chord in timeline:', currentChord.chord, 'at index:', currentIndex);
        
        // Scroll to show current chord in center
        const itemWidth = 80; // Width of each chord item
        const scrollPosition = Math.max(0, (currentIndex * itemWidth) - 150); // Center with offset
        
        scrollViewRef.current.scrollTo({ 
          x: scrollPosition, 
          animated: true 
        });
      }
    }
  }, [currentTime, isPlaying, chordProgression]);

  const getCurrentChordIndex = () => {
    return chordProgression.findIndex((chord, index) => {
      const nextChord = chordProgression[index + 1];
      return currentTime >= chord.startTime && 
             (!nextChord || currentTime < nextChord.startTime);
    });
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
          const isActive = index === currentChordIndex;
          const isPast = currentTime > chord.startTime + chord.duration;
          const isNext = index === currentChordIndex + 1;
          const isUpcoming = index > currentChordIndex && index <= currentChordIndex + 3;
          
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
                  backgroundColor: isActive 
                    ? theme.primary + '30'
                    : isNext 
                      ? theme.secondary + '20'
                      : isUpcoming 
                        ? theme.surface + '80'
                        : isPast 
                          ? theme.divider + '20'
                          : theme.surface,
                  borderColor: isActive 
                    ? theme.primary 
                    : isNext 
                      ? theme.secondary 
                      : 'transparent',
                  borderWidth: isActive || isNext ? 2 : 1,
                }
              ]}
              onPress={() => onSeekToTime(chord.startTime)}
            >
              {/* Progress bar for current chord */}
              {isActive && (
                <View style={[styles.progressBar, { backgroundColor: theme.divider }]}>
                  <View 
                    style={[
                      styles.progressFill,
                      { 
                        backgroundColor: theme.primary,
                        width: `${progress * 100}%`
                      }
                    ]}
                  />
                </View>
              )}
              
              {/* Chord name */}
              <Text style={[
                styles.chordName,
                {
                  color: isActive 
                    ? theme.primary 
                    : isNext 
                      ? theme.secondary
                      : isPast 
                        ? theme.secondaryText + '80'
                        : theme.text,
                  fontWeight: isActive ? 'bold' : isNext ? '600' : 'normal',
                  fontSize: isActive ? 16 : 14
                }
              ]}>
                {chord.chord}
              </Text>
              
              {/* Time indicator */}
              <Text style={[
                styles.timeText,
                { 
                  color: isActive ? theme.primary : theme.secondaryText,
                  fontSize: isActive ? 11 : 10
                }
              ]}>
                {formatTime(chord.startTime)}
              </Text>
              
              {/* Duration indicator */}
              <Text style={[
                styles.durationText,
                { color: theme.secondaryText }
              ]}>
                {chord.duration}s
              </Text>
              
              {/* Status indicators */}
              {isActive && isPlaying && (
                <View style={[styles.playingIndicator, { backgroundColor: theme.primary }]}>
                  <Text style={styles.playingIcon}>♪</Text>
                </View>
              )}
              
              {isNext && (
                <Text style={[styles.nextLabel, { color: theme.secondary }]}>
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
    fontSize: 9,
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
    fontSize: 10,
    fontWeight: 'bold',
  },
  nextLabel: {
    position: 'absolute',
    bottom: 2,
    fontSize: 8,
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
