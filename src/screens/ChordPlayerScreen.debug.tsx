import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ChordPlayerScreenDebug = ({ route, navigation }: any) => {
  const { youtubeUrl, songTitle, thumbnail, channel } = route.params || {};
  
  console.log('🔥 DEBUG ChordPlayerScreen rendered with:', {
    youtubeUrl,
    songTitle,
    thumbnail,
    channel,
    hasRoute: !!route,
    hasNavigation: !!navigation
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎸 Chord Player Debug</Text>
      <Text style={styles.info}>Song: {songTitle || 'No title'}</Text>
      <Text style={styles.info}>URL: {youtubeUrl || 'No URL'}</Text>
      <Text style={styles.info}>Channel: {channel || 'No channel'}</Text>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => {
          console.log('🔙 Back button pressed');
          navigation?.goBack();
        }}
      >
        <Text style={styles.buttonText}>← Back to Search</Text>
      </TouchableOpacity>
      
      <Text style={styles.note}>
        If you see this, navigation is working!
        Check console for debug logs.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  info: {
    color: '#aaa',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  note: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 30,
    fontStyle: 'italic',
  },
});

export default ChordPlayerScreenDebug;
