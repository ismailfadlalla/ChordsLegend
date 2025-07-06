import React, { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

// Import YouTube iframe component for native platforms only
let YoutubeIframe: any = null;
if (Platform.OS !== 'web') {
  try {
    YoutubeIframe = require('react-native-youtube-iframe').default;
    console.log('✅ YouTube iframe loaded for native platform');
  } catch (e) {
    console.log('❌ YouTube iframe not available for native:', e);
  }
}

interface UnifiedYouTubePlayerProps {
  videoId: string;
  height?: number;
  width?: number | string;
  playing?: boolean;
  onChangeState?: (state: string) => void;
  onError?: (error: string) => void;
  onTimeUpdate?: (time: number) => void;
  onPlayingChange?: (playing: boolean) => void;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
}

export interface YouTubePlayerRef {
  play: () => void;
  pause: () => void;
  seekTo: (time: number) => void;
  getCurrentTime: () => Promise<number>;
}

// YouTube Player Component with iframe-based implementation
const UnifiedYouTubePlayer = React.forwardRef<YouTubePlayerRef, UnifiedYouTubePlayerProps>(({
  videoId,
  height = 200,
  width = '100%',
  playing = false,
  onChangeState,
  onError,
  onTimeUpdate,
  onPlayingChange,
  autoplay = false,
  muted = false,
  loop = false,
  controls = true,
}, ref) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlayerPlaying, setIsPlayerPlaying] = useState(false);
  const timeUpdateInterval = useRef<NodeJS.Timeout | null>(null);
  const startPlayTime = useRef<number>(0);

  // Simple time tracking that starts from 0 and counts up
  const startTimeTracking = useCallback(() => {
    if (timeUpdateInterval.current) {
      clearInterval(timeUpdateInterval.current);
    }
    
    console.log('⏰ Starting simple time tracking from:', currentTime);
    startPlayTime.current = Date.now() - (currentTime * 1000); // Account for current position
    
    timeUpdateInterval.current = setInterval(() => {
      const elapsed = (Date.now() - startPlayTime.current) / 1000;
      console.log('⏰ Time update:', elapsed.toFixed(1));
      setCurrentTime(elapsed);
      onTimeUpdate?.(elapsed);
    }, 500); // Update every 500ms
  }, [currentTime, onTimeUpdate]);

  const stopTimeTracking = useCallback(() => {
    console.log('⏰ Stopping time tracking');
    if (timeUpdateInterval.current) {
      clearInterval(timeUpdateInterval.current);
      timeUpdateInterval.current = null;
    }
  }, []);

  // Handle seeking to specific time
  const seekToTime = useCallback((time: number) => {
    console.log('🎯 Seeking to time:', time);
    setCurrentTime(time);
    onTimeUpdate?.(time);
    
    // If playing, restart time tracking from new position
    if (isPlayerPlaying) {
      startTimeTracking();
    }
  }, [onTimeUpdate, isPlayerPlaying, startTimeTracking]);

  // Handle play/pause state changes
  const handlePlayStateChange = useCallback((shouldPlay: boolean) => {
    console.log('🎵 Play state change:', shouldPlay);
    setIsPlayerPlaying(shouldPlay);
    onPlayingChange?.(shouldPlay);
    
    if (shouldPlay) {
      startTimeTracking();
    } else {
      stopTimeTracking();
    }
  }, [startTimeTracking, stopTimeTracking, onPlayingChange]);

  // Listen for actual iframe events to detect YouTube player state changes
  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const handleMessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          if (data.event === 'video-state-change') {
            console.log('🎬 YouTube iframe state change:', data.info);
            const isPlaying = data.info === 1; // 1 = playing in YouTube API
            if (isPlaying !== isPlayerPlaying) {
              handlePlayStateChange(isPlaying);
            }
          } else if (data.event === 'video-time-update') {
            console.log('🎬 YouTube iframe time update:', data.info);
            setCurrentTime(data.info);
            onTimeUpdate?.(data.info);
          }
        } catch (e) {
          // Ignore non-JSON messages
        }
      };

      window.addEventListener('message', handleMessage);
      return () => window.removeEventListener('message', handleMessage);
    }
  }, [isPlayerPlaying, handlePlayStateChange, onTimeUpdate]);

  // React to playing prop changes
  useEffect(() => {
    if (playing !== isPlayerPlaying) {
      handlePlayStateChange(playing);
    }
  }, [playing, isPlayerPlaying, handlePlayStateChange]);

  // Expose player methods through ref
  useImperativeHandle(ref, () => ({
    play: () => {
      console.log('🎵 YouTube player play() called');
      setIsPlayerPlaying(true);
      onPlayingChange?.(true);
      startTimeTracking();
      
      // Also try to control iframe if on web
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        try {
          const iframe = document.querySelector(`iframe[src*="${videoId}"]`) as HTMLIFrameElement;
          if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
          }
        } catch (e) {
          console.warn('Could not control iframe directly:', e);
        }
      }
    },
    pause: () => {
      console.log('⏸️ YouTube player pause() called');
      setIsPlayerPlaying(false);
      onPlayingChange?.(false);
      stopTimeTracking();
      
      // Also try to control iframe if on web
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        try {
          const iframe = document.querySelector(`iframe[src*="${videoId}"]`) as HTMLIFrameElement;
          if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
          }
        } catch (e) {
          console.warn('Could not control iframe directly:', e);
        }
      }
    },
    seekTo: (time: number) => {
      seekToTime(time);
      
      // Also try to control iframe if on web
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        try {
          const iframe = document.querySelector(`iframe[src*="${videoId}"]`) as HTMLIFrameElement;
          if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage(`{"event":"command","func":"seekTo","args":[${time}, true]}`, '*');
          }
        } catch (e) {
          console.warn('Could not control iframe directly:', e);
        }
      }
    },
    getCurrentTime: async (): Promise<number> => {
      return currentTime;
    },
  }), [currentTime, onPlayingChange, startTimeTracking, stopTimeTracking, seekToTime, videoId]);

  const onStateChange = useCallback((state: string) => {
    onChangeState?.(state);
    
    // Notify parent of playing state changes
    const isPlaying = state === 'playing';
    handlePlayStateChange(isPlaying);
  }, [onChangeState, handlePlayStateChange]);

  const onPlayerError = useCallback((error: string) => {
    console.error('YouTube Player Error:', error);
    onError?.(error);
  }, [onError]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTimeTracking();
    };
  }, [stopTimeTracking]);

  // Universal iframe implementation - works on both web and native
  const params = new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    mute: muted ? '1' : '0',
    controls: controls ? '1' : '0',
    loop: loop ? '1' : '0',
    rel: '0', // Don't show related videos
    modestbranding: '1', // Hide YouTube logo
    playsinline: '1', // Play inline on iOS
    enablejsapi: '1', // Enable JS API for control
    origin: Platform.OS === 'web' ? window.location.origin : undefined,
  }).toString();

  // Validate video ID format (YouTube video IDs are typically 11 characters, but some can be longer)
  // Accept both 11-character video IDs and longer IDs for various YouTube content types
  const isValidVideoId = videoId && /^[a-zA-Z0-9_-]{11,}$/.test(videoId.trim());

  console.log('Video ID validation result:', isValidVideoId, 'for videoId:', videoId);

  if (!isValidVideoId) {
    console.warn('Invalid YouTube video ID format:', videoId, 'Length:', videoId?.length);
  }

  console.log('UnifiedYouTubePlayer received videoId:', videoId);
  console.log('Video ID length:', videoId?.length);
  console.log('Video ID type:', typeof videoId);

  return (
    <View style={[styles.container, { height, width }]}>
      {Platform.OS === 'web' ? (
        // Web-specific iframe implementation
        videoId ? (
          <View style={{ position: 'relative' }}>
            {React.createElement('iframe', {
              title: `YouTube video ${videoId}`,
              width: '100%',
              height: height,
              src: `https://www.youtube.com/embed/${videoId.trim()}?${params}&enablejsapi=1&origin=${Platform.OS === 'web' && typeof window !== 'undefined' ? window.location.origin : ''}`,
              frameBorder: '0',
              allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
              allowFullScreen: true,
              style: { borderRadius: 12 },
              onLoad: () => {
                console.log('YouTube iframe loaded successfully for video:', videoId);
                
                // Auto-start if playing prop is true
                if (playing) {
                  setTimeout(() => {
                    handlePlayStateChange(true);
                  }, 1000); // Give iframe time to initialize
                }
              },
              onError: (e: any) => {
                console.error('YouTube iframe error for video:', videoId, e);
                onError?.('Failed to load YouTube video');
              }
            })}
            {/* Add a debug overlay to show video info */}
            {!isValidVideoId && (
              <View style={styles.debugOverlay}>
                <Text style={styles.debugText}>Video ID: {videoId}</Text>
                <Text style={styles.debugText}>Length: {videoId?.length}</Text>
                <Text style={styles.debugText}>Valid: {String(isValidVideoId)}</Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.fallback}>
            <Text style={styles.fallbackTitle}>⚠️ Missing Video ID</Text>
            <Text style={styles.fallbackText}>No video ID provided</Text>
            <Text style={styles.fallbackSubText}>
              Unable to load video
            </Text>
            <Text style={styles.fallbackHint}>
              Please check the video URL
            </Text>
          </View>
        )
      ) : (
        // Native implementation using react-native-youtube-iframe
        YoutubeIframe ? (
          <YoutubeIframe
            height={height}
            play={playing}
            videoId={videoId}
            onChangeState={(state: string) => {
              console.log('Native YouTube state change:', state);
              onStateChange(state);
              const isPlaying = state === 'playing';
              handlePlayStateChange(isPlaying);
            }}
            onError={(error: string) => {
              console.error('Native YouTube error:', error);
              onPlayerError(error);
            }}
            allowWebViewZoom={false}
            webViewStyle={{ borderRadius: 12 }}
            initialPlayerParams={{
              controls: controls,
              modestbranding: true,
              rel: false,
            }}
          />
        ) : (
          // Fallback for devices without YouTube iframe support
          <View style={styles.fallback}>
            <Text style={styles.fallbackTitle}>🎵 YouTube Player</Text>
            <Text style={styles.fallbackText}>Video ID: {videoId}</Text>
            <Text style={styles.fallbackSubText}>
              Install react-native-youtube-iframe for native support
            </Text>
            <Text style={styles.fallbackHint}>
              Try opening in the YouTube app
            </Text>
          </View>
        )
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  webView: {
    backgroundColor: '#000',
    borderRadius: 12,
  },
  fallback: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderWidth: 2,
    borderColor: '#333',
    borderStyle: 'dashed',
  },
  fallbackTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  fallbackText: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  fallbackSubText: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
  },
  fallbackHint: {
    color: '#666',
    fontSize: 11,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  debugOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    padding: 4,
    borderRadius: 4,
    zIndex: 1000,
  },
  debugText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'monospace',
  },
});

export default UnifiedYouTubePlayer;
