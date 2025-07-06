import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  Alert, FlatList, Image, StyleSheet, Text,
  TextInput,
  TouchableOpacity, View
} from 'react-native';
import { searchYouTube } from '../api/youtube';
import { RootStackParamList } from '../navigation/types';

type SearchScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Search'
>;

interface SearchResult {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
}

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const navigation = useNavigation<SearchScreenNavigationProp>();

  // Load favorites on component mount
  React.useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const savedFavorites = await AsyncStorage.getItem('favorites');
      if (savedFavorites) {
        const favoritesData = JSON.parse(savedFavorites);
        setFavorites(favoritesData.map((fav: any) => fav.id));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const toggleFavorite = async (item: SearchResult) => {
    try {
      const savedFavorites = await AsyncStorage.getItem('favorites');
      let favoritesData = savedFavorites ? JSON.parse(savedFavorites) : [];
      
      const isAlreadyFavorite = favoritesData.some((fav: any) => fav.id === item.id);
      
      if (isAlreadyFavorite) {
        // Remove from favorites
        favoritesData = favoritesData.filter((fav: any) => fav.id !== item.id);
        setFavorites(favorites.filter(id => id !== item.id));
        Alert.alert('Removed', 'Song removed from favorites');
      } else {
        // Add to favorites
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

  const handleSearch = async () => {
    if (!query.trim()) {
      Alert.alert('Error', 'Please enter a search term');
      return;
    }

    setLoading(true);
    try {
      const searchResults = await searchYouTube(query);
      setResults(searchResults);
    } catch (error) {
      Alert.alert('Error', 'Failed to search. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSong = (item: SearchResult) => {
    // Convert YouTube video ID to full URL format expected by ChordPlayerScreen
    const youtubeUrl = `https://www.youtube.com/watch?v=${item.id}`;
    
    navigation.navigate('ChordPlayer', {
      youtubeUrl,
      songTitle: item.title,
      thumbnail: item.thumbnail,
      channel: item.channelTitle,
      chords: [], // Empty chords array - will be analyzed by ChordPlayerScreen
    });
  };

  const renderSearchResult = ({ item }: { item: SearchResult }) => {
    const isFavorite = favorites.includes(item.id);
    
    return (
      <TouchableOpacity
        style={styles.resultItem}
        onPress={() => handleSelectSong(item)}
      >
        <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
        <View style={styles.resultInfo}>
          <Text style={styles.resultTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.resultChannel} numberOfLines={1}>
            {item.channelTitle}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(item)}
        >
          <Text style={[styles.favoriteIcon, isFavorite && styles.favoriteIconActive]}>
            {isFavorite ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for songs..."
          placeholderTextColor="#888"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity
          style={[styles.searchButton, loading && styles.searchButtonDisabled]}
          onPress={handleSearch}
          disabled={loading}
        >
          <Text style={styles.searchButtonText}>
            {loading ? 'Searching...' : 'Search'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={renderSearchResult}
        style={styles.resultsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {loading ? 'Searching...' : 'Search for your favorite songs'}
            </Text>
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
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#333',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  searchButtonDisabled: {
    backgroundColor: '#555',
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  resultsList: {
    flex: 1,
  },
  resultItem: {
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
  resultInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  resultTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  resultChannel: {
    color: '#888',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
  },
  favoriteButton: {
    padding: 8,
    marginLeft: 8,
  },
  favoriteIcon: {
    fontSize: 24,
  },
  favoriteIconActive: {
    fontSize: 24,
  },
});