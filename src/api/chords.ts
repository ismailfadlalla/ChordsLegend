import { apiCall } from './client';

export interface ChordData {
  time: number;
  chord: string;
  confidence: number;
  duration?: number;
  beat?: number;
}

export const analyzeChords = async (youtubeUrl: string): Promise<ChordData[]> => {
  console.log('🎵 Starting chord analysis for:', youtubeUrl);
  
  try {
    // Use the properly configured apiCall function from client.ts
    // This will automatically use Railway URL: https://chordslegend.up.railway.app
    const data = await apiCall('/api/analyze-song', {
      method: 'POST',
      body: JSON.stringify({
        youtube_url: youtubeUrl,
      })
    });

    console.log('✅ Chord analysis response:', data);

    if (data.chords && Array.isArray(data.chords)) {
      // Convert response to ChordData format
      const chordProgression: ChordData[] = data.chords.map((chord: any, index: number) => ({
        time: chord.time || index * 4, // 4 seconds per chord if no time provided
        chord: chord.chord || chord.name || 'C',
        confidence: chord.confidence || 0.8,
        duration: chord.duration || 4,
        beat: chord.beat || ((index % 4) + 1),
      }));

      console.log('🎸 Processed chord progression:', chordProgression);
      return chordProgression;
    } else if (data.error) {
      throw new Error(`API Error: ${data.error}`);
    } else {
      throw new Error('Invalid response format from API');
    }
  } catch (error) {
    console.error('❌ Chord analysis failed:', error);
    throw new Error('Connection failed. Please check your network.');
  }
};

// Keep existing search functionality if needed
export const searchSongs = async (query: string) => {
  try {
    const data = await apiCall('/api/search', {
      method: 'POST',
      body: JSON.stringify({
        query: query,
      })
    });

    return data.results || [];
  } catch (error) {
    console.error('❌ Song search failed:', error);
    throw error;
  }
};