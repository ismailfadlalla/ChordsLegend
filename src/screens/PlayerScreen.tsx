import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { testChordsAPI, checkServerStatus } from '../api/client';

export default function PlayerScreen() {
  const [chords, setChords] = useState<string[]>([]);
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
          {chords.map((chord, index) => (
            <Text key={index} style={styles.chord}>{chord}</Text>
          ))}
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
  chord: {
    fontSize: 24,
    marginVertical: 5,
  },
  error: {
    color: 'red',
    marginTop: 20,
    textAlign: 'center',
  },
});