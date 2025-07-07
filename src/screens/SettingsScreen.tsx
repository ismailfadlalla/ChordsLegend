import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';
import React, { useState } from 'react';
import {
    Alert, Linking, Platform, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View
} from 'react-native';
import { useAuth } from '../context/AuthProvider';

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(true); // Default to dark mode
  const [notifications, setNotifications] = useState(true);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  const clearCache = async () => {
    Alert.alert(
      'Clear Cache',
      'This will remove all cached data including favorites. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert('Success', 'Cache cleared successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear cache');
            }
          },
        },
      ]
    );
  };

  const SettingItem = ({ 
    title, 
    subtitle, 
    onPress, 
    showSwitch = false, 
    switchValue = false, 
    onSwitchChange 
  }: {
    title: string;
    subtitle?: string;
    onPress?: () => void;
    showSwitch?: boolean;
    switchValue?: boolean;
    onSwitchChange?: (value: boolean) => void;
  }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={showSwitch}
    >
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {showSwitch && (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: '#333', true: '#007AFF' }}
          thumbColor="#fff"
        />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>
          Signed in as {user?.email}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <SettingItem
          title="Dark Mode"
          subtitle="Use dark theme throughout the app"
          showSwitch
          switchValue={darkMode}
          onSwitchChange={setDarkMode}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <SettingItem
          title="Push Notifications"
          subtitle="Get notified about new features and updates"
          showSwitch
          switchValue={notifications}
          onSwitchChange={setNotifications}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data & Storage</Text>
        <SettingItem
          title="Clear Cache"
          subtitle="Remove cached data and favorites"
          onPress={clearCache}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Legal & Privacy</Text>
        <SettingItem
          title="Terms of Service"
          subtitle="Read our terms and conditions"
          onPress={() => {
            // Base URL for legal documents
            const baseUrl = __DEV__ 
              ? 'http://localhost:5000/legal/' // Local development
              : 'https://chordslegend-v2-production.up.railway.app/legal/'; // Production
            
            const termsUrl = `${baseUrl}terms-of-service.html`;
            
            // Open the terms in the browser or WebView
            if (Platform.OS === 'web') {
              window.open(termsUrl, '_blank');
            } else {
              WebBrowser.openBrowserAsync(termsUrl)
                .catch(err => {
                  // Fallback to external browser if WebBrowser fails
                  Linking.openURL(termsUrl).catch(() => {
                    Alert.alert('Error', 'Could not open the Terms of Service. Please visit our website directly.');
                  });
                });
            }
          }}
        />
        <SettingItem
          title="Privacy Policy"
          subtitle="How we protect your data"
          onPress={() => {
            // Base URL for legal documents
            const baseUrl = __DEV__ 
              ? 'http://localhost:5000/legal/' // Local development
              : 'https://chordslegend-v2-production.up.railway.app/legal/'; // Production
            
            const policyUrl = `${baseUrl}privacy-policy.html`;
            
            // Open the policy in the browser or WebView
            if (Platform.OS === 'web') {
              window.open(policyUrl, '_blank');
            } else {
              WebBrowser.openBrowserAsync(policyUrl)
                .catch(err => {
                  // Fallback to external browser if WebBrowser fails
                  Linking.openURL(policyUrl).catch(() => {
                    Alert.alert('Error', 'Could not open the Privacy Policy. Please visit our website directly.');
                  });
                });
            }
          }}
        />
        <SettingItem
          title="App Version"
          subtitle="2.0.0 - Pi Network Ready"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pi Network Integration</Text>
        <SettingItem
          title="Connect Pi Wallet"
          subtitle="Coming soon - Connect your Pi Network account"
          onPress={() => Alert.alert('Coming Soon', 'Pi Network integration will be available when Pi Network launches their mainnet')}
        />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
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
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#888',
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    marginHorizontal: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#2a2a2a',
    marginHorizontal: 20,
    marginBottom: 2,
    borderRadius: 8,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#888',
  },
  logoutButton: {
    margin: 20,
    padding: 15,
    backgroundColor: '#333',
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 40,
  },
  logoutText: {
    color: '#ff4444',
    fontSize: 16,
    fontWeight: 'bold',
  },
});