import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

interface SimpleYouTubePlayerProps {
  videoId: string;
  height?: number;
  width?: number | string;
  playing?: boolean;
  onTimeUpdate?: (time: number) => void;
  onPlayingChange?: (playing: boolean) => void;
  controls?: boolean;
}

export interface SimpleYouTubePlayerRef {
  play: () => void;
  pause: () => void;
  getCurrentTime: () => Promise<number>;
}

const SimpleYouTubePlayer = React.forwardRef<SimpleYouTubePlayerRef, SimpleYouTubePlayerProps>(({
  videoId,
  height = 340,
  width = '100%',
  playing = false,
  onTimeUpdate,
  onPlayingChange,
  controls = true,
}, ref) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // YouTube iframe API communication
  const postMessage = (command: string, args?: any[]) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      const message = {
        event: 'command',
        func: command,
        args: args || []
      };
      iframeRef.current.contentWindow.postMessage(JSON.stringify(message), '*');
    }
  };

  // Listen for YouTube iframe messages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://www.youtube.com') return;
      
      try {
        const data = JSON.parse(event.data);
        
        if (data.event === 'video-progress') {
          const time = data.info?.currentTime || 0;
          setCurrentTime(time);
          onTimeUpdate?.(time);
        }
        
        if (data.event === 'video-state') {
          const playing = data.info === 1; // 1 = playing, 2 = paused
          setIsPlaying(playing);
          onPlayingChange?.(playing);
        }
      } catch (error) {
        // Ignore parsing errors
      }
    };

    if (Platform.OS === 'web') {
      window.addEventListener('message', handleMessage);
      return () => window.removeEventListener('message', handleMessage);
    }
  }, [onTimeUpdate, onPlayingChange]);

  // Time tracking fallback for when iframe doesn't respond
  const startTimeTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    const startTime = Date.now();
    const startVideoTime = currentTime;
    
    intervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const newTime = startVideoTime + elapsed;
      setCurrentTime(newTime);
      onTimeUpdate?.(newTime);
    }, 500); // Update every 500ms
  };

  const stopTimeTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Expose player controls
  useImperativeHandle(ref, () => ({
    play: () => {
      postMessage('playVideo');
      setIsPlaying(true);
      onPlayingChange?.(true);
      startTimeTracking();
    },
    pause: () => {
      postMessage('pauseVideo');
      setIsPlaying(false);
      onPlayingChange?.(false);
      stopTimeTracking();
    },
    getCurrentTime: async (): Promise<number> => {
      return currentTime;
    },
  }), [currentTime, onTimeUpdate, onPlayingChange]);

  // Build YouTube iframe URL with API enabled
  const params = new URLSearchParams({
    autoplay: '0',
    controls: controls ? '1' : '0',
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
    enablejsapi: '1', // Enable JavaScript API
    origin: window.location.origin, // Required for API
  }).toString();

  const iframeUrl = `https://www.youtube.com/embed/${videoId}?${params}`;

  return (
    <View style={[styles.container, { height, width }]}>
      {Platform.OS === 'web' ? (
        videoId ? (
          React.createElement('iframe', {
            ref: (element: HTMLIFrameElement) => {
              iframeRef.current = element;
            },
            title: `YouTube video ${videoId}`,
            width: '100%',
            height: height,
            src: iframeUrl,
            frameBorder: '0',
            allowFullScreen: true,
            allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
            style: { borderRadius: 12 },
          })
        ) : (
          <View style={styles.fallback}>
            <Text style={styles.fallbackText}>No video ID provided</Text>
          </View>
        )
      ) : (
        <View style={styles.fallback}>
          <Text style={styles.fallbackText}>Video: {videoId}</Text>
          <Text style={styles.fallbackSubText}>Mobile YouTube support: Use controls to play</Text>
          <Text style={styles.timeText}>Time: {currentTime.toFixed(1)}s</Text>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    borderRadius: 12,
    overflow: 'hidden',
  },
  fallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderWidth: 2,
    borderColor: '#333',
  },
  fallbackText: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
  },
  fallbackSubText: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  timeText: {
    color: '#4CAF50',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 8,
    fontWeight: 'bold',
  },
});

export default SimpleYouTubePlayer;
