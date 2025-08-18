import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  Alert, ScrollView, StyleSheet, Text,
  TextInput,
  TouchableOpacity, View
} from 'react-native';

// Type assertion for React Native components to fix JSX errors
const TypedView = View as React.ComponentType<any>;
const TypedText = Text as React.ComponentType<any>;
const TypedTextInput = TextInput as React.ComponentType<any>;
const TypedTouchableOpacity = TouchableOpacity as React.ComponentType<any>;
const TypedScrollView = ScrollView as React.ComponentType<any>;

import { UnifiedSearchResult, unifiedYouTubeSearch } from '../api/unified-youtube';
import { RootStackParamList } from '../navigation/types';

type SearchScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Search'
>;

export const SearchScreen: React.FC = () => {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UnifiedSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  const handleSearch = async () => {
    if (!query.trim()) {
      Alert.alert('Error', 'Please enter a search term');
      return;
    }

    console.log('🔍 Starting search for:', query);
    setLoading(true);
    
    try {
      const searchResults = await unifiedYouTubeSearch(query);
      console.log('✅ Search results received:', searchResults.length, 'items');
      setResults(searchResults);
    } catch (error: any) {
      console.error('❌ Search error:', error);
      Alert.alert('Search Error', error.message || 'Search failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTestResults = () => {
    const mockResults: UnifiedSearchResult[] = [
      {
        id: 'dQw4w9WgXcQ',
        title: 'Rick Astley - Never Gonna Give You Up (Official Video)',
        thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
        channelTitle: 'Rick Astley',
        publishedAt: '2009-10-25T06:57:33Z',
        duration: '3:33'
      },
      {
        id: 'fJ9rUzIMcZQ',
        title: 'Queen - Bohemian Rhapsody (Official Video Remastered)',
        thumbnail: 'https://i.ytimg.com/vi/fJ9rUzIMcZQ/mqdefault.jpg',
        channelTitle: 'Queen Official',
        publishedAt: '2008-08-01T13:47:59Z',
        duration: '5:55'
      },
      {
        id: 'ZbZSe6N_BXs',
        title: 'Happy by Pharrell Williams',
        thumbnail: 'https://i.ytimg.com/vi/ZbZSe6N_BXs/mqdefault.jpg',
        channelTitle: 'Pharrell Williams',
        publishedAt: '2013-11-21T00:00:00Z',
        duration: '3:53'
      }
    ];
    
    console.log('🧪 Setting test results:', mockResults.length);
    setResults(mockResults);
  };

  const handleSelectSong = (item: UnifiedSearchResult) => {
    const youtubeUrl = `https://www.youtube.com/watch?v=${item.id}`;
    
    navigation.navigate('ChordPlayer', {
      youtubeUrl,
      songTitle: item.title,
      thumbnail: item.thumbnail,
      channel: item.channelTitle,
      chords: [],
    });
  };

  const toggleFavorite = async (item: UnifiedSearchResult) => {
    try {
      const existing = await AsyncStorage.getItem('favorites');
      let favoritesData = existing ? JSON.parse(existing) : [];
      
      const isFavorite = favorites.includes(item.id);
      
      if (isFavorite) {
        favoritesData = favoritesData.filter((fav: any) => fav.id !== item.id);
        setFavorites(favorites.filter(id => id !== item.id));
        Alert.alert('Removed', 'Song removed from favorites');
      } else {
        const favoriteItem = {
          id: item.id,
          title: item.title,
          thumbnail: item.thumbnail,
          channelTitle: item.channelTitle,
          dateAdded: new Date().toISOString(),
        };
        favoritesData.push(favoriteItem);
        setFavorites([...favorites, item.id]);
        Alert.alert('Added', 'Song added to favorites');
      }
      
      await AsyncStorage.setItem('favorites', JSON.stringify(favoritesData));
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Error', 'Failed to update favorites');
    }
  };

  return (
    <TypedView style={styles.container}>
      {/* Search Header */}
      <TypedView style={styles.searchContainer}>
        <TypedTextInput
          style={styles.searchInput}
          placeholder="Search for songs..."
          placeholderTextColor="#888"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
        />
        <TypedTouchableOpacity
          style={[styles.searchButton, loading && styles.searchButtonDisabled]}
          onPress={handleSearch}
          disabled={loading}
        >
          <TypedText style={styles.searchButtonText}>
            {loading ? 'Searching...' : 'Search'}
          </TypedText>
        </TypedTouchableOpacity>
        <TypedTouchableOpacity
          style={styles.testButton}
          onPress={handleTestResults}
        >
          <TypedText style={styles.testButtonText}>Test</TypedText>
        </TypedTouchableOpacity>
      </TypedView>

      {/* Status Display */}
      <TypedView style={styles.statusBar}>
        <TypedText style={styles.statusText}>
          {loading ? '🔍 Searching...' : 
           results.length > 0 ? `🎵 Found ${results.length} results` : 
           '🎶 Ready to search'}
        </TypedText>
      </TypedView>

      {/* GUARANTEED VISIBLE RESULTS */}
      <TypedScrollView style={styles.resultsContainer}>
        {results.map((item, index) => (
          <TypedTouchableOpacity 
            key={`result-${index}-${item.id}`}
            style={styles.resultCard}
            onPress={() => handleSelectSong(item)}
          >
            <TypedView style={styles.resultContent}>
              <TypedText style={styles.resultNumber}>#{index + 1}</TypedText>
              <TypedView style={styles.resultInfo}>
                <TypedText style={styles.resultTitle} numberOfLines={2}>
                  {item.title}
                </TypedText>
                <TypedText style={styles.resultChannel}>
                  by {item.channelTitle}
                </TypedText>
                {item.duration && (
                  <TypedText style={styles.resultDuration}>
                    Duration: {item.duration}
                  </TypedText>
                )}
              </TypedView>
              <TypedTouchableOpacity
                style={styles.favoriteButton}
                onPress={(e) => {
                  e.stopPropagation();
                  toggleFavorite(item);
                }}
              >
                <TypedText style={styles.favoriteIcon}>
                  {favorites.includes(item.id) ? '❤️' : '🤍'}
                </TypedText>
              </TypedTouchableOpacity>
            </TypedView>
          </TypedTouchableOpacity>
        ))}
        
        {/* Empty State */}
        {results.length === 0 && !loading && (
          <TypedView style={styles.emptyState}>
            <TypedText style={styles.emptyIcon}>🎵</TypedText>
            <TypedText style={styles.emptyTitle}>Search for Music</TypedText>
            <TypedText style={styles.emptyText}>
              Enter a song name above and tap Search or Test
            </TypedText>
          </TypedView>
        )}
        
        {/* Loading State */}
        {loading && (
          <TypedView style={styles.loadingState}>
            <TypedText style={styles.loadingIcon}>🔍</TypedText>
            <TypedText style={styles.loadingText}>Searching...</TypedText>
          </TypedView>
        )}
      </TypedScrollView>
    </TypedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    color: '#fff',
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#444',
  },
  searchButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: 'center',
  },
  searchButtonDisabled: {
    backgroundColor: '#555',
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  testButton: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: 'center',
  },
  testButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  statusBar: {
    backgroundColor: '#2a2a2a',
    padding: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  statusText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  resultsContainer: {
    flex: 1,
    padding: 16,
  },
  resultCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#444',
  },
  resultContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultNumber: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: 'bold',
    width: 30,
  },
  resultInfo: {
    flex: 1,
    marginLeft: 12,
  },
  resultTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  resultChannel: {
    color: '#007AFF',
    fontSize: 14,
    marginBottom: 2,
  },
  resultDuration: {
    color: '#888',
    fontSize: 12,
  },
  favoriteButton: {
    padding: 8,
  },
  favoriteIcon: {
    fontSize: 24,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  loadingState: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default SearchScreen;
