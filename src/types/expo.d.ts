import { Constants } from 'expo-constants';

declare module 'expo-constants' {
  interface ExpoConstants {
    expoConfig?: {
      extra?: {
        youtubeEmbedApiKey: string;
        youtubeApiUrl: string;
        firebaseApiKey?: string;
        sentryDsn?: string;
      };
    };
  }
}