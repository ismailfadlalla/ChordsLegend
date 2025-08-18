import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { searchYouTube } from '../api/youtube';
import type { RootStackParamList } from '../navigation/types';

type SearchScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Search'>;

// Type assertion for React Native components to fix JSX errors
const TypedView = View as React.ComponentType<any>;
const TypedText = Text as React.ComponentType<any>;
const TypedTextInput = TextInput as React.ComponentType<any>;
const TypedTouchableOpacity = TouchableOpacity as React.ComponentType<any>;
const TypedImage = Image as React.ComponentType<any>;
const TypedScrollView = ScrollView as React.ComponentType<any>;

export const SearchScreen: React.FC = () => {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  console.log('🔄 SearchScreen render - results:', results.length, 'items');

  const toggleFavorite = (videoId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(videoId)) {
        newFavorites.delete(videoId);
      } else {
        newFavorites.add(videoId);
      }
      return newFavorites;
    });
  };

  const handleSongSelect = (item: any) => {
    console.log('🎵 Song selected:', item.title);
    console.log('🎵 Navigation available:', !!navigation);
    console.log('🎵 Attempting navigation to ChordPlayer...');
    
    // Simple navigation test
    try {
      navigation.navigate('ChordPlayer', {
        youtubeUrl: `https://www.youtube.com/watch?v=${item.id}`,
        songTitle: item.title,
        thumbnail: item.thumbnail || 'https://img.youtube.com/vi/' + item.id + '/default.jpg',
        channel: item.channelTitle || 'Unknown Channel',
        chords: []
      });
      console.log('✅ Navigation called successfully');
    } catch (error) {
      console.error('❌ Navigation error:', error);
      Alert.alert('Navigation Error', `Failed to navigate: ${error.message}`);
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) {
      Alert.alert('Error', 'Please enter a search term');
      return;
    }

    setLoading(true);
    
    try {
      console.log('🔍 Searching YouTube for:', query);
      const searchResults = await searchYouTube(query);
      console.log('✅ Search completed:', searchResults.length, 'results');
      setResults(searchResults);
      
    } catch (error: any) {
      console.error('❌ Search error:', error);
      Alert.alert('Search Error', error.message || 'Failed to search YouTube');
      setResults([]);
    } finally {
      setLoading(false);
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
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
        <TypedTouchableOpacity
          style={styles.searchButton}
          onPress={handleSearch}
          disabled={loading}
        >
          <TypedText style={styles.searchButtonText}>
            {loading ? 'Searching...' : 'Search'}
          </TypedText>
        </TypedTouchableOpacity>
      </TypedView>

      {/* Status Display */}
      <TypedView style={styles.statusBar}>
        <TypedText style={styles.statusText}>
          {loading ? '🔍 Searching...' : 
           results.length > 0 ? `🎵 Found ${results.length} results` : 
           '🎶 Ready to search'}
        </TypedText>
        
        {/* Debug Test Button */}
        <TypedTouchableOpacity
          style={styles.debugButton}
          onPress={() => {
            console.log('🧪 Testing navigation to ChordPlayer...');
            navigation.navigate('ChordPlayer', {
              youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
              songTitle: 'Test Song',
              thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
              channel: 'Test Channel',
              chords: []
            });
          }}
        >
          <TypedText style={styles.debugButtonText}>🧪 Test Navigation</TypedText>
        </TypedTouchableOpacity>
        
        {/* Quick Mock Test Button */}
        <TypedTouchableOpacity
          style={[styles.debugButton, { backgroundColor: '#4CAF50' }]}
          onPress={() => {
            console.log('🧪 Testing with mock progression...');
            navigation.navigate('ChordPlayer', {
              youtubeUrl: 'https://www.youtube.com/watch?v=oHg5SJYRHA0',
              songTitle: 'Never Gonna Give You Up (Mock Test)',
              thumbnail: 'https://img.youtube.com/vi/oHg5SJYRHA0/maxresdefault.jpg',
              channel: 'Rick Astley',
              chords: []
            });
          }}
        >
          <TypedText style={styles.debugButtonText}>🎵 Mock Test</TypedText>
        </TypedTouchableOpacity>
      </TypedView>

      {/* Results */}
      {results.length > 0 ? (
        <TypedView style={{ flex: 1 }}>
          <TypedText style={styles.resultsHeader}>
            🎵 Found {results.length} results
          </TypedText>
          
          {/* Results List - Using proven manual mapping */}
          <TypedView style={styles.resultsList}>
            {results.map((item, index) => (
              <TypedTouchableOpacity 
                key={`${item.id}-${index}`} 
                style={styles.resultCard}
                onPress={() => handleSongSelect(item)}
                activeOpacity={0.8}
              >
                <TypedView style={styles.resultContent}>
                  {/* Thumbnail with Play Overlay */}
                  <TypedView style={styles.thumbnailContainer}>
                    <TypedImage 
                      source={{ uri: item.thumbnail }}
                      style={styles.thumbnail}
                      resizeMode="cover"
                    />
                    <TypedView style={styles.playOverlay}>
                      <TypedText style={styles.playIcon}>▶️</TypedText>
                    </TypedView>
                  </TypedView>
                  
                  {/* Content */}
                  <TypedView style={styles.resultInfo}>
                    <TypedText style={styles.resultTitle} numberOfLines={2}>
                      {item.title}
                    </TypedText>
                    <TypedText style={styles.resultChannel} numberOfLines={1}>
                      {item.channelTitle}
                    </TypedText>
                    <TypedView style={styles.metaRow}>
                      <TypedText style={styles.resultMeta}>
                        {item.publishedAt ? new Date(item.publishedAt).getFullYear() : 'Video'}
                      </TypedText>
                      <TypedText style={styles.resultMeta}>•</TypedText>
                      <TypedText style={styles.resultMeta}>YouTube</TypedText>
                    </TypedView>
                  </TypedView>
                  
                  {/* Favorite Button */}
                  <TypedTouchableOpacity 
                    style={styles.favoriteButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      toggleFavorite(item.id);
                    }}
                  >
                    <TypedText style={[styles.favoriteIcon, { 
                      color: favorites.has(item.id) ? '#FF6B6B' : '#666' 
                    }]}>
                      {favorites.has(item.id) ? '❤️' : '🤍'}
                    </TypedText>
                  </TypedTouchableOpacity>
                </TypedView>
              </TypedTouchableOpacity>
            ))}
          </TypedView>
        </TypedView>
      ) : (
        <TypedView style={styles.emptyContainer}>
          {loading ? (
            <TypedText style={styles.loadingText}>🔍 Searching...</TypedText>
          ) : (
            <TypedText style={styles.emptyText}>🎵 Enter a search term above</TypedText>
          )}
        </TypedView>
      )}
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
    backgroundColor: '#2a2a2a',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#3a3a3a',
    color: '#fff',
    padding: 14,
    borderRadius: 8,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 8,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  statusBar: {
    backgroundColor: '#2a2a2a',
    padding: 12,
    alignItems: 'center',
  },
  statusText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  resultsHeader: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    padding: 16,
    backgroundColor: '#2a2a2a',
    textAlign: 'center',
  },
  resultsList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultCard: {
    backgroundColor: '#2a2a2a',
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
  },
  resultContent: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'flex-start',
  },
  thumbnail: {
    width: 120,
    height: 68,
    borderRadius: 8,
    backgroundColor: '#3a3a3a',
  },
  thumbnailContainer: {
    position: 'relative',
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
  },
  playIcon: {
    fontSize: 24,
    color: '#fff',
  },
  resultInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  resultTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 4,
  },
  resultChannel: {
    color: '#aaa',
    fontSize: 13,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  resultMeta: {
    color: '#888',
    fontSize: 12,
  },
  favoriteButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteIcon: {
    fontSize: 20,
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
  },
  emptyText: {
    color: '#fff',
    fontSize: 16,
  },
  debugButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  debugButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default SearchScreen;
