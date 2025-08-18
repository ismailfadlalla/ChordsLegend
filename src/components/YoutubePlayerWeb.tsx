import React, { useEffect, useRef } from 'react';
import { View, Text } from 'react-native';

interface YoutubePlayerWebProps {
  videoId: string;
  height?: number;
  width?: string;
  onReady?: () => void;
  onStateChange?: (state: any) => void;
}

export default function YoutubePlayerWeb({ 
  videoId, 
  height = 200, 
  width = '100%',
  onReady,
  onStateChange 
}: YoutubePlayerWebProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (onReady) {
      // Simulate onReady after iframe loads
      const timer = setTimeout(() => {
        console.log('🎬 YouTube player ready for video:', videoId);
        onReady();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [videoId, onReady]);

  if (typeof window === 'undefined') {
    return (
      <View style={{ 
        height, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#000',
        borderRadius: 8 
      }}>
        <Text style={{ color: 'white', fontSize: 16 }}>Loading YouTube Player...</Text>
      </View>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}&autoplay=0&rel=0&modestbranding=1`;

  return (
    <View style={{ height, width: width === '100%' ? '100%' : width }}>
      <iframe
        ref={iframeRef}
        src={embedUrl}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          borderRadius: '8px',
        }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title={`YouTube video ${videoId}`}
      />
    </View>
  );
}