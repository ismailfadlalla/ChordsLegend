import React, { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

interface ChordTiming {
  chord: string;
  startTime: number;
  duration: number;
  section?: string;
}

interface SimpleChordSheetProps {
  chordProgression: ChordTiming[];
  currentTime: number;
  analysisInfo?: {
    bpm: number;
    key: string;
  };
}

const SimpleChordSheet: React.FC<SimpleChordSheetProps> = ({
  chordProgression,
  currentTime,
  analysisInfo
}) => {
  const scrollViewRef = useRef<any>(null);
  
  // Auto-scroll to current playing position
  useEffect(() => {
    if (scrollViewRef.current && currentTime > 0) {
      const scrollPosition = currentTime * 60 - 150; // 60px per second, offset by 150px for better centering
      scrollViewRef.current.scrollTo({
        x: Math.max(0, scrollPosition),
        animated: true
      });
    }
  }, [currentTime]);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎼 Chord Progression</Text>
      
      <View style={styles.sheetContainer}>
        {/* Tempo and Key Info */}
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>
            Tempo: {analysisInfo?.bpm || 120} BPM | Key: {analysisInfo?.key || 'Unknown'}
          </Text>
        </View>
        
        {/* Simple Horizontal Chord Layout with Synchronized Timing Lines */}
        <View style={styles.timingContainer}>
          {/* Scrollable timing ruler that moves with chords */}
          <ScrollView 
            ref={scrollViewRef}
            horizontal 
            showsHorizontalScrollIndicator={true}
            contentContainerStyle={[
              styles.scrollContent,
              { minWidth: Math.max(3600, (chordProgression[chordProgression.length - 1]?.startTime || 60) * 60 + 300) }
            ]}
            scrollEventThrottle={16}
          >
            {/* Timing ruler with vertical lines - now scrolls with chords */}
            <View style={styles.timingRuler}>
              {Array.from({ length: Math.max(60, Math.ceil((chordProgression[chordProgression.length - 1]?.startTime || 60) + 10)) }, (_, i) => (
                <View key={i} style={[
                  styles.timingLine,
                  i % 4 === 0 && styles.timingLineBold
                ]}>
                  {i % 4 === 0 && (
                    <Text style={styles.timingText}>{i}s</Text>
                  )}
                </View>
              ))}
            </View>
            
            {/* Chord progression with timing - positioned exactly with timing lines */}
            <View style={styles.chordRow}>
              {/* Current time indicator */}
              <View style={[
                styles.currentTimeIndicator,
                { left: currentTime * 60 }
              ]} />
              
              {chordProgression.map((chord, index) => {
                const isCurrentlyPlaying = currentTime >= chord.startTime && 
                                         currentTime < (chord.startTime + chord.duration);
                
                return (
                  <View key={index} style={[
                    styles.chordContainer,
                    { left: chord.startTime * 60 } // Position based on timing (60px per second)
                  ]}>
                    {/* Chord Name */}
                    <View style={[
                      styles.chordBox,
                      isCurrentlyPlaying && styles.chordBoxActive
                    ]}>
                      <Text style={[
                        styles.chordText,
                        isCurrentlyPlaying && styles.chordTextActive
                      ]}>
                        {chord.chord}
                      </Text>
                    </View>
                    
                    {/* Timing Display */}
                    <Text style={[
                      styles.timingDisplay,
                      isCurrentlyPlaying && styles.timingDisplayActive
                    ]}>
                      {chord.startTime.toFixed(1)}s
                    </Text>
                    
                    {/* Beat Number */}
                    <Text style={[
                      styles.beatNumber,
                      isCurrentlyPlaying && styles.beatNumberActive
                    ]}>
                      {index + 1}
                    </Text>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2E2E2E',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    height: 320, // Increased banner height
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  sheetContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 20, // Increased padding for more space
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  infoText: {
    color: '#666',
    fontSize: 14,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingHorizontal: 20,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    height: 200, // Increased height to accommodate timing ruler and chords
  },
  timingContainer: {
    flex: 1,
    position: 'relative',
  },
  timingRuler: {
    flexDirection: 'row',
    height: 40,
    marginBottom: 10,
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    zIndex: 1,
  },
  timingLine: {
    width: 60, // 1 second = 60px
    height: 100, // Increased height to reach chords
    borderLeftWidth: 1,
    borderLeftColor: '#ccc',
    position: 'relative',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  timingLineBold: {
    borderLeftWidth: 3, // Thicker bold lines
    borderLeftColor: '#333',
    height: 120, // Even taller for bold lines
  },
  timingText: {
    color: '#666',
    fontSize: 10,
    marginTop: 2,
    marginLeft: 2,
  },
  chordRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    height: 150, // Adjusted to work with timing ruler
    position: 'relative',
    width: '100%',
    marginTop: 50, // Space for timing ruler
    zIndex: 2,
  },
  chordContainer: {
    alignItems: 'center',
    minWidth: 60,
    position: 'absolute',
    bottom: 0,
    zIndex: 1,
  },
  chordBox: {
    backgroundColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10, // Increased for better touch target
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#666',
    minWidth: 50,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  chordBoxActive: {
    backgroundColor: '#FF6B35',
    borderWidth: 3,
    borderColor: '#FFAA44',
    shadowColor: '#FF6B35',
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 6,
  },
  chordText: {
    color: '#DDD',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  chordTextActive: {
    color: '#FFFFFF',
  },
  beatNumber: {
    color: '#999',
    fontSize: 16,
    fontWeight: 'normal',
  },
  beatNumberActive: {
    color: '#FF6B35',
    fontWeight: 'bold',
  },
  timingDisplay: {
    color: '#888',
    fontSize: 12,
    fontWeight: 'normal',
    marginBottom: 4,
  },
  timingDisplayActive: {
    color: '#FF6B35',
    fontWeight: 'bold',
  },
  currentTimeIndicator: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: '#FF6B35',
    zIndex: 10,
    shadowColor: '#FF6B35',
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 8,
  },
});

export default SimpleChordSheet;
