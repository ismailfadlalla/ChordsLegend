import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { CHORD_LIBRARY } from '../utils/chordLibrary';
import { Fretboard } from './Fretboard';
import SimpleChordSheet from './SimpleChordSheet';
import SimpleYouTubePlayer from './SimpleYouTubePlayer';

const { width: screenWidth } = Dimensions.get('window');

interface ChordTiming {
  chord: string;
  startTime: number;
  duration: number;
  section?: string;
}

interface SimpleSynchronizedChordPlayerProps {
  videoId: string;
  songTitle: string;
  chordProgression: ChordTiming[];
  onBack?: () => void;
  onChordAdjust?: (index: number, newChord: string) => void;
  analysisInfo?: {
    method: string;
    confidence: number;
    key: string;
    bpm: number;
    timeSignature: string;
  };
}

const SimpleSynchronizedChordPlayer: React.FC<SimpleSynchronizedChordPlayerProps> = ({
  videoId,
  songTitle,
  chordProgression,
  onBack,
  onChordAdjust,
  analysisInfo,
}) => {
  const { isDark, theme } = useTheme();
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentChordIndex, setCurrentChordIndex] = useState(0);
  const playerRef = useRef<any>(null);
  const scrollViewRef = useRef<any>(null);
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Single time sync system - simplified and stable
  useEffect(() => {
    if (isPlaying) {
      syncIntervalRef.current = setInterval(async () => {
        try {
          if (playerRef.current) {
            const time = await playerRef.current.getCurrentTime();
            setCurrentTime(time);

            // Find current chord
            const currentChord = chordProgression.find((chord, index) => {
              const isInTimeRange = time >= chord.startTime && time < chord.startTime + chord.duration;
              if (isInTimeRange) {
                setCurrentChordIndex(index);
              }
              return isInTimeRange;
            });
          }
        } catch (error) {
          console.log('Time sync error:', error);
        }
      }, 500); // Simple 500ms sync
    } else {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
        syncIntervalRef.current = null;
      }
    }

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, [isPlaying, chordProgression]);

  const handlePlay = () => {
    if (playerRef.current) {
      playerRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (playerRef.current) {
      playerRef.current.pause();
      setIsPlaying(false);
    }
  };

  const currentChord = chordProgression[currentChordIndex];
  const nextChordIndex = currentChordIndex + 1;
  const nextChord = nextChordIndex < chordProgression.length ? chordProgression[nextChordIndex] : null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🎸 {songTitle}</Text>
        <Text style={styles.info}>
          🎵 {chordProgression.length} chords | ⏱️ {Math.ceil(currentTime)}s
        </Text>
      </View>

      {/* YouTube Player */}
      <View style={styles.videoContainer}>
        <SimpleYouTubePlayer
          ref={playerRef}
          videoId={videoId}
          height={200}
          onTimeUpdate={setCurrentTime}
          onPlayingChange={setIsPlaying}
        />
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity onPress={handlePlay} style={styles.controlButton}>
          <Text style={styles.controlText}>▶️ Play</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePause} style={styles.controlButton}>
          <Text style={styles.controlText}>⏸️ Pause</Text>
        </TouchableOpacity>
        <Text style={styles.timeText}>
          Time: {currentTime.toFixed(1)}s
        </Text>
      </View>

      {/* Simple Chord Sheet (like screenshot) */}
      <SimpleChordSheet 
        chordProgression={chordProgression}
        currentTime={currentTime}
        analysisInfo={analysisInfo}
      />

      {/* Fretboard Section */}
      <View style={styles.fretboardContainer}>
        <Text style={styles.fretboardTitle}>
          🎼 Current Chord: {currentChord?.chord || 'None'}
        </Text>
        <View style={styles.fretboardGrid}>
          {/* Current Chord */}
          <View style={styles.fretboardItem}>
            <Text style={styles.fretboardLabel}>Current</Text>
            {currentChord && CHORD_LIBRARY[currentChord.chord] ? (
              <Fretboard
                chord={CHORD_LIBRARY[currentChord.chord]}
                size="medium"
                theme={theme}
                isHighlighted={true}
              />
            ) : (
              <View style={styles.emptyFretboard}>
                <Text style={styles.emptyText}>No chord</Text>
              </View>
            )}
          </View>

          {/* Next Chord */}
          <View style={styles.fretboardItem}>
            <Text style={styles.fretboardLabel}>Next</Text>
            {nextChord && CHORD_LIBRARY[nextChord.chord] ? (
              <Fretboard
                chord={CHORD_LIBRARY[nextChord.chord]}
                size="medium"
                theme={theme}
                isHighlighted={false}
              />
            ) : (
              <View style={styles.emptyFretboard}>
                <Text style={styles.emptyText}>End</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 10,
  },
  header: {
    marginBottom: 15,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  backText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 40,
  },
  info: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
  },
  videoContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    gap: 15,
  },
  controlButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  controlText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  timeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  fretboardContainer: {
    backgroundColor: '#2E2E2E',
    borderRadius: 12,
    padding: 15,
    flex: 1,
  },
  fretboardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  fretboardGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flex: 1,
  },
  fretboardItem: {
    alignItems: 'center',
    flex: 1,
  },
  fretboardLabel: {
    color: '#888',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptyFretboard: {
    width: 120,
    height: 120,
    backgroundColor: '#333',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
    fontSize: 14,
  },
});

export default SimpleSynchronizedChordPlayer;
