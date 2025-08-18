import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import YoutubePlayerWeb from '../components/YoutubePlayerWeb';
import { analyzeChords, ChordData } from '../api/chords';

// Guitar Fretboard Component - stays exactly the same
const GuitarFretboard = ({ chord, isActive = false }: { chord: string; isActive?: boolean }) => {
  const chordPositions: { [key: string]: Array<{ fret: number; string: number }> } = {
    'Em': [{ fret: 2, string: 5 }, { fret: 2, string: 4 }],
    'C': [{ fret: 1, string: 2 }, { fret: 2, string: 4 }, { fret: 3, string: 5 }],
    'G': [{ fret: 2, string: 1 }, { fret: 3, string: 6 }, { fret: 3, string: 2 }],
    'D': [{ fret: 2, string: 1 }, { fret: 2, string: 3 }, { fret: 3, string: 2 }],
    'Am': [{ fret: 1, string: 2 }, { fret: 2, string: 4 }, { fret: 2, string: 3 }],
    'F': [{ fret: 1, string: 1 }, { fret: 1, string: 2 }, { fret: 2, string: 3 }, { fret: 3, string: 4 }],
    'Dm': [{ fret: 1, string: 1 }, { fret: 2, string: 3 }, { fret: 3, string: 2 }],
    'A': [{ fret: 2, string: 4 }, { fret: 2, string: 3 }, { fret: 2, string: 2 }],
    'E': [{ fret: 2, string: 5 }, { fret: 2, string: 4 }, { fret: 1, string: 3 }],
    'B7': [{ fret: 1, string: 5 }, { fret: 2, string: 1 }, { fret: 2, string: 3 }, { fret: 2, string: 4 }],
    'Bm': [{ fret: 2, string: 1 }, { fret: 2, string: 2 }, { fret: 2, string: 3 }, { fret: 2, string: 4 }, { fret: 2, string: 5 }],
    'Cmaj7': [{ fret: 0, string: 3 }, { fret: 2, string: 4 }, { fret: 3, string: 5 }],
    'Fmaj7': [{ fret: 1, string: 1 }, { fret: 1, string: 2 }, { fret: 2, string: 3 }],
    'Em7': [{ fret: 2, string: 5 }, { fret: 2, string: 4 }],
    'F#': [{ fret: 2, string: 1 }, { fret: 2, string: 2 }, { fret: 2, string: 3 }, { fret: 2, string: 4 }, { fret: 2, string: 5 }, { fret: 2, string: 6 }],
  };

  const positions = chordPositions[chord] || [];
  const strings = 6;
  const frets = 4;

  return (
    <View style={{
      backgroundColor: isActive ? '#007AFF' : '#2c3e50',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      minWidth: 120,
      borderWidth: isActive ? 3 : 1,
      borderColor: isActive ? '#ffc107' : '#34495e'
    }}>
      <Text style={{
        color: 'white',
        fontSize: isActive ? 18 : 14,
        fontWeight: 'bold',
        marginBottom: 10
      }}>
        {chord}
      </Text>
      
      <View style={{ position: 'relative' }}>
        {Array.from({ length: strings }, (_, stringIndex) => (
          <View key={`string-${stringIndex}`} style={{
            height: 2,
            backgroundColor: '#95a5a6',
            width: 80,
            marginVertical: 6,
            position: 'relative'
          }}>
            {Array.from({ length: frets + 1 }, (_, fretIndex) => (
              <View key={`fret-${fretIndex}`} style={{
                position: 'absolute',
                left: fretIndex * 20,
                top: -10,
                width: 2,
                height: 20,
                backgroundColor: fretIndex === 0 ? '#ecf0f1' : '#bdc3c7'
              }} />
            ))}
            
            {positions
              .filter(pos => pos.string === strings - stringIndex)
              .map((pos, idx) => (
                <View key={`finger-${idx}`} style={{
                  position: 'absolute',
                  left: pos.fret * 20 - 6,
                  top: -6,
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: isActive ? '#e74c3c' : '#e67e22'
                }} />
              ))}
          </View>
        ))}
      </View>
    </View>
  );
};

