import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import {
  ScrollView, StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import { useAuth } from '../context/AuthProvider';
import { RootStackParamList } from '../navigation/types';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user, logout, isConnected, isLoading } = useAuth();

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
    <ScrollView style={styles.container}>
      {/* User Welcome Section */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          {user ? `Welcome back, ${user?.email?.split('@')[0]}!` : 'Welcome to ChordsLegend!'}
        </Text>
        <Text style={styles.subtitle}>
          Discover chords for your favorite songs
        </Text>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Search')}
        >
          <Text style={styles.actionIcon}>🔍</Text>
          <Text style={styles.actionText}>Search Songs</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Library')}
        >
          <Text style={styles.actionIcon}>📚</Text>
          <Text style={styles.actionText}>My Library</Text>
        </TouchableOpacity>



        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleAuthAction}
        >
          <Text style={styles.actionIcon}>{user ? '🚪' : '🔐'}</Text>
          <Text style={styles.actionText}>{user ? 'Logout' : 'Login / Sign Up'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How It Works</Text>
        <View style={styles.howItWorks}>
          <View style={styles.step}>
            <Text style={styles.stepNumber}>1</Text>
            <Text style={styles.stepText}>Search for any song</Text>
          </View>
          <View style={styles.step}>
            <Text style={styles.stepNumber}>2</Text>
            <Text style={styles.stepText}>Get instant chord analysis</Text>
          </View>
          <View style={styles.step}>
            <Text style={styles.stepNumber}>3</Text>
            <Text style={styles.stepText}>Play along with chords</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    padding: 20,
    paddingTop: 40,
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
    padding: 20,
    gap: 15,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#333',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 30,
    marginBottom: 10,
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
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