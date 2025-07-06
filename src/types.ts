import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// ======================
// Core Data Types
// ======================

export type Chord = {
  time: number;       // in seconds
  chord: string;      // chord name (e.g., "C", "G7")
  confidence: number; // 0-1 value
  bar?: number;       // optional bar number
  beat?: number;      // optional beat in bar
};

export type SongAnalysis = {
  success: boolean;
  chords: Chord[];
  bpm?: number;
  key?: string;
  error?: string;
  metadata: {
    duration: number;
    processedIn: number;
    videoId?: string;
    audioQuality?: number;
  };
};

export type YouTubeVideo = {
  id: { videoId: string };
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails: {
      default: { url: string };
      medium?: { url: string };
      high?: { url: string };
    };
    publishedAt: string;
  };
  duration?: string; // ISO 8601 duration format
};

export type Song = {
  youtubeUrl: string;
  title: string;
  artist?: string;
  chords: Chord[];
  bpm?: number;
  key?: string;
  thumbnailUrl?: string;
  duration?: number; // in seconds
  lastAnalyzed?: Date;
  isFavorite?: boolean;
};

// ======================
// Navigation Types
// ======================

export type RootStackParamList = {
  Auth: undefined;
  Home: undefined;
  Player: {
    youtubeUrl: string;
    songData?: Omit<Song, 'youtubeUrl'>;
    initialLoading?: boolean;
    onGoBack?: (updatedSong: Song) => void;
  };
  Search: undefined;
  Library: undefined;
  Settings: undefined;
};

// ======================
// Screen Props
// ======================

type ScreenProps<T extends keyof RootStackParamList> = {
  route: RouteProp<RootStackParamList, T>;
  navigation: NativeStackNavigationProp<RootStackParamList, T>;
};

export type PlayerScreenProps = ScreenProps<'Player'>;
export type HomeScreenProps = ScreenProps<'Home'>;
export type AuthScreenProps = ScreenProps<'Auth'>;
export type SearchScreenProps = ScreenProps<'Search'>;
export type LibraryScreenProps = ScreenProps<'Library'>;
export type SettingsScreenProps = ScreenProps<'Settings'>;

// ======================
// API Response Types
// ======================

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  timestamp?: number;
};

export type ChordAnalysisResponse = ApiResponse<SongAnalysis>;
export type YouTubeSearchResponse = ApiResponse<YouTubeVideo[]>;

// ======================
// Component Props
// ======================

export type ChordChartProps = {
  chords: Chord[];
  currentTime?: number;
  onChordPress?: (chord: Chord) => void;
  showBeatNumbers?: boolean;
  showConfidence?: boolean;
};

export type PlayerControlsProps = {
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
  onSpeedChange?: (speed: number) => void;
};
export type AnalysisResult = {
  success: boolean;
  chords: Chord[];
  bpm?: number;
  key?: string;
  error?: string;
  metadata: {
    duration: number;
    processedIn: number;
    videoId?: string;  // Add this optional property
    audioQuality?: number;
    // Add any other metadata properties you need
  };
};

// ======================
// Utility Types
// ======================

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
export type Nullable<T> = T | null;