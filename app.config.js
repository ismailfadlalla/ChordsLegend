// app.config.js
require('dotenv').config(); // Load .env for this file

module.exports = {
  name: 'ChordsLegend',
  slug: 'chordslegend',
  extra: {
    eas: {
      projectId: "b3bce86d-1a9c-49a3-99f1-26f00a0ffb23"
    },
    YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
    youtubeApiKey: process.env.YOUTUBE_API_KEY, // Backwards compatibility
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY || process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN || process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET || process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID || process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID || process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
    FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID || process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
    SENTRY_DSN: process.env.SENTRY_DSN,
    SENTRY_ORG: process.env.SENTRY_ORG,
    SENTRY_PROJECT: process.env.SENTRY_PROJECT,
    API_URL: process.env.API_URL,
    USE_FIREBASE_EMULATORS: process.env.USE_FIREBASE_EMULATORS
  },
  plugins: [],
  android: {
    package: 'com.chordslegend',
    config: {
      googleSignIn: {
        apiKey: process.env.FIREBASE_API_KEY
      }
    }
  },
  ios: {
    bundleIdentifier: 'com.chordslegend',
    config: {
      googleSignIn: {
        reservedClientId: process.env.IOS_CLIENT_ID
      }
    }
  }
};