// src/types/models.ts
export type ChordData = {
  time: number;
  chord: string;
  confidence: number;
  duration?: number;
  beat?: number;
};

export type YouTubeVideo = {
  id: { videoId: string };
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails: {
      default: { url: string };
      high?: { url: string };
    };
  };
  duration?: string;
};