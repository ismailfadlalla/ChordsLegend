import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList, Modal, ScrollView, StyleSheet, Text,
  TouchableOpacity, View
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { CHORD_LIBRARY } from '../utils/chordLibrary';
import CompactRhythmTimeline from './CompactRhythmTimeline';
import EmbeddedRhythmSheet from './EmbeddedRhythmSheet';
import { ChordFingering, Fretboard } from './Fretboard';
import UnifiedYouTubePlayer, { YouTubePlayerRef } from './UnifiedYouTubePlayer';

interface ChordTiming {
  chord: string;
  startTime: number; // in seconds
  duration: number; // in seconds
}

interface SynchronizedChordPlayerProps {
  videoId: string;
  songTitle: string;
  chordProgression: ChordTiming[];
  onBack?: () => void;
}

export const SynchronizedChordPlayer: React.FC<SynchronizedChordPlayerProps> = ({
  videoId,
  songTitle,
  chordProgression,
  onBack,
}) => {
  const { theme } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentChordIndex, setCurrentChordIndex] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  const [fingeringStyle, setFingeringStyle] = useState<'open' | 'barre' | 'movable'>('open');
  const [fingeringLocked, setFingeringLocked] = useState(false);
  const [showFingeringModal, setShowFingeringModal] = useState(false);
  const [fretboardSize, setFretboardSize] = useState<'small' | 'medium' | 'large'>('large');
  const [forcePlayerState, setForcePlayerState] = useState<'play' | 'pause' | 'idle'>('idle');
  const [timingOffset, setTimingOffset] = useState(0); // Offset in seconds to align chords with song

  const playerRef = useRef<YouTubePlayerRef>(null);

  // Get current chord based on YouTube player time with improved accuracy
  const getCurrentChord = useCallback(() => {
    if (chordProgression.length === 0) return null;
    
    // Apply timing offset
    const adjustedTime = currentTime + timingOffset;
    
    // Find chord that should be playing at current time
    const activeChord = chordProgression.find((chord, index) => {
      const nextChord = chordProgression[index + 1];
      const isInTimeRange = adjustedTime >= chord.startTime && 
                           (!nextChord || adjustedTime < nextChord.startTime);
      
      if (isInTimeRange) {
        console.log(`🎸 Current chord at ${adjustedTime.toFixed(1)}s: ${chord.chord} (${chord.startTime}s - ${chord.startTime + chord.duration}s)`);
      }
      
      return isInTimeRange;
    });
    
    return activeChord || chordProgression[0];
  }, [currentTime, chordProgression, timingOffset]);

  // Get next chord for preview
  const getNextChord = useCallback(() => {
    if (chordProgression.length === 0) return null;
    
    // Apply timing offset
    const adjustedTime = currentTime + timingOffset;
    
    const currentIndex = chordProgression.findIndex(chord => {
      const nextChord = chordProgression[chordProgression.indexOf(chord) + 1];
      return adjustedTime >= chord.startTime && 
             (!nextChord || adjustedTime < nextChord.startTime);
    });
    
    return currentIndex >= 0 && currentIndex < chordProgression.length - 1 
      ? chordProgression[currentIndex + 1] 
      : null;
  }, [currentTime, chordProgression, timingOffset]);

  // Update current chord index based on time with better tracking
  useEffect(() => {
    if (chordProgression.length === 0) return;
    
    // Apply timing offset to current time for chord matching
    const adjustedTime = currentTime + timingOffset;
    
    // Find chord that should be playing at current time
    const activeChordIndex = chordProgression.findIndex((chord, index) => {
      const nextChord = chordProgression[index + 1];
      return adjustedTime >= chord.startTime && 
             (!nextChord || adjustedTime < nextChord.startTime);
    });
    
    if (activeChordIndex !== -1 && activeChordIndex !== currentChordIndex) {
      const activeChord = chordProgression[activeChordIndex];
      console.log('🎵 Chord progression update:', {
        time: currentTime.toFixed(1),
        adjustedTime: adjustedTime.toFixed(1),
        chord: activeChord.chord,
        index: activeChordIndex + 1,
        total: chordProgression.length,
        nextChord: chordProgression[activeChordIndex + 1]?.chord || 'End'
      });
      setCurrentChordIndex(activeChordIndex);
    }
  }, [currentTime, chordProgression, currentChordIndex, timingOffset]);

  // Handle YouTube player time updates - this syncs with actual video playback
  const handlePlayerTimeUpdate = useCallback((time: number) => {
    // Add debugging to see if time updates are being received
    if (time % 2 < 0.5) { // Log every 2 seconds to avoid spam
      console.log('🎵 SynchronizedChordPlayer received time update:', time.toFixed(1));
    }
    setCurrentTime(time);
  }, []);

  // Handle YouTube player state changes
  const handlePlayerStateChange = useCallback((playing: boolean) => {
    console.log('SynchronizedChordPlayer state change - playing:', playing);
    
    // If YouTube starts playing but our state says not playing, sync up
    if (playing && !isPlaying) {
      console.log('🎬 YouTube started playing - syncing chord player state');
      setIsPlaying(true);
    } else if (!playing && isPlaying) {
      console.log('⏸️ YouTube paused - syncing chord player state');
      setIsPlaying(false);
    }
    
    if (playing && !fingeringLocked) {
      setFingeringLocked(true);
    }
  }, [fingeringLocked, isPlaying]);

  // Force player state changes when buttons are pressed
  useEffect(() => {
    if (forcePlayerState === 'play' && playerRef.current) {
      console.log('🎵 Forcing player to play');
      playerRef.current.play();
      setForcePlayerState('idle');
    } else if (forcePlayerState === 'pause' && playerRef.current) {
      console.log('⏸️ Forcing player to pause');
      playerRef.current.pause();
      setForcePlayerState('idle');
    }
  }, [forcePlayerState]);

  // Get chord fingering based on style preference
  const getChordFingering = useCallback((chordName: string): ChordFingering | null => {
    const chordDef = CHORD_LIBRARY[chordName];
    if (!chordDef || !chordDef.fingerings.length) {
      console.warn('No chord definition found for:', chordName);
      return null;
    }

    // Find fingering based on preferred style
    const preferredFingering = chordDef.fingerings.find(f => f.type === fingeringStyle);
    const result = preferredFingering || chordDef.fingerings[0];
    console.log('Found fingering for', chordName, ':', result);
    return result;
  }, [fingeringStyle]);

  const handleStartOver = () => {
    console.log('🔄 Starting over - resetting to beginning');
    // Reset player and time
    if (playerRef.current) {
      playerRef.current.seekTo(0);
    }
    setCurrentTime(0);
    setCurrentChordIndex(0);
    setIsPlaying(false);
    setForcePlayerState('pause');
  };

  const handleLoop = () => {
    setIsLooping(!isLooping);
    // Note: Loop will be handled by the YouTube player's onStateChange
  };

  // Handle seeking to specific chord
  const handleSeekToChord = (chordIndex: number) => {
    const chord = chordProgression[chordIndex];
    if (chord && playerRef.current) {
      playerRef.current.seekTo(chord.startTime);
      setCurrentTime(chord.startTime);
      setCurrentChordIndex(chordIndex);
    }
  };

  const renderChordProgress = () => {
    return (
      <View style={styles.progressContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {chordProgression.map((item, index) => {
            const isActive = index === currentChordIndex;
            const isPast = currentTime > item.startTime + item.duration;
            const isUpcoming = currentTime < item.startTime;
            
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.chordProgressItem,
                  {
                    backgroundColor: isActive 
                      ? theme.primary 
                      : isPast 
                        ? theme.primary + '40'
                        : theme.surface,
                    borderColor: isActive ? theme.primary : theme.divider,
                  }
                ]}
                onPress={() => handleSeekToChord(index)}
              >
                <Text style={[
                  styles.chordProgressText,
                  { 
                    color: isActive ? '#fff' : theme.text,
                    fontWeight: isActive ? 'bold' : 'normal'
                  }
                ]}>
                  {item.chord}
                </Text>
                <Text style={[
                  styles.chordTimeText,
                  { color: isActive ? '#fff' : theme.secondaryText }
                ]}>
                  {Math.floor(item.startTime)}s
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  const renderFingeringModal = () => {
    const currentChord = getCurrentChord();
    if (!currentChord) return null;

    const chordDef = CHORD_LIBRARY[currentChord.chord];
    if (!chordDef) return null;

    return (
      <Modal
        visible={showFingeringModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFingeringModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                Choose {currentChord.chord} Fingering Style
              </Text>
              <TouchableOpacity
                onPress={() => setShowFingeringModal(false)}
                style={styles.closeButton}
              >
                <Text style={[styles.closeButtonText, { color: theme.text }]}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={chordDef.fingerings}
              keyExtractor={(item, index) => `${item.type}-${index}`}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={[
                    styles.fingeringOption,
                    {
                      backgroundColor: fingeringStyle === item.type ? theme.primary + '20' : 'transparent',
                      borderColor: fingeringStyle === item.type ? theme.primary : theme.divider,
                    }
                  ]}
                  onPress={() => {
                    setFingeringStyle(item.type);
                    setShowFingeringModal(false);
                  }}
                >
                  <View style={styles.fingeringPreview}>
                    <Fretboard
                      chord={currentChord.chord}
                      fingering={item}
                      theme={theme}
                      size="small"
                    />
                  </View>
                  <Text style={[styles.fingeringLabel, { color: theme.text }]}>
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)} - {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    );
  };

  const currentChord = getCurrentChord();
  const currentFingering = currentChord ? getChordFingering(currentChord.chord) : null;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={[styles.backButtonText, { color: theme.primary }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.songTitle, { color: theme.text }]} numberOfLines={2}>
          {songTitle}
        </Text>
        <Text style={{ color: theme.secondaryText, fontSize: 12, fontFamily: 'monospace' }}>
          Debug: {currentTime.toFixed(1)}s | Chord {currentChordIndex + 1}/{chordProgression.length} | Playing: {isPlaying ? 'Yes' : 'No'} | Offset: {timingOffset > 0 ? '+' : ''}{timingOffset}s
          {chordProgression[currentChordIndex] && (
            <Text> | Current: {chordProgression[currentChordIndex].chord} ({chordProgression[currentChordIndex].startTime}s)</Text>
          )}
        </Text>
      </View>

      <ScrollView style={styles.content}>
        {/* YouTube Player */}
        <View style={styles.playerContainer}>
          <UnifiedYouTubePlayer
            ref={playerRef}
            videoId={videoId}
            height={200}
            playing={isPlaying}
            onTimeUpdate={handlePlayerTimeUpdate}
            onPlayingChange={handlePlayerStateChange}
            onChangeState={(state) => {
              console.log('Player state changed:', state);
            }}
          />
        </View>

        {/* Controls */}
        <View style={[styles.controls, { backgroundColor: theme.surface }]}>
          <TouchableOpacity
            style={[
              styles.controlButton, 
              { 
                backgroundColor: isPlaying ? theme.secondary : theme.primary,
                flex: 1 
              }
            ]}
            onPress={() => {
              console.log('🎵 Play/Pause button pressed, current state:', isPlaying);
              if (isPlaying) {
                // Pause playback
                console.log('⏸️ Pausing playback');
                setIsPlaying(false);
                setForcePlayerState('pause');
              } else {
                // Start playback and chord progression
                console.log('▶️ Starting synchronized playback');
                setIsPlaying(true);
                setForcePlayerState('play');
              }
            }}
          >
            <Text style={styles.controlButtonText}>
              {isPlaying ? '⏸️ Pause' : '▶️ Start Playing'} 
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: theme.secondary }]}
            onPress={handleStartOver}
          >
            <Text style={styles.controlButtonText}>🔄 Start Over</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.controlButton,
              { backgroundColor: isLooping ? theme.primary : theme.secondary }
            ]}
            onPress={handleLoop}
          >
            <Text style={styles.controlButtonText}>🔁 Loop</Text>
          </TouchableOpacity>

          {!fingeringLocked && (
            <TouchableOpacity
              style={[styles.controlButton, { backgroundColor: theme.primary }]}
              onPress={() => setShowFingeringModal(true)}
            >
              <Text style={styles.controlButtonText}>🎸 Style</Text>
            </TouchableOpacity>
          )}

          {/* Timing adjustment controls */}
          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: theme.secondary }]}
            onPress={() => setTimingOffset(offset => Math.max(-10, offset - 0.5))}
          >
            <Text style={styles.controlButtonText}>⏪ -0.5s</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: theme.secondary }]}
            onPress={() => setTimingOffset(offset => Math.min(10, offset + 0.5))}
          >
            <Text style={styles.controlButtonText}>⏩ +0.5s</Text>
          </TouchableOpacity>

          {timingOffset !== 0 && (
            <TouchableOpacity
              style={[styles.controlButton, { backgroundColor: '#ff6b6b' }]}
              onPress={() => setTimingOffset(0)}
            >
              <Text style={styles.controlButtonText}>↩️ Reset</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Unified View: Rhythm Timeline + Sheet + Fretboard */}
        
        {/* Compact Rhythm Timeline */}
        <CompactRhythmTimeline
          chordProgression={chordProgression}
          currentTime={currentTime + timingOffset}
          isPlaying={isPlaying}
          theme={theme}
          onSeekToTime={(time) => {
            if (playerRef.current) {
              playerRef.current.seekTo(time - timingOffset); // Adjust for offset when seeking
              setCurrentTime(time - timingOffset);
            }
          }}
        />

        {/* Embedded Rhythm Sheet */}
        <EmbeddedRhythmSheet
          chordProgression={chordProgression}
          currentTime={currentTime + timingOffset}
          isPlaying={isPlaying}
          theme={theme}
          onSeekToTime={(time) => {
            if (playerRef.current) {
              playerRef.current.seekTo(time - timingOffset); // Adjust for offset when seeking
              setCurrentTime(time - timingOffset);
            }
          }}
        />

        {/* Current Chord Display with Next Chord Preview */}
        {(() => {
          const currentChord = getCurrentChord();
          const nextChord = getNextChord();
          const currentFingering = currentChord ? getChordFingering(currentChord.chord) : null;
          const nextFingering = nextChord ? getChordFingering(nextChord.chord) : null;
          
          return currentChord && currentFingering ? (
              <View style={[styles.chordDisplay, { backgroundColor: theme.surface }]}>
                <View style={styles.currentNextContainer}>
                  {/* Current Chord */}
                  <View style={styles.currentChordSection}>
                    <Text style={[styles.currentChordLabel, { color: theme.text }]}>
                      Now Playing
                    </Text>
                    <Text style={[styles.chordName, { color: theme.primary }]}>
                      {currentChord.chord}
                    </Text>
                    <View style={styles.fretboardContainer}>
                      <Fretboard
                        chord={currentChord.chord}
                        fingering={currentFingering}
                        theme={theme}
                        size={fretboardSize}
                        isHighlighted={isPlaying}
                        animationDelay={0}
                      />
                    </View>
                  </View>

                  {/* Next Chord Preview */}
                  {nextChord && nextFingering && (
                    <View style={styles.nextChordSection}>
                      <Text style={[styles.nextChordLabel, { color: theme.secondaryText }]}>
                        Next Up
                      </Text>
                      <Text style={[styles.nextChordName, { color: theme.text }]}>
                        {nextChord.chord}
                      </Text>
                      <Text style={[styles.nextChordTime, { color: theme.secondaryText }]}>
                        in {Math.max(0, Math.floor(nextChord.startTime - currentTime))}s
                      </Text>
                      <View style={styles.nextFretboardContainer}>
                        <Fretboard
                          chord={nextChord.chord}
                          fingering={nextFingering}
                          theme={theme}
                          size="small"
                          isHighlighted={false}
                          animationDelay={0}
                        />
                      </View>
                    </View>
                  )}
                </View>

                <Text style={[styles.fingeringStyle, { color: theme.secondaryText }]}>
                  {fingeringStyle.charAt(0).toUpperCase() + fingeringStyle.slice(1)} Style
                  {fingeringLocked && ' (Locked)'}
                </Text>

                {/* Fretboard Size Controls */}
                <View style={styles.sizeControls}>
                  {(['small', 'medium', 'large'] as const).map((size) => (
                    <TouchableOpacity
                      key={size}
                      style={[
                        styles.sizeButton,
                        {
                          backgroundColor: fretboardSize === size ? theme.primary : theme.secondary,
                        }
                      ]}
                      onPress={() => setFretboardSize(size)}
                    >
                      <Text style={styles.sizeButtonText}>
                        {size.charAt(0).toUpperCase() + size.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              ) : null;
            })()}
      </ScrollView>

      {renderFingeringModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  songTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  playerContainer: {
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  controlButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  controlButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  progressContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  chordProgressItem: {
    padding: 12,
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 2,
    minWidth: 60,
    alignItems: 'center',
  },
  chordProgressText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  chordTimeText: {
    fontSize: 10,
    marginTop: 2,
  },
  chordDisplay: {
    margin: 16,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  currentChordLabel: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  fingeringStyle: {
    fontSize: 14,
    marginBottom: 20,
  },
  fretboardContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  sizeControls: {
    flexDirection: 'row',
    gap: 8,
  },
  sizeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  sizeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 12,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  fingeringOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  fingeringPreview: {
    marginRight: 16,
  },
  fingeringLabel: {
    flex: 1,
    fontSize: 16,
  },
  chordPreviewSection: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  chordPreviewContainer: {
    flexDirection: 'row',
  },
  chordPreviewItem: {
    alignItems: 'center',
    marginRight: 16,
    padding: 8,
    minWidth: 80,
  },
  previewChordName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  previewTimeText: {
    fontSize: 10,
    marginBottom: 8,
  },
  miniatureFretboard: {
    borderWidth: 2,
    borderRadius: 8,
    padding: 4,
  },
  currentNextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  currentChordSection: {
    flex: 2,
    alignItems: 'center',
    marginRight: 16,
  },
  nextChordSection: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  chordName: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  nextChordLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  nextChordName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  nextChordTime: {
    fontSize: 11,
    marginBottom: 8,
  },
  nextFretboardContainer: {
    alignItems: 'center',
  },
  nextIndicator: {
    fontSize: 8,
    fontWeight: 'bold',
    marginTop: 2,
  },
  progressIndicator: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  progressText: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
});

export default SynchronizedChordPlayer;
