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
  const measuresPerRow = 4;
  const totalMeasures = Math.max(...rhythmSheet.map(b => b.measure));
  
  // Group beats by measures and rows
  const getMeasureRows = () => {
    const rows: Beat[][] = [];
    
    for (let rowStart = 1; rowStart <= totalMeasures; rowStart += measuresPerRow) {
      const rowBeats = rhythmSheet.filter(beat => 
        beat.measure >= rowStart && beat.measure < rowStart + measuresPerRow
      );
      if (rowBeats.length > 0) {
        rows.push(rowBeats);
      }
    }
    
    return rows;
  };

  const getCurrentBeat = () => {
    return rhythmSheet.find(beat => 
      Math.abs(beat.time - currentTime) < 0.5
    );
  };

  const isActiveBeat = (beat: Beat) => {
    return Math.abs(beat.time - currentTime) < 0.5;
  };

  const isUpcomingBeat = (beat: Beat) => {
    return beat.time > currentTime && beat.time <= currentTime + 2;
  };

  const renderMeasure = (measureBeats: Beat[], measureNumber: number) => {
    const beats = measureBeats.filter(b => b.measure === measureNumber);
    if (beats.length === 0) return null;

    return (
      <View key={measureNumber} style={[styles.measure, { borderColor: theme.divider }]}>
        <Text style={[styles.measureNumber, { color: theme.secondaryText }]}>
          {measureNumber}
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
              {beat.isChordChange && beat.chord && (
                <Text style={[
                  styles.chordSymbol,
                  {
                    color: isActiveBeat(beat) ? theme.primary : theme.text,
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
                  opacity: isActiveBeat(beat) && isPlaying ? 1 : 0.6
                }
              ]} />
              
              {/* Beat number */}
              <Text style={[
                styles.beatNumber,
                {
                  color: isActiveBeat(beat) ? theme.primary : theme.secondaryText,
                  fontWeight: beat.beatNumber === 1 ? 'bold' : 'normal'
                }
              ]}>
                {beat.beatNumber}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderRow = (rowBeats: Beat[], rowIndex: number) => {
    const measureNumbers = [...new Set(rowBeats.map(b => b.measure))].sort((a, b) => a - b);
    
    return (
      <View key={rowIndex} style={styles.row}>
        {measureNumbers.map(measureNumber => 
          renderMeasure(rowBeats, measureNumber)
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>
          Guitar Rhythm Sheet
        </Text>
        <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
          ♩ = 60 BPM • {totalMeasures} measures • Tap any beat to seek
        </Text>
      </View>
      
      <ScrollView 
        style={styles.sheetContainer}
        showsVerticalScrollIndicator={false}
      >
        {getMeasureRows().map((rowBeats, index) => renderRow(rowBeats, index))}
        
        {/* Legend */}
        <View style={[styles.legend, { borderTopColor: theme.divider }]}>
          <Text style={[styles.legendTitle, { color: theme.text }]}>Legend:</Text>
          <View style={styles.legendRow}>
            <View style={[styles.legendItem, { backgroundColor: theme.primary + '40' }]} />
            <Text style={[styles.legendText, { color: theme.text }]}>Current Beat</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendItem, { backgroundColor: theme.secondary + '20' }]} />
            <Text style={[styles.legendText, { color: theme.text }]}>Upcoming Beat</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.beatIndicator, { backgroundColor: theme.text }]} />
            <Text style={[styles.legendText, { color: theme.text }]}>Strong Beat (1)</Text>
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