// Measure Component - stays exactly the same
const MeasureBar = ({ 
  chordProgression, 
  measureIndex, 
  currentTime,
  isActive 
}: { 
  chordProgression: ChordData[]; 
  measureIndex: number; 
  currentTime: number;
  isActive: boolean;
}) => {
  const measureStartTime = measureIndex * 4;
  const measureEndTime = measureStartTime + 4;
  
  const currentChord = chordProgression.find(chord => 
    chord.time >= measureStartTime && chord.time < measureEndTime
  );
  
  const chord = currentChord?.chord || 'C';
  const beatInMeasure = Math.floor((currentTime - measureStartTime) % 4);

  return (
    <View style={{
      backgroundColor: isActive ? '#e8f4fd' : '#f8f9fa',
      borderWidth: 2,
      borderColor: isActive ? '#007AFF' : '#dee2e6',
      borderRadius: 8,
      padding: 10,
      marginHorizontal: 5,
      minWidth: 200,
      alignItems: 'center'
    }}>
      <Text style={{
        fontSize: 12,
        color: '#6c757d',
        marginBottom: 5
      }}>
        Measure {measureIndex + 1}
      </Text>
      
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {Array.from({ length: 4 }, (_, beatIndex) => {
          const isBeatActive = isActive && beatIndex === beatInMeasure;
          
          return (
            <View key={beatIndex} style={{
              flex: 1,
              alignItems: 'center',
              paddingVertical: 10,
              backgroundColor: isBeatActive ? '#007AFF' : (isActive ? '#e8f4fd' : 'transparent'),
              borderRadius: 5,
              marginHorizontal: 2
            }}>
              {beatIndex === 0 && (
                <Text style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: isBeatActive ? 'white' : (isActive ? '#007AFF' : '#2c3e50')
                }}>
                  {chord}
                </Text>
              )}
              
              <View style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: isBeatActive ? '#ffc107' : (isActive ? '#007AFF' : '#dee2e6'),
                marginTop: 5
              }} />
              
              {beatIndex < 3 && (
                <View style={{
                  position: 'absolute',
                  right: -2,
                  top: 0,
                  bottom: 0,
                  width: 1,
                  backgroundColor: '#dee2e6'
                }} />
              )}
            </View>
          );
        })}
      </View>
      
      <Text style={{
        fontSize: 10,
        color: '#6c757d',
        marginTop: 5
      }}>
        {measureStartTime}s - {measureEndTime}s
      </Text>
    </View>
  );
};

