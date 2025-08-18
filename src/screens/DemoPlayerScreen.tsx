// DEMO/TEST SCREEN ONLY: Not used in production navigation
// This file was archived from PlayerScreen.tsx for reference/testing.
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';
import { checkServerStatus, testChordsAPI } from '../api/client';
import YoutubePlayerWeb from '../components/YoutubePlayerWeb';

export default function DemoPlayerScreen() {
  // For demo, use a hardcoded YouTube video ID
  const [chords, setChords] = useState<string[]>([]);
  const [videoId, setVideoId] = useState<string>('gWju37TZfo0'); // Hotel California
  const [status, setStatus] = useState<string>('Connecting...');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        setIsLoading(true);
        await checkServerStatus();
        setStatus('Server connected');
      } catch (err) {
        setStatus('Server connection failed');
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  const handleFetchChords = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await testChordsAPI();
      setChords(data.chords);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch chords');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.status}>Status: {status}</Text>
      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button 
          title="Get Chord Progression" 
          onPress={handleFetchChords} 
          disabled={status !== 'Server connected'}
        />
      )}
      {error && <Text style={styles.error}>{error}</Text>}
      {chords.length > 0 && (
        <View style={styles.chordsContainer}>
          <Text style={styles.title}>Current Progression:</Text>
          {/* Show YouTube player */}
          <View style={{ height: 220, width: '100%', marginBottom: 20 }}>
            <YoutubePlayerWeb videoId={videoId} />
          </View>
          {/* Show chords in a horizontal scroll */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
            {chords.map((chord, index) => (
              <View key={index} style={styles.chordBox}>
                <Text style={styles.chord}>{chord}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  status: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  chordsContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chordBox: {
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 10,
    margin: 5,
    minWidth: 50,
    alignItems: 'center',
  },
  chord: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginTop: 20,
    textAlign: 'center',
  },
});
