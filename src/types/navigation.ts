import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Define ChordData directly here since we're having module resolution issues
type ChordData = {
  time: number;
  chord: string;
  confidence: number;
  duration?: number;
  beat?: number;
};

export type RootStackParamList = {
  Auth: undefined;
  Home: undefined;
  Player: { 
    youtubeUrl: string;
    songTitle?: string;
    channel?: string;
    thumbnail?: string;
    duration?: string;
    chords?: ChordData[];
    initialLoading?: boolean;
  };
  Search: undefined;
  Library: undefined;
  Settings: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = 
  NativeStackScreenProps<RootStackParamList, T>;