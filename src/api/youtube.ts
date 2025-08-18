import { getYouTubeApiKey } from '../config/env';

// Get API key using the centralized environment configuration
const API_KEY = getYouTubeApiKey() || 'AIzaSyCNBzdkGau4j1nKzZUm6AjLv8FPB1mj_Gs'; // Temporary fallback for testing

// Debug: Log the final API key state
console.log('🔑 Final API Key status:', {
  fromConfig: !!getYouTubeApiKey(),
  final: !!API_KEY,
  length: API_KEY?.length || 0
});

export const searchYouTube = async (query: string) => {
  try {
    console.log('🔍 YouTube search starting...');
    console.log('🔑 API Key available:', !!API_KEY);
    console.log('🌍 Environment:', typeof window !== 'undefined' ? 'web' : 'mobile');
    
    if (!API_KEY) {
      console.error('❌ YouTube API key is missing!');
      console.error('💡 Please ensure EXPO_PUBLIC_YOUTUBE_API_KEY is set in your .env file');
      console.error('💡 You may need to restart the development server after adding the key');
      throw new Error('YouTube API key is missing. Please check your .env file and restart the development server.');
    }
    
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(query)}&type=video&key=${API_KEY}`;
    console.log('🔎 Making request to YouTube API...');
    
    const response = await fetch(url);
    console.log('📡 Response status:', response.status);
    console.log('📡 Response ok:', response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ YouTube API HTTP error:', response.status, errorText);
      throw new Error(`YouTube API error (${response.status}): ${errorText}`);
    }
    
    const data = await response.json();
    console.log('📦 Raw response data:', data);
    
    if (data.error) {
      console.error('❌ YouTube API error response:', data.error);
      throw new Error(`YouTube API error: ${data.error.message}`);
    }
    
    if (!data.items || !Array.isArray(data.items)) {
      console.error('❌ YouTube API returned no items:', data);
      throw new Error('YouTube API returned no items');
    }
    
    console.log('✅ YouTube API returned items:', data.items.length);
    
    // Debug: log the first item to see structure
    if (data.items.length > 0) {
      console.log('🔍 First item structure:', JSON.stringify(data.items[0], null, 2));
    }
    
    const results = data.items.map((item: any, index: number) => {
      console.log(`🎥 Processing item ${index + 1}:`, {
        id: item.id,
        videoId: item.id?.videoId,
        title: item.snippet?.title,
        hasSnippet: !!item.snippet,
        hasThumbnails: !!item.snippet?.thumbnails
      });
      
      return {
        id: item.id?.videoId || item.id,
        title: item.snippet?.title || 'Unknown Title',
        thumbnail: item.snippet?.thumbnails?.medium?.url || 
                  item.snippet?.thumbnails?.default?.url || 
                  item.snippet?.thumbnails?.high?.url || '',
        channelTitle: item.snippet?.channelTitle || 'Unknown Channel',
        publishedAt: item.snippet?.publishedAt,
      };
    });
    
    console.log('🎵 Processed results count:', results.length);
    console.log('🎵 Processed results preview:', results.map(r => ({ id: r.id, title: r.title.substring(0, 50) })));
    return results;
  } catch (error) {
    console.error('❌ YouTube search error:', error);
    throw new Error('Failed to search YouTube: ' + (error instanceof Error ? error.message : String(error)));
  }
};