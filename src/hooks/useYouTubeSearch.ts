// hooks/useYouTubeSearch.ts
import Constants from 'expo-constants';
import { useCallback, useState } from 'react';
import { YouTubeVideo } from '../types/models';

// Replace mockFetchVideos with real YouTube API call
async function fetchYouTubeVideos(query: string): Promise<YouTubeVideo[]> {
  const API_KEY = (Constants.expoConfig?.extra?.EXPO_PUBLIC_YOUTUBE_API_KEY) || process.env.EXPO_PUBLIC_YOUTUBE_API_KEY;
  if (!API_KEY) throw new Error('YouTube API key not configured');
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(query)}&type=video&key=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  if (!data.items || data.items.length === 0) return [];
  return data.items.map((item: any) => ({
    id: { videoId: item.id.videoId },
    snippet: {
      title: item.snippet.title,
      channelTitle: item.snippet.channelTitle,
      thumbnails: {
        default: { url: item.snippet.thumbnails.default.url },
        high: { url: item.snippet.thumbnails.high?.url }
      }
    },
    duration: item.contentDetails?.duration || ''
  }));
}

export const useYouTubeSearch = () => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>();
  const [currentQuery, setCurrentQuery] = useState<string>('');

  const search = useCallback(async (query: string, isRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      setCurrentQuery(query);
      // Use real API call
      const results = await fetchYouTubeVideos(query);
      if (isRefresh) {
        setVideos(results);
      } else {
        setVideos(prev => [...prev, ...results]);
      }
      setHasMore(results.length >= 10);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(() => {
    if (hasMore && !loading && currentQuery) {
      search(currentQuery, false);
    }
  }, [hasMore, loading, currentQuery, search]);

  return {
    videos,
    loading,
    error,
    search,
    loadMore,
    hasMore
  };
};