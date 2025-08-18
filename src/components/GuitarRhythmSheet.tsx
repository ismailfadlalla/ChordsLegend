import React from 'react';
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

interface GuitarRhythmSheetProps {
  chordProgression: ChordTiming[];
  currentTime: number;
  isPlaying: boolean;
  theme: any;
  onSeekToTime: (time: number) => void;
}

const GuitarRhythmSheet: React.FC<GuitarRhythmSheetProps> = ({
  chordProgression,
  currentTime,
  isPlaying,
  theme,
  onSeekToTime,
}) => {
  // Convert chord progression to rhythm sheet using actual chord timing
  const generateRhythmSheet = (): Beat[] => {
    const beats: Beat[] = [];
    
    if (chordProgression.length === 0) {
      return beats;
    }
    
    console.log('🎸 GuitarRhythmSheet: Generating rhythm sheet from', chordProgression.length, 'chords');
    
    // Create beats directly from chord timing, not fixed intervals
    chordProgression.forEach((chordTiming, index) => {
      const { chord, startTime, duration } = chordTiming;
      
      console.log(`🎸 Processing chord ${index + 1}: ${chord} at ${startTime.toFixed(1)}s for ${duration.toFixed(1)}s`);
      
      // Add a beat for the chord start (chord change)
      beats.push({
        chord,
        isChordChange: true,
        time: startTime,
        beatNumber: 1, // Main beat for this chord
        measure: index + 1, // Each chord gets its own "measure" for display
      });
      
      // If chord duration is long (>3 seconds), add subdivision beats to show progression
      if (duration > 3) {
        const subdivisions = Math.floor(duration / 3); // Every 3 seconds
        for (let i = 1; i < subdivisions; i++) {
          const subdivisionTime = startTime + (i * 3);
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
      
      // If there's a gap > 2 seconds, add a silence beat
      if (gap > 2) {
        beats.push({
          chord: '', // Empty chord for silence
          isChordChange: true,
          time: currentEnd,
          beatNumber: 1,
          measure: i + 0.5, // Between measures for sorting
        });
        console.log(`🎸 Added silence beat at ${currentEnd.toFixed(1)}s for ${gap.toFixed(1)}s gap`);
      }
    }
    
    // Sort beats by time
    beats.sort((a, b) => a.time - b.time);
    
    console.log('🎸 Generated', beats.length, 'beats from chord progression');
    return beats;
  };

  const rhythmSheet = generateRhythmSheet();
  
  // Group beats by chord segments instead of fixed measures
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
  
  const totalSegments = segmentKeys.length;
  const segmentsPerRow = 2; // Show 2 chord segments per row for better visibility

  // Group chord segments by rows
  const getSegmentRows = () => {
    const rows: { segmentKey: string; beats: Beat[] }[][] = [];
    
    for (let rowStart = 0; rowStart < segmentKeys.length; rowStart += segmentsPerRow) {
      const rowSegments = segmentKeys.slice(rowStart, rowStart + segmentsPerRow).map(key => ({
        segmentKey: key,
        beats: segments[key]
      }));
      if (rowSegments.length > 0) {
        rows.push(rowSegments);
      }
    }
    
    return rows;
  };

  const getCurrentBeat = () => {
    // Find the currently active chord
    const activeChord = chordProgression.find(c => 
      currentTime >= c.startTime && currentTime < c.startTime + c.duration
    );
    
    if (activeChord) {
      // Find the corresponding beat for this chord
      return rhythmSheet.find(beat => 
        beat.chord === activeChord.chord && beat.isChordChange
      );
    }
    
    // If no active chord, find closest beat by time
    return rhythmSheet.reduce((closest, beat) => {
      const currentDistance = Math.abs(beat.time - currentTime);
      const closestDistance = Math.abs(closest.time - currentTime);
      return currentDistance < closestDistance ? beat : closest;
    }, rhythmSheet[0]);
  };

  const isActiveBeat = (beat: Beat) => {
    // For chord change beats, check if we're in the chord's duration
    if (beat.isChordChange && beat.chord) {
      const chordTiming = chordProgression.find(c => 
        c.chord === beat.chord && Math.abs(c.startTime - beat.time) < 0.5
      );
      if (chordTiming) {
        return currentTime >= chordTiming.startTime && 
               currentTime < chordTiming.startTime + chordTiming.duration;
      }
    }
    
    // For subdivision beats, check if close to current time
    return Math.abs(beat.time - currentTime) < 1.5;
  };

  const isUpcomingBeat = (beat: Beat) => {
    return beat.time > currentTime && beat.time <= currentTime + 2;
  };

  const renderChordSegment = (segmentData: { segmentKey: string; beats: Beat[] }) => {
    const { segmentKey, beats } = segmentData;
    const mainBeat = beats.find(b => b.isChordChange) || beats[0];
    const chordTiming = chordProgression.find(c => c.chord === mainBeat.chord);
    const isActiveSegment = chordTiming && 
      currentTime >= chordTiming.startTime && 
      currentTime < chordTiming.startTime + chordTiming.duration;

    if (beats.length === 0) {
      return null;
    }

    return (
      <View key={segmentKey} style={[
        styles.measure, 
        { 
          borderColor: theme.divider,
          backgroundColor: isActiveSegment ? theme.primary + '10' : 'transparent',
        }
      ]}>
        <Text style={[styles.measureNumber, { color: theme.secondaryText }]}>
          {chordTiming ? `${chordTiming.startTime.toFixed(1)}s` : 'Silence'}
        </Text>
        <View style={styles.beatsContainer}>
          {beats.map((beat, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.beat,
                {
                  backgroundColor: isActiveBeat(beat) 
                    ? theme.primary + '40'
                    : isUpcomingBeat(beat)
                      ? theme.secondary + '20'
                      : 'transparent'
                }
              ]}
              onPress={() => onSeekToTime(beat.time)}
            >
              {/* Chord symbol */}
              {beat.isChordChange && (
                <Text style={[
                  styles.chordSymbol,
                  {
                    color: isActiveBeat(beat) ? theme.primary : theme.text,
                    fontWeight: isActiveBeat(beat) ? 'bold' : 'normal'
                  }
                ]}>
                  {beat.chord || '∅'}
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
                  opacity: isActiveBeat(beat) && isPlaying ? 1 : 0.6
                }
              ]} />
              
              {/* Duration indicator for chord changes */}
              {beat.isChordChange && chordTiming && (
                <Text style={[
                  styles.beatNumber,
                  {
                    color: isActiveBeat(beat) ? theme.primary : theme.secondaryText,
                    fontWeight: 'bold'
                  }
                ]}>
                  {chordTiming.duration.toFixed(1)}s
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderRow = (rowSegments: { segmentKey: string; beats: Beat[] }[], rowIndex: number) => {
    return (
      <View key={rowIndex} style={styles.row}>
        {rowSegments.map(segmentData => renderChordSegment(segmentData))}
      </View>
    );
  };
  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>
          Guitar Rhythm Sheet • Real Timing
        </Text>
        <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
          {totalSegments} chord segments • Tap any beat to seek
        </Text>
      </View>
      
      <ScrollView 
        style={styles.sheetContainer}
        showsVerticalScrollIndicator={false}
      >
        {getSegmentRows().map((rowSegments, index) => renderRow(rowSegments, index))}
        
        {/* Legend */}
        <View style={[styles.legend, { borderTopColor: theme.divider }]}>
          <Text style={[styles.legendTitle, { color: theme.text }]}>Legend:</Text>
          <View style={styles.legendRow}>
            <View style={[styles.legendItem, { backgroundColor: theme.primary + '40' }]} />
            <Text style={[styles.legendText, { color: theme.text }]}>Active Chord</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendItem, { backgroundColor: theme.secondary + '20' }]} />
            <Text style={[styles.legendText, { color: theme.text }]}>Upcoming Chord</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.beatIndicator, { backgroundColor: theme.text }]} />
            <Text style={[styles.legendText, { color: theme.text }]}>Chord Start</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    margin: 16,
    overflow: 'hidden',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
  },
  sheetContainer: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  measure: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    margin: 2,
    padding: 8,
    minHeight: 80,
  },
  measureNumber: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  beatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flex: 1,
  },
  beat: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    padding: 4,
    minHeight: 50,
  },
  chordSymbol: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  beatIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 2,
  },
  beatNumber: {
    fontSize: 8,
    fontWeight: 'bold',
  },
  legend: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  legendItem: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
  },
});

export default GuitarRhythmSheet;
