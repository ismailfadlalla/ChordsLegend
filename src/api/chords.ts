// Enhanced ChordData interface with more detailed types
export interface ChordData {
  time: number;          // Time in seconds
  chord: string;         // Chord name (e.g., "Cmaj7", "D#m")
  confidence: number;    // Confidence score between 0-1
  duration?: number;     // Optional: Duration the chord lasts
  beat?: number;         // Optional: Beat position in measure
}

// Type for API response
interface ApiResponse {
  status: 'success' | 'error';
  chords?: any[];
  error?: string;
  analysisId?: string;
  timestamp?: string;
}

// Configuration
const API_CONFIG = {
  baseUrl: process.env.EXPO_PUBLIC_API_URL || process.env.API_URL || 'http://192.168.1.138:5000',
  timeout: 10000, // 10 seconds
  retries: 2,
};

// Utility function to safely convert unknown error types
function toError(error: unknown): Error {
  if (error instanceof Error) return error;
  if (typeof error === 'string') return new Error(error);
  return new Error(String(error));
}

/**
 * Enhanced chord analysis service with:
 * - Better error handling
 * - Request timeout
 * - Retry mechanism
 * - Type safety
 */
export const analyzeChords = async (youtubeUrl: string): Promise<ChordData[]> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

  try {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= API_CONFIG.retries; attempt++) {
      try {
        const response = await fetch(`${API_CONFIG.baseUrl}/analyze`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({ 
            youtube_url: youtubeUrl,
            options: {
              detailed: true,  // Request additional data if supported
            }
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await tryParseError(response);
          throw new Error(
            errorData?.error || 
            `HTTP error! status: ${response.status}`
          );
        }

        const data: ApiResponse = await response.json();
        
        if (data.status !== 'success' || !data.chords) {
          throw new Error(data.error || 'Invalid response format');
        }

        // Transform and validate the response
        return data.chords.map((chord, index) => {
          if (!chord.time || !chord.chord || chord.confidence === undefined) {
            throw new Error(`Invalid chord data at index ${index}`);
          }
          
          return {
            time: Number(chord.time),
            chord: String(chord.chord),
            confidence: Math.min(1, Math.max(0, Number(chord.confidence))),
            duration: chord.duration ? Number(chord.duration) : undefined,
            beat: chord.beat ? Number(chord.beat) : undefined,
          };
        });

      } catch (error) {
        lastError = toError(error);
        
        // Don't retry on abort or validation errors
        // Check for DOMException only on web platform
        const isDOMError = typeof DOMException !== 'undefined' && error instanceof DOMException;
        if (isDOMError || lastError.message.includes('Invalid')) {
          break;
        }
        
        // Wait before retrying (exponential backoff)
        if (attempt < API_CONFIG.retries) {
          await new Promise(resolve => 
            setTimeout(resolve, 1000 * (attempt + 1))
          );
        }
      }
    }

    throw lastError || new Error('Chord analysis failed');

  } catch (error) {
    const normalizedError = toError(error);
    console.error('Chord analysis failed:', {
      error: normalizedError.message,
      stack: normalizedError.stack,
      youtubeUrl,
      timestamp: new Date().toISOString(),
    });

    // Provide fallback data for demo purposes
    if (process.env.NODE_ENV === 'development') {
      console.warn('Using demo chord data');
      return generateDemoChords();
    }

    throw enhanceError(normalizedError);
  } finally {
    clearTimeout(timeoutId);
  }
};

// Helper to parse error responses
async function tryParseError(response: Response): Promise<{ error?: string }> {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

// Enhance error with additional context
function enhanceError(error: Error): Error {
  if (error.message.includes('Failed to fetch')) {
    return new Error('Connection failed. Please check your network.');
  }
  if (error.message.includes('aborted')) {
    return new Error('Request timed out. Please try again.');
  }
  return error;
}

// Demo data for development
function generateDemoChords(): ChordData[] {
  const chords = ['C', 'G', 'Am', 'F', 'Dm', 'Em', 'Bdim'];
  return Array.from({ length: 8 }, (_, i) => ({
    time: i * 2,
    chord: chords[i % chords.length],
    confidence: 0.8 + Math.random() * 0.2,
    duration: 2,
    beat: (i % 4) + 1,
  }));
}

/**
 * Chord processing utilities
 */

// Group chords by time window
export function groupChords(chords: ChordData[], windowSize = 0.5): ChordData[] {
  if (!chords.length) return [];

  const sortedChords = [...chords].sort((a, b) => a.time - b.time);
  const grouped: ChordData[] = [];
  let currentWindow: ChordData[] = [];
  let windowStart = sortedChords[0].time;

  sortedChords.forEach(chord => {
    if (chord.time >= windowStart + windowSize) {
      if (currentWindow.length > 0) {
        grouped.push(createWindowChord(currentWindow));
      }
      currentWindow = [];
      windowStart = chord.time;
    }
    currentWindow.push(chord);
  });

  // Add remaining chords in the last window
  if (currentWindow.length > 0) {
    grouped.push(createWindowChord(currentWindow));
  }

  return grouped;
}

function createWindowChord(chords: ChordData[]): ChordData {
  const averageTime = chords.reduce((sum, c) => sum + c.time, 0) / chords.length;
  const mostConfidentChord = chords.reduce((prev, current) => 
    (prev.confidence > current.confidence) ? prev : current
  );
  
  return {
    ...mostConfidentChord,
    time: averageTime
  };
}

// Filter chords by confidence threshold
export function filterByConfidence(
  chords: ChordData[], 
  minConfidence = 0.7
): ChordData[] {
  return chords.filter(c => c.confidence >= minConfidence);
}

// Find the current chord at a specific playback time
export function getCurrentChord(
  chords: ChordData[], 
  currentTime: number
): ChordData | undefined {
  return chords.find((chord, i) => 
    currentTime >= chord.time && 
    (i === chords.length - 1 || currentTime < chords[i + 1].time)
  );
}