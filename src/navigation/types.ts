// src/navigation/types.ts
export type RootStackParamList = {
  Test: undefined;
  Welcome: undefined;
  Auth: { mode?: 'login' | 'signup' } | undefined;
  AuthTest: undefined;
  MainTabs: undefined;
  Home: undefined;
  Search: undefined;
  Library: undefined;
  Settings: undefined;
  Player: { videoId: string; title: string };
  ChordPlayer: { 
    youtubeUrl: string; 
    songTitle: string; 
    thumbnail: string; 
    channel: string; 
    chords?: any[] 
  };
};

export type TabParamList = {
  Home: undefined;
  Search: undefined;
  Library: undefined;
  Settings: undefined;
};

// Define PlayerScreenProps for the existing ChordPlayerScreen
export type PlayerScreenProps = {
  route: {
    params: {
      youtubeUrl: string;
      songTitle: string;
      thumbnail: string;
      channel: string;
      chords?: any[];
    };
  };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}