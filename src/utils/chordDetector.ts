import { AnalysisResult } from '../types'; // Assuming you have this type defined

export interface ChordData {
  time: number;       // in seconds
  chord: string;      // e.g. 'C', 'Gm7'
  confidence: number; // 0-1
  bar?: number;       // optional bar number
}

// Type for the mock song database
type MockSongDatabase = {
  [videoId: string]: ChordData[];
};

// Mock database of known songs
const MOCK_SONG_DATABASE: MockSongDatabase = {
  'dQw4w9WgXcQ': [ // Never Gonna Give You Up
    { time: 0, chord: 'Bm', confidence: 0.95, bar: 1 },
    { time: 2.3, chord: 'A', confidence: 0.93, bar: 2 },
    { time: 4.1, chord: 'D', confidence: 0.91, bar: 3 }
  ],
  'EJXDMwGWhoA': [ // No Woman No Cry
    { time: 0, chord: 'C', confidence: 0.97, bar: 1 },
    { time: 4.2, chord: 'G', confidence: 0.95, bar: 2 },
    { time: 8.5, chord: 'Am', confidence: 0.94, bar: 3 }
  ]
};

// Default mock data for unknown songs
const DEFAULT_MOCK_DATA: ChordData[] = [
  { time: 0, chord: 'C', confidence: 0.9, bar: 1 },
  { time: 2.5, chord: 'G', confidence: 0.85, bar: 2 },
  { time: 5.0, chord: 'Am', confidence: 0.8, bar: 3 }
];

/**
 * Extracts video ID from various YouTube URL formats
 */
const extractVideoId = (url: string): string | null => {
  const patterns = [
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/,
    /^.*(youtube.com\/shorts\/)([^#&?]*).*/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[2].length === 11) {
      return match[2];
    }
  }
  return null;
};

/**
 * Mock implementation of audio analysis
 */
export const analyzeAudioMock = async (youtubeUrl: string): Promise<ChordData[]> => {
  try {
    const videoId = extractVideoId(youtubeUrl);
    if (!videoId) {
      console.warn('Could not extract video ID, using default mock data');
      return DEFAULT_MOCK_DATA;
    }

    return MOCK_SONG_DATABASE[videoId] || DEFAULT_MOCK_DATA;
  } catch (error) {
    console.error('Mock analysis failed:', error);
    return DEFAULT_MOCK_DATA;
  }
};

/**
 * Real implementation using API call
 */
export const analyzeAudioReal = async (youtubeUrl: string): Promise<AnalysisResult> => {
  try {
    const response = await fetch('https://your-api-endpoint.com/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ youtubeUrl }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API analysis failed:', error);
    throw error; // Re-throw to let caller handle
  }
};

/**
 * Main export - switches between mock and real implementations
 */
export const analyzeAudio = __DEV__ ? analyzeAudioMock : analyzeAudioReal;

// Utility function to convert AnalysisResult to ChordData[]
export const convertToChordData = (result: AnalysisResult): ChordData[] => {
  if (!result.success) return [];
  return result.chords.map(chord => ({
    time: chord.time,
    chord: chord.chord,
    confidence: chord.confidence,
    bar: chord.bar
  }));
};