import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import {
    ScrollView, StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Type assertion for React Native components to fix JSX errors
const TypedSafeAreaView = SafeAreaView as React.ComponentType<any>;
const TypedScrollView = ScrollView as React.ComponentType<any>;
const TypedView = View as React.ComponentType<any>;
const TypedText = Text as React.ComponentType<any>;
const TypedTouchableOpacity = TouchableOpacity as React.ComponentType<any>;

import { useAuth } from '../context/AuthProvider';
import { RootStackParamList } from '../navigation/types';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user, logout, isConnected, isLoading } = useAuth();

  console.log('🚨🚨🚨 HOME SCREEN IS LOADING!!! 🚨🚨🚨');
  console.log('🏠 HomeScreen render - user:', user?.email, 'isConnected:', isConnected, 'isLoading:', isLoading);

  const handleAuthAction = () => {
    if (user) {
      logout();
    } else {
      navigation.navigate('Auth');
    }
  };

  const handleSearchPress = () => {
    navigation.navigate('Search');
  };



  return (
    <TypedSafeAreaView style={styles.safeArea}>
      <TypedScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* User Welcome Section */}
        <TypedView style={styles.header}>
          <TypedText style={styles.welcomeText}>
            🚨 DEBUG MODE ACTIVE 🚨
          </TypedText>
          <TypedText style={styles.welcomeText}>
            {user ? `Welcome back, ${user?.email?.split('@')[0]}!` : 'Welcome!'}
          </TypedText>
        </TypedView>

        <TypedView style={styles.quickActions}>
          <TypedTouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Search')}
          >
            <TypedText style={styles.actionIcon}>🔍</TypedText>
            <TypedText style={styles.actionText}>Search Songs</TypedText>
          </TypedTouchableOpacity>

          <TypedTouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Library')}
          >
            <TypedText style={styles.actionIcon}>📚</TypedText>
            <TypedText style={styles.actionText}>My Library</TypedText>
          </TypedTouchableOpacity>

          <TypedTouchableOpacity
            style={styles.actionButton}
            onPress={handleAuthAction}
          >
            <TypedText style={styles.actionIcon}>{user ? '🚪' : '🔐'}</TypedText>
            <TypedText style={styles.actionText}>{user ? 'Logout' : 'Login / Sign Up'}</TypedText>
          </TypedTouchableOpacity>
        </TypedView>

        <TypedView style={styles.section}>
          <TypedText style={styles.sectionTitle}>How It Works</TypedText>
          <TypedView style={styles.howItWorks}>
            <TypedView style={styles.step}>
              <TypedText style={styles.stepNumber}>1</TypedText>
              <TypedText style={styles.stepText}>Search for any song</TypedText>
            </TypedView>
            <TypedView style={styles.step}>
              <TypedText style={styles.stepNumber}>2</TypedText>
              <TypedText style={styles.stepText}>Get instant chord analysis</TypedText>
            </TypedView>
            <TypedView style={styles.step}>
              <TypedText style={styles.stepNumber}>3</TypedText>
              <TypedText style={styles.stepText}>Play along with chords</TypedText>
            </TypedView>
          </TypedView>
        </TypedView>
      </TypedScrollView>
    </TypedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  contentContainer: {
    paddingBottom: 20,
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 15,
  },
  actionButton: {
    flex: 1,
    minWidth: 100,
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 15,
  },
  featuredItem: {
    width: 160,
    marginRight: 15,
  },
  featuredImage: {
    width: 160,
    height: 120,
    borderRadius: 10,
    marginBottom: 8,
  },
  featuredTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  debugButton: {
    backgroundColor: '#ff6b35',
  },
  howItWorks: {
    gap: 15,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepNumber: {
    width: 30,
    height: 30,
    backgroundColor: '#007AFF',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 30,
    borderRadius: 15,
    fontWeight: 'bold',
    marginRight: 15,
  },
  stepText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 15,
    flex: 1,
  },
  statusContainer: {
    padding: 10,
    margin: 15,
    borderRadius: 5,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});