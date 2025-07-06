const API_BASE = 'http://localhost:5000'; // Or your server IP

interface ChordResponse {
  chords: string[];
  progression: string;
  bpm: number;
}

interface StatusResponse {
  message: string;
  status: string;
  endpoints: {
    test_chords: string;
  };
}

export const testChordsAPI = async (): Promise<ChordResponse> => {
  try {
    const response = await fetch(`${API_BASE}/api/test-chords`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch chords:', error);
    throw error;
  }
};

export const checkServerStatus = async (): Promise<StatusResponse> => {
  const response = await fetch(API_BASE);
  
  if (!response.ok) {
    throw new Error('Server not responding');
  }

  return await response.json();
};

// Enhanced fetch with timeout
export const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = 8000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} - ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};