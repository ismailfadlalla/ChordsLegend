// hooks/useYouTubeSearch.ts
import { useState, useCallback } from 'react';
import { YouTubeVideo } from '../api/youtube';

export const useYouTubeSearch = () => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>();

  const search = useCallback(async (query: string, isRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call - replace with your actual implementation
      const results = await mockFetchVideos(query);
      
      if (isRefresh) {
        setVideos(results);
      } else {
        setVideos(prev => [...prev, ...results]);
      }
      
      setHasMore(results.length >= 10); // Example threshold
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      search(query, false);
    }
  }, [hasMore, loading, search]);

  return {
    videos,
    loading,
    error,
    search,
    loadMore,
    hasMore
  };
};

// Mock function - replace with your actual API call
async function mockFetchVideos(query: string): Promise<YouTubeVideo[]> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        {
          id: { videoId: 'dQw4w9WgXcQ' },
          snippet: {
            title: query ? `${query} Example` : 'Example Video',
            channelTitle: 'Example Channel',
            thumbnails: {
              default: { url: 'https://via.placeholder.com/120' },
              medium: { url: 'https://via.placeholder.com/320' },
              high: { url: 'https://via.placeholder.com/480' }
            },
            publishedAt: new Date().toISOString()
          },
          duration: 'PT3M33S'
        }
      ]);
    }, 1000);
  });
}