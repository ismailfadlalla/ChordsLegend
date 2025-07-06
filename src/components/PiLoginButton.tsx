import React from 'react';
import {
  ActivityIndicator, GestureResponderEvent, StyleSheet, Text, TouchableOpacity, View, ViewStyle
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface PiLoginButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  style?: ViewStyle;
  disabled?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
}

const PiLoginButton: React.FC<PiLoginButtonProps> = ({ 
  onPress, 
  style, 
  disabled = false,
  loading = false,
  children 
}) => {
  const { theme } = useTheme();
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.button, 
        { 
          backgroundColor: theme.primary || '#14F195',
          shadowColor: '#000',
        },
        style, 
        isDisabled && [
          styles.disabled, 
          { backgroundColor: '#9E9E9E' }
        ]
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      accessibilityHint="Login using your Pi Network account"
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={theme.onPrimary || '#000'} 
        />
      ) : (
        <View style={styles.content}>
          <Text style={[styles.icon, { color: theme.onPrimary || '#000' }]}>
            π
          </Text>
          <Text style={[
            styles.text,
            { color: theme.onPrimary || '#000' }
          ]}>
            {children || 'Login with Pi'}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 220,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  icon: {
    marginRight: 12,
  },
  disabled: {
    opacity: 0.7,
    shadowOpacity: 0.1,
  },
});

export default PiLoginButton;