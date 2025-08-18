import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
    Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import { RootStackParamList } from '../navigation/types';

type LibraryScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Library'
>;

interface FavoriteSong {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
  dateAdded: string;
}

export default function LibraryScreen() {
  const [favorites, setFavorites] = useState<FavoriteSong[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<LibraryScreenNavigationProp>();

  useFocusEffect(
    React.useCallback(() => {
      loadFavorites();
    }, [])
  );

  const loadFavorites = async () => {
    try {
      const savedFavorites = await AsyncStorage.getItem('favorites');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (songId: string) => {
    Alert.alert(
      'Remove Favorite',
      'Are you sure you want to remove this song from favorites?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedFavorites = favorites.filter(song => song.id !== songId);
              setFavorites(updatedFavorites);
              await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
            } catch (error) {
              console.error('Error removing favorite:', error);
            }
          },
        },
      ]
    );
  };

  const handleSelectSong = (song: FavoriteSong) => {
    console.log('📚 LibraryScreen: Selecting song for analysis:', song.title);
    navigation.navigate('ChordPlayer', {
      youtubeUrl: `https://www.youtube.com/watch?v=${song.id}`,
      songTitle: song.title,
      thumbnail: song.thumbnail,
      channel: song.channelTitle,
      chords: [], // Empty chords will trigger analysis in ChordPlayer
    });
  };

  const renderFavoriteItem = ({ item }: { item: FavoriteSong }) => (
    <TouchableOpacity
      style={styles.favoriteItem}
      onPress={() => handleSelectSong(item)}
    >
      <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
      <View style={styles.songInfo}>
        <Text style={styles.songTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.channelTitle} numberOfLines={1}>
          {item.channelTitle}
        </Text>
        <Text style={styles.dateAdded}>
          Added {new Date(item.dateAdded).toLocaleDateString()}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeFavorite(item.id)}
      >
        <Text style={styles.removeButtonText}>×</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading favorites...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Library</Text>
        <Text style={styles.headerSubtitle}>
          {favorites.length} saved song{favorites.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={renderFavoriteItem}
        contentContainerStyle={favorites.length === 0 ? styles.emptyContainer : undefined}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🎵</Text>
            <Text style={styles.emptyTitle}>No favorites yet</Text>
            <Text style={styles.emptyText}>
              Search for songs and add them to your favorites to see them here
            </Text>
            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => navigation.navigate('Search')}
            >
              <Text style={styles.searchButtonText}>Start Searching</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  loadingText: {
    color: '#888',
    fontSize: 16,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#888',
  },
  favoriteItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    alignItems: 'center',
  },
  thumbnail: {
    width: 80,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  channelTitle: {
    color: '#888',
    fontSize: 14,
    marginBottom: 2,
  },
  dateAdded: {
    color: '#666',
    fontSize: 12,
  },
  removeButton: {
    width: 30,
    height: 30,
    backgroundColor: '#333',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#ff4444',
    fontSize: 20,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  searchButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});