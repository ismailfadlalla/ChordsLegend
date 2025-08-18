import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    FlatList, Modal, ScrollView, StyleSheet, Text,
    TouchableOpacity, View
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { CHORD_LIBRARY, getChordFingerings } from '../utils/chordLibrary';
import CompactRhythmTimeline from './CompactRhythmTimeline';
import EmbeddedRhythmSheet from './EmbeddedRhythmSheet';
import { ChordFingering, Fretboard } from './Fretboard.Enhanced';
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
  onChordAdjust?: (index: number, newChord: string) => void;
  analysisInfo?: {
    method: string;
    confidence: number;
    key: string;
    bpm: number;
    timeSignature: string;
  };
}

export const SynchronizedChordPlayer: React.FC<SynchronizedChordPlayerProps> = ({
  videoId,
  songTitle,
  chordProgression: originalChordProgression,
  onBack,
  onChordAdjust,
  analysisInfo,
}) => {
  console.log('🎸 SynchronizedChordPlayer rendered with:', {
    videoId,
    songTitle,
    chordProgressionLength: originalChordProgression?.length || 0,
    chordProgression: originalChordProgression,
    analysisInfo
  });
  
  // Use the original chord progression as-is
  const chordProgression = originalChordProgression;
  
  // Calculate total duration
  const totalDuration = chordProgression.reduce((total, chord) => {
    return Math.max(total, chord.startTime + chord.duration);
  }, 0);
  
  const { theme } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentChordIndex, setCurrentChordIndex] = useState(-1); // Start with -1 to indicate no chord selected
  const [isLooping, setIsLooping] = useState(false);
  const [fingeringStyle, setFingeringStyle] = useState<'open' | 'barre' | 'movable'>('open');
  const [fingeringLocked, setFingeringLocked] = useState(false);
  const [showFingeringModal, setShowFingeringModal] = useState(false);
  const [fretboardSize, setFretboardSize] = useState<'small' | 'medium' | 'large'>('large');
  const [timingOffset, setTimingOffset] = useState(0); // Offset in seconds to align chords with song

  const playerRef = useRef<YouTubePlayerRef>(null);

  // SIMPLIFIED CHORD DETECTION: Single source of truth for chord detection
  const getChordAtTime = useCallback((time: number) => {
    if (!chordProgression || chordProgression.length === 0) {
      return { chordIndex: -1, chord: null };
    }
    
    // Apply timing offset if needed (for manual synchronization adjustment)
    const adjustedTime = time + timingOffset;
    
    // Find the chord that should be active at this time
    for (let i = 0; i < chordProgression.length; i++) {
      const chord = chordProgression[i];
      const chordEndTime = chord.startTime + chord.duration;
      
      if (adjustedTime >= chord.startTime && adjustedTime < chordEndTime) {
        return { chordIndex: i, chord: chord };
      }
    }
    
    // No chord found - could be silence period or before/after progression
    return { chordIndex: -1, chord: null };
  }, [chordProgression, timingOffset]);

  // Get current chord based on YouTube player time - SIMPLIFIED
  const getCurrentChord = useCallback(() => {
    const { chord } = getChordAtTime(currentTime);
    return chord;
  }, [currentTime, getChordAtTime]);

  // Get next chord for preview - SIMPLIFIED
  const getNextChord = useCallback(() => {
    const { chordIndex } = getChordAtTime(currentTime);
    
    if (chordIndex >= 0 && chordIndex < chordProgression.length - 1) {
      return chordProgression[chordIndex + 1];
    }
    
    return null;
  }, [currentTime, getChordAtTime, chordProgression]);

  // SIMPLIFIED CHORD TRACKING: Update chord index when time changes - FIXED SYNC
  useEffect(() => {
    if (chordProgression.length === 0) {
      return;
    }
    
    const { chordIndex, chord } = getChordAtTime(currentTime);
    
    // Always update chord index for better synchronization
    if (chordIndex !== currentChordIndex) {
      if (chordIndex !== -1) {
        // Found a valid chord at current time
        setCurrentChordIndex(chordIndex);
      } else if (currentChordIndex !== -1) {
        // We were on a chord but now we're in silence - keep the last chord visible for a moment
        // This prevents flickering during brief silence periods
        const lastChord = chordProgression[currentChordIndex];
        if (lastChord && currentTime > lastChord.startTime + lastChord.duration + 1) {
          // Only clear if we're more than 1 second past the last chord
          setCurrentChordIndex(-1);
        }
      }
    }
  }, [currentTime, chordProgression, currentChordIndex, getChordAtTime]);

  // Initialize first chord when chord progression is loaded
  useEffect(() => {
    if (chordProgression.length > 0 && currentChordIndex === -1) {
      setCurrentChordIndex(0);
    }
  }, [chordProgression]);

  // Handle YouTube player time updates - CRITICAL FIXES for stable highlighting and synchronization
  // SIMPLIFIED TIME UPDATE: Clean and reliable time tracking
  const handlePlayerTimeUpdate = useCallback((time: number) => {
    // Ensure we always have a valid time value
    const validTime = Math.max(0, time);
    setCurrentTime(validTime);
    
    // Note: Chord index updates are handled by the useEffect above
    // This separation keeps the code clean and predictable
  }, []);

  // Handle YouTube player state changes with IMMEDIATE chord forcing
  // SIMPLIFIED PLAYER STATE CHANGE: Clean state synchronization
  const handlePlayerStateChange = useCallback((playing: boolean) => {
    // Update our local state to match YouTube player state
    if (playing !== isPlaying) {
      setIsPlaying(playing);
      
      // Lock fingering when playing starts (for consistent display)
      if (playing && !fingeringLocked) {
        setFingeringLocked(true);
      }
    }
    
    // Note: Chord selection is handled by the useEffect that watches currentTime
    // This keeps the logic simple and predictable
  }, [isPlaying, fingeringLocked]);

  const handleStartOver = () => {
    // Reset player and time
    if (playerRef.current) {
      playerRef.current.seekTo(0);
      playerRef.current.pause();
    }
    setCurrentTime(0);
    setCurrentChordIndex(0);
    setIsPlaying(false);
  };

  // Get chord fingering based on style preference
  const getChordFingering = useCallback((chordName: string): ChordFingering | null => {
    // Use the improved chord lookup function
    const chordDef = getChordFingerings(chordName);
    if (!chordDef || !chordDef.fingerings.length) {
      return null;
    }

    // Find fingering based on preferred style
    const preferredFingering = chordDef.fingerings.find(f => f.type === fingeringStyle);
    return preferredFingering || chordDef.fingerings[0];
  }, [fingeringStyle]);

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
    if (!currentChord) {
      return null;
    }

    const chordDef = CHORD_LIBRARY[currentChord.chord];
    if (!chordDef) {
      return null;
    }

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
        {analysisInfo && (
          <View style={styles.analysisInfoContainer}>
            <Text style={[styles.analysisInfoText, { color: theme.secondaryText }]}>
              🎼 {analysisInfo.method} • {Math.round(analysisInfo.confidence * 100)}% • Key: {analysisInfo.key} • {analysisInfo.bpm} BPM
            </Text>
          </View>
        )}
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
              // Handle YouTube player state changes for synchronization
              const isPlayerPlaying = state === 'playing';
              handlePlayerStateChange(isPlayerPlaying);
            }}
          />
        </View>

        {/* Controls - moved up with reduced spacing */}
        <View style={[styles.controls, { backgroundColor: theme.surface, marginHorizontal: 16, marginVertical: 8, paddingVertical: 12 }]}>
          <TouchableOpacity
            style={[
              styles.controlButton, 
              { 
                backgroundColor: isPlaying ? theme.secondary : theme.primary,
                flex: 1,
                paddingVertical: 8, // Reduced from 12 to 8
                marginHorizontal: 2 // Reduced spacing
              }
            ]}
            onPress={() => {
              if (isPlaying) {
                // Pause both chord progression and YouTube
                setIsPlaying(false);
                if (playerRef.current) {
                  playerRef.current.pause();
                }
              } else {
                // Start both chord progression and YouTube - SIMPLIFIED
                
                // SIMPLIFIED START PLAYING: Use the same logic as highlighting
                if (chordProgression.length > 0) {
                  const { chordIndex, chord } = getChordAtTime(currentTime);
                  
                  if (chordIndex !== -1) {
                    setCurrentChordIndex(chordIndex);
                  } else {
                    // No chord at current time - find the next upcoming chord
                    let upcomingIndex = -1;
                    for (let i = 0; i < chordProgression.length; i++) {
                      if (currentTime < chordProgression[i].startTime) {
                        upcomingIndex = i;
                        break;
                      }
                    }
                    
                    if (upcomingIndex !== -1) {
                      setCurrentChordIndex(upcomingIndex);
                    } else {
                      // Past all chords, start with first chord
                      setCurrentChordIndex(0);
                    }
                  }
                }
                
                // Set playing state and start YouTube player
                setIsPlaying(true);
                if (playerRef.current) {
                  playerRef.current.play();
                }
                
                // FORCE IMMEDIATE STATE UPDATE
                setTimeout(() => {
                  setIsPlaying(true);
                  if (chordProgression.length > 0 && currentChordIndex < 0) {
                    setCurrentChordIndex(0);
                  }
                }, 200);
              }
            }}
          >
            <Text style={[styles.controlButtonText, { fontSize: 11 }]}>
              {isPlaying ? '⏸️ Pause' : '▶️ Start Playing'} 
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: theme.secondary, paddingVertical: 8, marginHorizontal: 2 }]}
            onPress={handleStartOver}
          >
            <Text style={[styles.controlButtonText, { fontSize: 11 }]}>🔄 Start Over</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.controlButton,
              { backgroundColor: isLooping ? theme.primary : theme.secondary, paddingVertical: 8, marginHorizontal: 2 }
            ]}
            onPress={handleLoop}
          >
            <Text style={[styles.controlButtonText, { fontSize: 11 }]}>🔁 Loop</Text>
          </TouchableOpacity>

          {!fingeringLocked && (
            <TouchableOpacity
              style={[styles.controlButton, { backgroundColor: theme.primary, paddingVertical: 8, marginHorizontal: 2 }]}
              onPress={() => setShowFingeringModal(true)}
            >
              <Text style={[styles.controlButtonText, { fontSize: 11 }]}>🎸 Style</Text>
            </TouchableOpacity>
          )}

          {/* Timing adjustment controls */}
          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: theme.secondary, paddingVertical: 8, marginHorizontal: 2 }]}
            onPress={() => setTimingOffset(offset => Math.max(-10, offset - 0.5))}
          >
            <Text style={[styles.controlButtonText, { fontSize: 10 }]}>⏪ -0.5s</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: theme.secondary, paddingVertical: 8, marginHorizontal: 2 }]}
            onPress={() => setTimingOffset(offset => Math.min(10, offset + 0.5))}
          >
            <Text style={[styles.controlButtonText, { fontSize: 10 }]}>⏩ +0.5s</Text>
          </TouchableOpacity>

          {timingOffset !== 0 && (
            <TouchableOpacity
              style={[styles.controlButton, { backgroundColor: '#ff6b6b', paddingVertical: 8, marginHorizontal: 2 }]}
              onPress={() => setTimingOffset(0)}
            >
              <Text style={[styles.controlButtonText, { fontSize: 10 }]}>↩️ Reset</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Unified View: Rhythm Timeline + Sheet + Fretboard */}
        
        {/* Debug: Show chord progression info */}
        <View style={{ backgroundColor: theme.surface, padding: 10, margin: 10 }}>
          <Text style={{ color: theme.text, fontSize: 16, fontWeight: 'bold' }}>
            🐛 Debug Info:
          </Text>
          <Text style={{ color: theme.text }}>
            Chord Progression Length: {chordProgression?.length || 0}
          </Text>
          <Text style={{ color: theme.text }}>
            Video ID: {videoId}
          </Text>
          <Text style={{ color: theme.text }}>
            Current Time: {currentTime.toFixed(1)}s
          </Text>
          {chordProgression?.length > 0 && (
            <Text style={{ color: theme.text }}>
              First Chord: {chordProgression[0].chord} at {chordProgression[0].startTime}s
            </Text>
          )}
        </View>
        
        {/* Compact Rhythm Timeline */}
        {chordProgression?.length > 0 ? (
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
        ) : (
          <View style={{ backgroundColor: theme.surface, padding: 20, margin: 10 }}>
            <Text style={{ color: theme.text, textAlign: 'center' }}>
              ⚠️ No chord progression data available
            </Text>
          </View>
        )}

        {/* Embedded Rhythm Sheet */}
        {chordProgression?.length > 0 ? (
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
        ) : (
          <View style={{ backgroundColor: theme.surface, padding: 20, margin: 10 }}>
            <Text style={{ color: theme.text, textAlign: 'center' }}>
              ⚠️ No rhythm sheet data available
            </Text>
          </View>
        )}

        {/* Current Chord Display with Next Chord Preview - IMPROVED LAYOUT */}
        {(() => {
          const currentChord = getCurrentChord();
          const nextChord = getNextChord();
          const currentFingering = currentChord ? getChordFingering(currentChord.chord) : null;
          const nextFingering = nextChord ? getChordFingering(nextChord.chord) : null;
          
          // Show silence indicator when no chord is playing
          if (!currentChord) {
            return (
              <View style={[styles.chordDisplay, { backgroundColor: theme.surface, marginVertical: 8 }]}>
                <Text style={[styles.currentChordLabel, { color: theme.secondaryText, fontSize: 18 }]}>
                  🔇 Silence Period
                </Text>
                <Text style={[styles.fingeringStyle, { color: theme.secondaryText, fontSize: 12, marginBottom: 8 }]}>
                  No chords playing - this might be an instrumental break or quiet section
                </Text>
                {nextChord && (
                  <View style={styles.nextChordPreview}>
                    <Text style={[styles.nextChordLabel, { color: theme.text, fontSize: 14 }]}>
                      Next chord: {nextChord.chord} at {nextChord.startTime}s
                    </Text>
                  </View>
                )}
              </View>
            );
          }
          
          return currentFingering ? (
              <View style={[styles.chordDisplay, { backgroundColor: theme.surface, marginVertical: 8, paddingVertical: 12 }]}>
                <View style={styles.currentNextContainer}>
                  {/* Current Chord */}
                  <View style={styles.currentChordSection}>
                    <Text style={[styles.currentChordLabel, { color: theme.text, fontSize: 20 }]}>
                      Now Playing
                    </Text>
                    {/* Key display below Now Playing */}
                    {analysisInfo && (
                      <Text style={[styles.keyDisplay, { color: theme.primary, fontSize: 14, marginBottom: 6 }]}>
                        Key: {analysisInfo.key}
                      </Text>
                    )}
                    <Text style={[styles.chordName, { color: theme.primary, fontSize: 28, marginBottom: 8 }]}>
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
                      <Text style={[styles.nextChordLabel, { color: theme.secondaryText, fontSize: 11 }]}>
                        Next Up
                      </Text>
                      <Text style={[styles.nextChordName, { color: theme.text, fontSize: 16 }]}>
                        {nextChord.chord}
                      </Text>
                      <Text style={[styles.nextChordTime, { color: theme.secondaryText, fontSize: 10 }]}>
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

                <Text style={[styles.fingeringStyle, { color: theme.secondaryText, fontSize: 12, marginBottom: 12 }]}>
                  {fingeringStyle.charAt(0).toUpperCase() + fingeringStyle.slice(1)} Style
                  {fingeringLocked && ' (Locked)'}
                </Text>

                {/* Fretboard Size Controls - moved up with reduced spacing */}
                <View style={[styles.sizeControls, { marginBottom: 8 }]}>
                  {(['small', 'medium', 'large'] as const).map((size) => (
                    <TouchableOpacity
                      key={size}
                      style={[
                        styles.sizeButton,
                        {
                          backgroundColor: fretboardSize === size ? theme.primary : theme.secondary,
                          paddingHorizontal: 10,
                          paddingVertical: 4,
                        }
                      ]}
                      onPress={() => setFretboardSize(size)}
                    >
                      <Text style={[styles.sizeButtonText, { fontSize: 11 }]}>
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
  analysisInfoContainer: {
    marginTop: 4,
    marginBottom: 4,
  },
  analysisInfoText: {
    fontSize: 11,
    fontWeight: '500',
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
  keyDisplay: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
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
  nextChordPreview: {
    marginTop: 16,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    alignItems: 'center',
  },
});

export default SynchronizedChordPlayer;