export default function PlayerScreen({ route, navigation }: any) {
  console.log('🎸 REAL CHORD DETECTION ONLY - NO FALLBACK!!! 🎸');
  
  const params = route?.params || {};
  const { youtubeUrl, songTitle, videoId: paramVideoId } = params;
  
  const [chordProgression, setChordProgression] = useState<ChordData[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMeasure, setCurrentMeasure] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState('Starting real chord analysis...');
  const [youtubePlayer, setYoutubePlayer] = useState<any>(null);
  const [youtubeReady, setYoutubeReady] = useState(false);
  
  const scrollViewRef = useRef(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const extractVideoId = (url: string) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };
  
  const videoId = paramVideoId || (youtubeUrl ? extractVideoId(youtubeUrl) : null) || 'oRdxUFDoQe0';
  
  const getCurrentChord = () => {
    const currentChordData = chordProgression.find(chord => 
      currentTime >= chord.time && currentTime < (chord.time + (chord.duration || 4))
    );
    return currentChordData?.chord || 'C';
  };

  const getNextChord = () => {
    const currentChordData = chordProgression.find(chord => 
      currentTime >= chord.time && currentTime < (chord.time + (chord.duration || 4))
    );
    if (currentChordData) {
      const currentIndex = chordProgression.indexOf(currentChordData);
      const nextChordData = chordProgression[currentIndex + 1];
      return nextChordData?.chord || chordProgression[0]?.chord || 'G';
    }
    return 'G';
  };

  const currentChord = getCurrentChord();
  const nextChord = getNextChord();
  const totalMeasures = Math.ceil((chordProgression[chordProgression.length - 1]?.time || 32) / 4);

  // REAL CHORD ANALYSIS ONLY - NO FALLBACK
  useEffect(() => {
    const loadRealChordProgression = async () => {
      try {
        setIsLoading(true);
        setStatus('🎵 Performing REAL chord analysis...');
        setError(null);
        
        console.log('🎵 Starting REAL chord analysis for:', songTitle);
        console.log('🌐 Video ID:', videoId);
        
        const youtubeVideoUrl = youtubeUrl || `https://www.youtube.com/watch?v=${videoId}`;
        console.log('🌐 Analyzing URL:', youtubeVideoUrl);
        
        setStatus('🔊 Downloading and analyzing audio...');
        
        // Call REAL chord analysis API - NO FALLBACK
        const chordData = await analyzeChords(youtubeVideoUrl);
        
        console.log('🎸 REAL chord analysis result:', chordData);
        
        if (chordData && chordData.length > 0) {
          setChordProgression(chordData);
          setStatus(`✅ REAL chord analysis complete! (${chordData.length} chords detected)`);
          console.log('🎸 Real chords successfully loaded:', chordData.slice(0, 5));
          setError(null);
        } else {
          throw new Error('Real chord analysis returned no results');
        }
        
      } catch (err) {
        console.error('❌ REAL chord analysis failed:', err);
        setError(`Real chord analysis failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setStatus('❌ Real analysis failed');
        
        // NO FALLBACK - Show error state instead
        setChordProgression([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadRealChordProgression();
  }, [youtubeUrl, videoId, songTitle]);

  // REMOVED ALL FALLBACK FUNCTIONS

  useEffect(() => {
    if (isPlaying && chordProgression.length > 0) {
      console.log('🎵 Starting SYNCHRONIZED playback with YouTube...');
      
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 0.1;
          const newMeasure = Math.floor(newTime / 4);
          
          if (newMeasure !== currentMeasure) {
            setCurrentMeasure(newMeasure);
            console.log('🎵 Changed to measure:', newMeasure + 1, 'Time:', newTime.toFixed(1));
            
            if (scrollViewRef.current) {
              (scrollViewRef.current as any).scrollTo({
                x: newMeasure * 210,
                animated: true
              });
            }
          }
          
          return newTime;
        });
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, chordProgression.length, currentMeasure]);

  const handlePlayPause = () => {
    const newPlayingState = !isPlaying;
    console.log('🎵 SYNCHRONIZED Play/Pause clicked, new state:', newPlayingState);
    
    setIsPlaying(newPlayingState);
    
    if (youtubeReady && youtubePlayer) {
      try {
        if (newPlayingState) {
          console.log('▶️ Playing YouTube video synchronously');
          youtubePlayer.playVideo();
        } else {
          console.log('⏸️ Pausing YouTube video synchronously');
          youtubePlayer.pauseVideo();
        }
      } catch (error) {
        console.warn('⚠️ YouTube player control failed:', error);
      }
    } else {
      console.warn('⚠️ YouTube player not ready yet');
    }
  };

  const handleReset = () => {
    console.log('🔄 SYNCHRONIZED Reset clicked');
    setCurrentTime(0);
    setCurrentMeasure(0);
    setIsPlaying(false);
    
    if (youtubeReady && youtubePlayer) {
      try {
        youtubePlayer.seekTo(0);
        youtubePlayer.pauseVideo();
      } catch (error) {
        console.warn('⚠️ YouTube reset failed:', error);
      }
    }
    
    if (scrollViewRef.current) {
      (scrollViewRef.current as any).scrollTo({ x: 0, animated: true });
    }
  };

  const handleYouTubeReady = () => {
    console.log('🎬 YouTube player is ready for synchronization');
    setYoutubeReady(true);
    
    const iframe = document.querySelector('iframe');
    if (iframe && iframe.contentWindow) {
      try {
        setYoutubePlayer({
          playVideo: () => {
            iframe.contentWindow?.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
          },
          pauseVideo: () => {
            iframe.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
          },
          seekTo: (seconds: number) => {
            iframe.contentWindow?.postMessage(`{"event":"command","func":"seekTo","args":[${seconds}, true]}`, '*');
          }
        });
      } catch (error) {
        console.warn('⚠️ YouTube player API access failed:', error);
      }
    }
  };

  const handleYouTubeStateChange = (state: any) => {
    console.log('🎬 YouTube state changed:', state);
    
    if (state === 1) { // Playing
      if (!isPlaying) {
        console.log('🔄 Syncing: YouTube started playing, updating our state');
        setIsPlaying(true);
      }
    } else if (state === 2) { // Paused
      if (isPlaying) {
        console.log('🔄 Syncing: YouTube paused, updating our state');
        setIsPlaying(false);
      }
    }
  };

  // LOADING STATE: Real analysis in progress
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 20, fontSize: 18, color: '#2c3e50', textAlign: 'center' }}>
          {status}
        </Text>
        <Text style={{ marginTop: 10, fontSize: 14, color: '#7f8c8d', textAlign: 'center' }}>
          🎵 {songTitle || 'Analyzing song...'}
        </Text>
        <Text style={{ marginTop: 10, fontSize: 12, color: '#95a5a6', textAlign: 'center' }}>
          Real audio analysis may take 30-60 seconds
        </Text>
      </View>
    );
  }

  // ERROR STATE: Real analysis failed
  if (error && chordProgression.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' }}>
        <Text style={{ fontSize: 48, marginBottom: 20 }}>❌</Text>
        <Text style={{ fontSize: 20, color: '#e74c3c', textAlign: 'center', marginBottom: 10 }}>
          Real Chord Analysis Failed
        </Text>
        <Text style={{ fontSize: 14, color: '#7f8c8d', textAlign: 'center', marginBottom: 20, paddingHorizontal: 40 }}>
          {error}
        </Text>
        <TouchableOpacity 
          style={{
            backgroundColor: '#007AFF',
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderRadius: 8,
            marginBottom: 15
          }}
          onPress={() => {
            setError(null);
            setIsLoading(true);
            // Retry real analysis
            const retryAnalysis = async () => {
              try {
                setStatus('🔄 Retrying real chord analysis...');
                const youtubeVideoUrl = youtubeUrl || `https://www.youtube.com/watch?v=${videoId}`;
                const chordData = await analyzeChords(youtubeVideoUrl);
                if (chordData && chordData.length > 0) {
                  setChordProgression(chordData);
                  setError(null);
                }
              } catch (err) {
                setError(`Retry failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
              } finally {
                setIsLoading(false);
              }
            };
            retryAnalysis();
          }}
        >
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>🔄 Retry Real Analysis</Text>
        </TouchableOpacity>
        
        {navigation && (
          <TouchableOpacity 
            style={{
              backgroundColor: '#e74c3c',
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderRadius: 8
            }}
            onPress={() => navigation.goBack()}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>← Back to Search</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  // SUCCESS STATE: Real chords loaded
  return (
    <View style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      {/* HEADER: Green to indicate real analysis success */}
      <View style={{
        backgroundColor: '#27ae60', // Green for real analysis
        padding: 20,
        alignItems: 'center'
      }}>
        <Text style={{
          color: 'white',
          fontSize: 20,
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: 5
        }}>
          🎵 {songTitle || 'Unknown Song'}
        </Text>
        
        <Text style={{
          color: '#ecf0f1',
          fontSize: 14,
          fontWeight: 'bold'
        }}>
          🎼 REAL Chord Analysis ({chordProgression.length} chords detected)
        </Text>
        
        <Text style={{
          color: '#2ecc71',
          fontSize: 12,
          marginTop: 5,
          backgroundColor: 'rgba(255,255,255,0.2)',
          paddingHorizontal: 10,
          paddingVertical: 2,
          borderRadius: 10
        }}>
          ✅ Real Audio Analysis Complete
        </Text>
        
        {navigation && (
          <TouchableOpacity 
            style={{
              backgroundColor: '#e74c3c',
              paddingHorizontal: 15,
              paddingVertical: 8,
              borderRadius: 5,
              marginTop: 10
            }}
            onPress={() => navigation.goBack()}
          >
            <Text style={{ color: 'white', fontSize: 14 }}>← Back to Search</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* SYNC STATUS: Show real chord sync status */}
      <View style={{
        backgroundColor: youtubeReady ? '#27ae60' : '#e74c3c',
        padding: 10,
        alignItems: 'center'
      }}>
        <Text style={{
          color: 'white',
          fontSize: 16,
          fontWeight: 'bold'
        }}>
          {youtubeReady ? 
            (isPlaying ? 
              `🔄 REAL CHORDS ▶️ ${currentTime.toFixed(1)}s - Measure ${currentMeasure + 1}/${totalMeasures} - Current: ${currentChord}` : 
              '🔄 REAL CHORDS ⏸️ Ready to play - Real chord analysis loaded') :
            '⏳ Waiting for YouTube player...'
          }
        </Text>
      </View>

      {/* YouTube Player */}
      <View style={{
        margin: 15,
        backgroundColor: 'black',
        borderRadius: 10,
        overflow: 'hidden'
      }}>
        <YoutubePlayerWeb 
          videoId={videoId} 
          height={200}
          onReady={handleYouTubeReady}
          onStateChange={handleYouTubeStateChange}
        />
      </View>

      {/* Guitar Fretboards */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
        marginBottom: 15
      }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: '#2c3e50',
            marginBottom: 10
          }}>
            CURRENT CHORD
          </Text>
          <GuitarFretboard chord={currentChord} isActive={true} />
        </View>
        
        <View style={{ alignItems: 'center' }}>
          <Text style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: '#7f8c8d',
            marginBottom: 10
          }}>
            NEXT CHORD
          </Text>
          <GuitarFretboard chord={nextChord} isActive={false} />
        </View>
      </View>

      {/* Play Controls */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'center',
        marginHorizontal: 20,
        marginBottom: 15,
        gap: 10
      }}>
        <TouchableOpacity
          style={{
            backgroundColor: isPlaying ? '#e74c3c' : (youtubeReady ? '#27ae60' : '#95a5a6'),
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: 8,
            flex: 1,
            alignItems: 'center',
            opacity: youtubeReady ? 1 : 0.6
          }}
          onPress={handlePlayPause}
          disabled={!youtubeReady}
        >
          <Text style={{
            color: 'white',
            fontSize: 16,
            fontWeight: 'bold'
          }}>
            {isPlaying ? '⏸️ PAUSE SYNC' : (youtubeReady ? '▶️ PLAY SYNC' : '⏳ LOADING...')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={{
            backgroundColor: youtubeReady ? '#f39c12' : '#95a5a6',
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: 8,
            alignItems: 'center',
            opacity: youtubeReady ? 1 : 0.6
          }}
          onPress={handleReset}
          disabled={!youtubeReady}
        >
          <Text style={{
            color: 'white',
            fontSize: 16,
            fontWeight: 'bold'
          }}>
            🔄 RESET
          </Text>
        </TouchableOpacity>
      </View>

      {/* Real Chord Status */}
      <View style={{
        backgroundColor: '#e8f4fd',
        padding: 10,
        marginHorizontal: 15,
        borderRadius: 5,
        marginBottom: 10
      }}>
        <Text style={{ fontSize: 12, color: '#2c3e50', textAlign: 'center' }}>
          🎸 REAL CHORDS: {currentTime.toFixed(1)}s | Current: {currentChord} | Next: {nextChord} | YouTube: {youtubeReady ? '✅' : '⏳'}
        </Text>
      </View>

      {/* Chord Progression Sheet */}
      <View style={{ flex: 1 }}>
        <Text style={{
          fontSize: 18,
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: 10,
          color: '#2c3e50'
        }}>
          🎼 Real Chord Progression Sheet ({totalMeasures} measures)
        </Text>
        
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={true}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 10 }}
        >
          {Array.from({ length: totalMeasures }, (_, measureIndex) => (
            <MeasureBar
              key={measureIndex}
              chordProgression={chordProgression}
              measureIndex={measureIndex}
              currentTime={currentTime}
              isActive={measureIndex === currentMeasure}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
}