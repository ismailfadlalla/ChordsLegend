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

  // Convert chord progression to rhythm sheet with measures and beats
  const generateRhythmSheet = (): Beat[] => {
    const beats: Beat[] = [];
    const beatsPerMeasure = 4;
    const beatDuration = 1; // 1 second per beat (60 BPM)
    
    if (chordProgression.length === 0) return beats;
    
    const totalDuration = Math.max(
      ...chordProgression.map(c => c.startTime + c.duration)
    );
    
    const totalBeats = Math.ceil(totalDuration / beatDuration);
    
    for (let beatIndex = 0; beatIndex < totalBeats; beatIndex++) {
      const beatTime = beatIndex * beatDuration;
      const measure = Math.floor(beatIndex / beatsPerMeasure) + 1;
      const beatNumber = (beatIndex % beatsPerMeasure) + 1;
      
      // Find the chord that should be playing at this beat
      const activeChord = chordProgression.find(c => 
        beatTime >= c.startTime && beatTime < c.startTime + c.duration
      );
      
      // Check if this is a chord change (first beat of a new chord)
      const isChordChange = chordProgression.some(c => 
        Math.abs(c.startTime - beatTime) < 0.5
      );
      
      beats.push({
        chord: activeChord?.chord || '',
        isChordChange,
        time: beatTime,
        beatNumber,
        measure,
      });
    }
    
    return beats;
  };

  const rhythmSheet = generateRhythmSheet();
  
  // Auto-scroll to current position
  useEffect(() => {
    console.log('🎼 EmbeddedRhythmSheet: currentTime updated to', currentTime.toFixed(1), 'isPlaying:', isPlaying);
    
    if (scrollViewRef.current && isPlaying && rhythmSheet.length > 0) {
      // Find current beat index
      const currentBeatIndex = rhythmSheet.findIndex(beat => 
        Math.abs(beat.time - currentTime) < 0.5
      );

      if (currentBeatIndex >= 0) {
        const currentBeat = rhythmSheet[currentBeatIndex];
        console.log('🎼 Current beat:', currentBeat.beatNumber, 'measure:', currentBeat.measure, 'chord:', currentBeat.chord);
        
        // Calculate scroll position (each measure is about 200px wide)
        const currentMeasure = rhythmSheet[currentBeatIndex].measure;
        const scrollPosition = Math.max(0, (currentMeasure - 3) * 200); // Show 3 measures ahead to account for padding
        
        scrollViewRef.current.scrollTo({ 
          x: scrollPosition, 
          animated: true 
        });
      }
    }
  }, [currentTime, isPlaying, rhythmSheet]);

  const getCurrentBeat = () => {
    return rhythmSheet.find(beat => 
      Math.abs(beat.time - currentTime) < 0.5
    );
  };

  const isActiveBeat = (beat: Beat) => {
    return Math.abs(beat.time - currentTime) < 0.5;
  };

  const isUpcomingBeat = (beat: Beat) => {
    return beat.time > currentTime && beat.time <= currentTime + 4; // Next 4 beats
  };

  const isPastBeat = (beat: Beat) => {
    return beat.time < currentTime - 0.5;
  };

  // Group beats by measures for rendering
  const getMeasures = () => {
    const measures: { [key: number]: Beat[] } = {};
    rhythmSheet.forEach(beat => {
      if (!measures[beat.measure]) {
        measures[beat.measure] = [];
      }
      measures[beat.measure].push(beat);
    });
    return measures;
  };

  const measures = getMeasures();
  const measureNumbers = Object.keys(measures).map(Number).sort((a, b) => a - b);

  const renderMeasure = (measureNumber: number, beats: Beat[]) => {
    return (
      <View key={measureNumber} style={[styles.measure, { borderColor: theme.divider }]}>
        <Text style={[styles.measureNumber, { color: theme.secondaryText }]}>
          {measureNumber}
        </Text>
        <View style={styles.beatsRow}>
          {beats.map((beat, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.beat,
                {
                  backgroundColor: isActiveBeat(beat) && isPlaying
                    ? theme.primary + '40'
                    : isUpcomingBeat(beat)
                      ? theme.secondary + '20'
                      : isPastBeat(beat)
                        ? theme.divider + '20'
                        : 'transparent'
                }
              ]}
              onPress={() => onSeekToTime(beat.time)}
            >
              {/* Chord symbol */}
              {beat.isChordChange && beat.chord && (
                <Text style={[
                  styles.chordSymbol,
                  {
                    color: isActiveBeat(beat) 
                      ? theme.primary 
                      : isUpcomingBeat(beat)
                        ? theme.secondary
                        : theme.text,
                    fontWeight: isActiveBeat(beat) ? 'bold' : 'normal'
                  }
                ]}>
                  {beat.chord}
                </Text>
              )}
              
              {/* Beat indicator */}
              <View style={[
                styles.beatIndicator,
                {
                  backgroundColor: isActiveBeat(beat) && isPlaying
                    ? theme.primary
                    : beat.beatNumber === 1
                      ? theme.text
                      : theme.secondaryText,
                  opacity: isActiveBeat(beat) && isPlaying ? 1 : 0.6,
                  transform: isActiveBeat(beat) && isPlaying 
                    ? [{ scale: 1.2 }] 
                    : [{ scale: 1 }]
                }
              ]} />
              
              {/* Beat number */}
              <Text style={[
                styles.beatNumber,
                {
                  color: isActiveBeat(beat) 
                    ? theme.primary 
                    : theme.secondaryText,
                  fontWeight: beat.beatNumber === 1 ? 'bold' : 'normal'
                }
              ]}>
                {beat.beatNumber}
              </Text>

              {/* Playing indicator */}
              {isActiveBeat(beat) && isPlaying && (
                <View style={[styles.playingPulse, { backgroundColor: theme.primary }]} />
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
          Rhythm Sheet • ♩ = 60 BPM
        </Text>
        <Text style={[styles.currentInfo, { color: theme.primary }]}>
          {(() => {
            const currentBeat = getCurrentBeat();
            return currentBeat 
              ? `M${currentBeat.measure} • Beat ${currentBeat.beatNumber}`
              : 'Ready to play';
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
        {measureNumbers.map(measureNumber => 
          renderMeasure(measureNumber, measures[measureNumber])
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
