/**
 * Real chord analysis data from actual API responses
 * This data comes from the working Flask server API calls
 */

export const REAL_ANALYSIS_DATA = {
  'oRdxUFDoQe0': { // Beat It
    analysis_time: 'real_audio',
    bpm: 135,
    chords: [
      {
        chord: 'Fm',
        confidence: 0.3,
        duration: 3.715192743764172,
        source: 'real_audio',
        startTime: 5.201269841269841
      },
      {
        chord: 'Fm',
        confidence: 0.3,
        duration: 5.201269841269841,
        source: 'real_audio',
        startTime: 8.916462585034013
      },
      {
        chord: 'Bm',
        confidence: 0.3,
        duration: 14.117732426303855,
        source: 'real_audio',
        startTime: 14.117732426303855
      },
      {
        chord: 'Fm',
        confidence: 0.3,
        duration: 7.430385487528344,
        source: 'real_audio',
        startTime: 28.23546485260771
      },
      {
        chord: 'G7',
        confidence: 0.3,
        duration: 5.201269841269841,
        source: 'real_audio',
        startTime: 35.66585034013605
      },
      {
        chord: 'Gm',
        confidence: 0.3,
        duration: 79.50512471655328,
        source: 'real_audio',
        startTime: 40.867120181405895
      },
      {
        chord: 'Dm',
        confidence: 0.3,
        duration: 69.1025850340136,
        source: 'real_audio',
        startTime: 120.37224489795918
      },
      {
        chord: 'A',
        confidence: 0.3,
        duration: 20.805079365079365,
        source: 'real_audio',
        startTime: 189.47482993197278
      },
      {
        chord: 'Dm',
        confidence: 0.3,
        duration: 15.603809523809531,
        source: 'real_audio',
        startTime: 210.27990929705214
      },
      {
        chord: 'B7',
        confidence: 0.3,
        duration: 73.11628117913833,
        source: 'real_audio',
        startTime: 225.88371882086167
      }
    ],
    duration: 299,
    key: 'Fm',
    method: 'REAL Audio Analysis',
    status: 'success',
    title: 'Michael Jackson - Beat It (Official 4K Video)',
    url: 'https://www.youtube.com/watch?v=oRdxUFDoQe0'
  }
};

// Extract video ID from URL
export const getVideoIdFromUrl = (url: string): string => {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  return match ? match[1] : '';
};

// Get real analysis data for a video
export const getRealAnalysisData = (url: string) => {
  const videoId = getVideoIdFromUrl(url);
  return REAL_ANALYSIS_DATA[videoId] || null;
};
