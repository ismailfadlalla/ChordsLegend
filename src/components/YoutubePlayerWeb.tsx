// src/components/YoutubePlayerWeb.tsx
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

// Web-compatible YouTube Player component
const YoutubePlayerWeb = ({ videoId, height = 200, playing = false, onChangeState, ...props }: any) => {
  if (Platform.OS === 'web') {
    // For web, use an iframe
    return (
      <View style={[styles.container, { height }]}>
        <iframe
          title={`YouTube video ${videoId}`}
          width="100%"
          height={height}
          src={`https://www.youtube.com/embed/${videoId}?autoplay=${playing ? 1 : 0}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </View>
    );
  }

  // For mobile, return a fallback component that doesn't use any problematic dependencies
  return (
    <View style={[styles.container, styles.fallback, { height }]}>
      <Text style={styles.fallbackText}>YouTube Player</Text>
      <Text style={styles.fallbackText}>Video ID: {videoId}</Text>
      <Text style={styles.fallbackSubText}>Mobile playback available in production build</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    borderRadius: 8,
    overflow: 'hidden',
  },
  iframe: {
    border: 'none',
    borderRadius: 8,
  },
  fallback: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
  },
  fallbackText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 5,
  },
  fallbackSubText: {
    color: '#ccc',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default YoutubePlayerWeb;
