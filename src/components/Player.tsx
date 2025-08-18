import React, { useEffect, useRef } from "react";
import { Animated, Easing, Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../context/ThemeContext";
import type { ChordData } from "../types/models";

interface PlayerProps {
  currentChord: ChordData;
  showTime?: boolean;
  showConfidence?: boolean;
  size?: "small" | "medium" | "large";
  onChordPress?: () => void;
}

export default function Player({ 
  currentChord, 
  showTime = true, 
  showConfidence = true,
  size = "large",
  onChordPress
}: PlayerProps) {
  const { theme } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // Animation when chord changes
  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    });
  }, [currentChord.chord, scaleAnim, opacityAnim]);

  // Size configuration
  const sizeStyles = {
    small: {
      chordSize: 36,
      padding: 12,
      timeSize: 12,
    },
    medium: {
      chordSize: 48,
      padding: 16,
      timeSize: 14,
    },
    large: {
      chordSize: 72,
      padding: 20,
      timeSize: 16,
    },
  };

  const getConfidenceColor = (confidence: number): string => {
    if (confidence > 0.8) {
      return (theme as any).success || "#4CAF50";
    }
    if (confidence > 0.6) {
      return (theme as any).warning || "#FF9800";
    }
    return (theme as any).error || "#F44336";
  };

  return (
    <Animated.View 
      style={[
        styles.container,
        { 
          backgroundColor: theme.primary || "#6A0DAD",
          shadowColor: (theme as any).shadow || "#000",
          padding: sizeStyles[size].padding,
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }],
        }
      ]}
    >
      <Pressable 
        onPress={onChordPress}
        disabled={!onChordPress}
        style={styles.pressable}
      >
        <Animated.Text 
          style={[
            styles.chord, 
            { 
              fontSize: sizeStyles[size].chordSize,
              color: theme.onPrimary || "white",
            }
          ]}
          accessibilityRole="text"
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {currentChord.chord}
        </Animated.Text>
        
        {showTime && (
          <View style={styles.metaContainer}>
            <Text 
              style={[
                styles.time, 
                { 
                  fontSize: sizeStyles[size].timeSize,
                  color: theme.secondary || "#FFD700",
                }
              ]}
            >
              {currentChord.time.toFixed(1)}s
            </Text>
            
            {showConfidence && currentChord.confidence && (
              <Text 
                style={[
                  styles.confidence,
                  { 
                    color: getConfidenceColor(currentChord.confidence),
                    fontSize: sizeStyles[size].timeSize - 2,
                  }
                ]}
              >
                {Math.round(currentChord.confidence * 100)}%
              </Text>
            )}
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    margin: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 120,
    minHeight: 120,
    justifyContent: "center",
  },
  pressable: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  chord: { 
    textAlign: "center",
    fontWeight: "bold",
    includeFontPadding: false,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  metaContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    gap: 8,
  },
  time: {
    textAlign: "center",
  },
  confidence: {
    fontWeight: "600",
  },
});