# ChordsLegend - Music App Setup Guide

## Overview

ChordsLegend is a React Native/Expo app similar to Chordify that allows users to:

- Sign up and login with email/password
- Search for songs using YouTube API
- View chord progressions for songs
- Save favorites
- Play along with chord displays
- Future: Pi Network integration for premium features

## Current Features Implemented

### ✅ Authentication

- Email/password signup and login
- Firebase authentication
- User session management
- Logout functionality

### ✅ Navigation

- Bottom tab navigation (Home, Search, Library, Settings)
- Stack navigation for player screens
- Proper TypeScript navigation types

### ✅ Search Functionality

- YouTube API integration for song search
- Beautiful search results with thumbnails
- Navigation to chord player

### ✅ User Interface

- Dark theme design
- Modern UI components
- Responsive layouts
- Loading states and error handling

### ✅ Settings & Preferences

- User settings management
- Cache clearing
- Dark mode toggle
- Future Pi Network integration placeholder

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the root directory with:

```env
# Firebase Configuration
FIREBASE_API_KEY=your_firebase_api_key_here
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id

# YouTube API
YOUTUBE_API_KEY=your_youtube_api_key_here

# Pi Network (for future use)
PI_API_KEY=your_pi_api_key_here
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable Authentication with Email/Password
4. Copy the config values to your `.env` file

### 3. YouTube API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable YouTube Data API v3
4. Create credentials (API Key)
5. Add the API key to your `.env` file

### 4. Install Dependencies

```bash
npm install
```

### 5. Run the App

```bash
# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

## Next Steps for Full Implementation

### 🔄 Chord Analysis (In Progress)

- Real-time audio analysis
- Chord detection algorithms
- Sync with playback
- Mock data currently implemented

### 🔄 Audio Player

- YouTube video playback
- Audio-only mode
- Playback controls
- Progress tracking

### 🔄 Favorites System

- AsyncStorage implementation
- Add/remove favorites
- Sync across devices (future)

### 🔄 Premium Features (Future)

- Pi Network SDK integration
- Premium chord features
- Offline access
- Advanced chord diagrams

## Architecture

### File Structure

```
src/
├── api/          # API calls (YouTube, etc.)
├── components/   # Reusable components
├── context/      # React context providers
├── navigation/   # Navigation configuration
├── screens/      # Main app screens
├── services/     # Business logic
├── types/        # TypeScript definitions
└── utils/        # Helper functions
```

### Key Components

- **AuthProvider**: Manages user authentication state
- **RootStack**: Main navigation component
- **SearchScreen**: YouTube search functionality
- **ChordPlayerScreen**: Main chord display and playback
- **LibraryScreen**: Favorites management
- **SettingsScreen**: User preferences

## Technologies Used

- React Native with Expo
- TypeScript
- React Navigation
- Firebase Authentication
- YouTube Data API
- AsyncStorage for local data
- Modern UI components

## Future Enhancements

1. **Real Chord Analysis**: Implement actual audio analysis
2. **Pi Network Integration**: Add Pi SDK when mainnet launches
3. **Social Features**: Share songs, playlists
4. **Advanced Player**: More audio controls, speed adjustment
5. **Offline Mode**: Download songs for offline use
6. **Guitar Tabs**: Addition to chord displays
7. **Multiple Instruments**: Piano, ukulele support

The app is now ready for testing and further development!
