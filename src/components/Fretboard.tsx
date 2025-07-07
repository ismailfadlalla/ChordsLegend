import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';

// Get screen dimensions for responsive sizing
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export interface ChordFingering {
  frets: number[]; // Fret numbers for each string (0 = open, -1 = muted)
  fingers?: number[]; // Finger numbers (1-4, 0 = open, -1 = muted)
  barres?: { fret: number; startString: number; endString: number }[]; // Barre chords
  baseFret?: number; // Starting fret for display
  name: string;
  type: 'open' | 'barre' | 'movable';
}

interface FretboardProps {
  chord: string;
  fingering: ChordFingering;
  onFingeringChange?: (fingering: ChordFingering) => void;
  theme: any;
  size?: 'small' | 'medium' | 'large';
  isHighlighted?: boolean;
  animationDelay?: number;
}

// Enhanced sizing system for better mobile experience
const getSizeDimensions = (size: 'small' | 'medium' | 'large') => {
  const baseWidth = Math.min(screenWidth * 0.85, 300); // Responsive to screen width
  
  switch (size) {
    case 'small':
      return {
        width: baseWidth * 0.6,
        height: (baseWidth * 0.6) * 1.2,
        stringSpacing: (baseWidth * 0.6) / 6,
        fretSpacing: ((baseWidth * 0.6) * 1.2) / 5,
        dotSize: 12,
        fontSize: 10
      };
    case 'medium':
      return {
        width: baseWidth * 0.75,
        height: (baseWidth * 0.75) * 1.2,
        stringSpacing: (baseWidth * 0.75) / 6,
        fretSpacing: ((baseWidth * 0.75) * 1.2) / 5,
        dotSize: 16,
        fontSize: 12
      };
    case 'large':
      return {
        width: baseWidth,
        height: baseWidth * 1.2,
        stringSpacing: baseWidth / 6,
        fretSpacing: (baseWidth * 1.2) / 5,
        dotSize: 20,
        fontSize: 14
      };
  }
};

export const Fretboard: React.FC<FretboardProps> = ({ 
  chord, 
  fingering, 
  onFingeringChange, 
  theme, 
  size = 'medium',
  isHighlighted = false,
  animationDelay = 0
}) => {
  const strings = ['E', 'A', 'D', 'G', 'B', 'E']; // From 6th to 1st string
  const maxFrets = 4; // Standard chord diagrams show 4 frets
  const baseFret = fingering.baseFret || 1;
  const dimensions = getSizeDimensions(size);
  
  // Animation for highlighting
  const highlightAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Trigger highlight animation when isHighlighted changes
  useEffect(() => {
    if (isHighlighted) {
      // Delay animation if specified
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(highlightAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.1,
              duration: 150,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 150,
              useNativeDriver: true,
            }),
          ]),
        ]).start();
      }, animationDelay);
    } else {
      Animated.timing(highlightAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }, [isHighlighted, animationDelay, highlightAnim, pulseAnim]);

  const renderEnhancedFretboard = () => {
    return (
      <Animated.View style={[
        styles.fretboardContainer, 
        { 
          width: dimensions.width, 
          height: dimensions.height,
          backgroundColor: theme.surface + '20',
          borderRadius: 12,
          padding: 12,
          elevation: isHighlighted ? 4 : 2,
          shadowColor: theme.primary,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isHighlighted ? 0.3 : 0.1,
          shadowRadius: isHighlighted ? 8 : 4,
          transform: [{
            scale: pulseAnim.interpolate({
              inputRange: [0.95, 1.05],
              outputRange: [0.95, 1.05],
              extrapolate: 'clamp',
            })
          }],
          borderWidth: highlightAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 3],
            extrapolate: 'clamp',
          }),
          borderColor: theme.primary + '80',
        }
      ]}>
        {/* Background gradient for fretboard */}
        <View style={[
          styles.fretboardBackground,
          {
            width: dimensions.width - 24,
            height: dimensions.height - 24,
            backgroundColor: '#F5DEB3', // Light wood color
            borderRadius: 8,
            position: 'absolute',
            top: 12,
            left: 12,
          }
        ]} />
        
        {/* Nut (thick line at the beginning for open chords) */}
        <View
          style={[
            styles.nut,
            {
              backgroundColor: baseFret === 1 ? '#8B4513' : 'transparent',
              height: (strings.length - 1) * dimensions.stringSpacing + 10,
              width: baseFret === 1 ? 6 : 0,
              left: 20,
              top: 40,
              borderRadius: 3,
            }
          ]}
        />
        
        {/* Frets with improved styling */}
        {Array.from({ length: maxFrets + 1 }, (_, fretIndex) => (
          <View
            key={`fret-${fretIndex}`}
            style={[
              styles.fretLine,
              {
                height: (strings.length - 1) * dimensions.stringSpacing + 10,
                width: fretIndex === 0 ? (baseFret === 1 ? 0 : 3) : 2,
                backgroundColor: fretIndex === 0 && baseFret > 1 
                  ? theme.text 
                  : '#C0C0C0', // Silver fret wire
                left: 25 + (fretIndex * dimensions.fretSpacing),
                top: 40,
                borderRadius: 1,
                elevation: 1,
              }
            ]}
          />
        ))}
        
        {/* Strings with realistic thickness variation */}
        {strings.map((stringName, stringIndex) => {
          const stringThickness = stringIndex < 2 ? 3 : stringIndex < 4 ? 2 : 1.5;
          return (
            <View
              key={`string-${stringIndex}`}
              style={[
                styles.stringLine,
                {
                  width: maxFrets * dimensions.fretSpacing + 10,
                  height: stringThickness,
                  backgroundColor: '#666',
                  left: 20,
                  top: 40 + (stringIndex * dimensions.stringSpacing),
                  borderRadius: stringThickness / 2,
                }
              ]}
            />
          );
        })}
        
        {/* String labels with better positioning */}
        {strings.map((stringName, stringIndex) => (
          <Text
            key={`label-${stringIndex}`}
            style={[
              styles.stringLabel,
              {
                color: theme.text,
                fontSize: dimensions.fontSize,
                fontWeight: 'bold',
                left: 4,
                top: 35 + (stringIndex * dimensions.stringSpacing),
                textAlign: 'center',
              }
            ]}
          >
            {stringName}
          </Text>
        ))}
        
        {/* Fret numbers (only show if not starting from 1st fret) */}
        {baseFret > 1 && (
          <Text
            style={[
              styles.baseFretNumber,
              {
                color: theme.text,
                fontSize: dimensions.fontSize + 2,
                fontWeight: 'bold',
                left: 30 + (dimensions.fretSpacing / 2),
                top: 15,
                textAlign: 'center',
              }
            ]}
          >
            {baseFret}fr
          </Text>
        )}
        
        {/* Open string indicators */}
        {fingering.frets.map((fret, stringIndex) => {
          if (fret !== 0) return null; // Only show for open strings
          
          return (
            <View
              key={`open-${stringIndex}`}
              style={[
                styles.openStringIndicator,
                {
                  width: dimensions.dotSize * 0.8,
                  height: dimensions.dotSize * 0.8,
                  borderRadius: (dimensions.dotSize * 0.8) / 2,
                  borderWidth: 2,
                  borderColor: theme.primary || '#007AFF',
                  backgroundColor: 'transparent',
                  left: 25 - (dimensions.dotSize * 0.4),
                  top: 40 + (stringIndex * dimensions.stringSpacing) - (dimensions.dotSize * 0.4),
                }
              ]}
            />
          );
        })}
        
        {/* Muted string indicators */}
        {fingering.frets.map((fret, stringIndex) => {
          if (fret !== -1) return null; // Only show for muted strings
          
          return (
            <Text
              key={`muted-${stringIndex}`}
              style={[
                styles.mutedIndicator,
                {
                  fontSize: dimensions.fontSize + 2,
                  color: theme.error || '#FF3B30',
                  fontWeight: 'bold',
                  left: 25 - (dimensions.fontSize / 2),
                  top: 32 + (stringIndex * dimensions.stringSpacing),
                  textAlign: 'center',
                }
              ]}
            >
              ✕
            </Text>
          );
        })}
        
        {/* Enhanced finger positions with shadows and better styling */}
        {fingering.frets.map((fret, stringIndex) => {
          if (fret <= 0) return null; // Skip open or muted strings
          
          const fretPosition = fret - baseFret + 1;
          if (fretPosition < 1 || fretPosition > maxFrets) return null;
          
          const x = 25 + (fretPosition * dimensions.fretSpacing) - (dimensions.fretSpacing / 2);
          const y = 40 + (stringIndex * dimensions.stringSpacing) - (dimensions.dotSize / 2);
          const fingerNumber = fingering.fingers?.[stringIndex] || '';
          
          return (
            <Animated.View
              key={`finger-${stringIndex}`}
              style={[
                styles.fingerDot,
                {
                  width: dimensions.dotSize,
                  height: dimensions.dotSize,
                  borderRadius: dimensions.dotSize / 2,
                  backgroundColor: theme.primary || '#007AFF',
                  left: x,
                  top: y,
                  borderWidth: 2,
                  borderColor: '#fff',
                  elevation: 3,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 3,
                }
              ]}
            >
              {fingerNumber > 0 && (
                <Text
                  style={[
                    styles.fingerNumber,
                    {
                      fontSize: dimensions.fontSize - 2,
                      color: '#fff',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      lineHeight: dimensions.dotSize,
                    }
                  ]}
                >
                  {fingerNumber}
                </Text>
              )}
            </Animated.View>
          );
        })}
        
        {/* Barre chords with enhanced visual */}
        {fingering.barres?.map((barre, index) => {
          const fretPosition = barre.fret - baseFret + 1;
          if (fretPosition < 1 || fretPosition > maxFrets) return null;
          
          const startString = barre.startString || 0;
          const endString = barre.endString || 5;
          const x = 25 + (fretPosition * dimensions.fretSpacing) - (dimensions.fretSpacing / 2);
          const startY = 40 + (startString * dimensions.stringSpacing) - (dimensions.dotSize / 2);
          const height = (endString - startString) * dimensions.stringSpacing;
          
          return (
            <View
              key={`barre-${index}`}
              style={[
                styles.barreFinger,
                {
                  width: dimensions.dotSize,
                  height: height,
                  borderRadius: dimensions.dotSize / 2,
                  backgroundColor: theme.primary || '#007AFF',
                  left: x,
                  top: startY,
                  borderWidth: 2,
                  borderColor: '#fff',
                  elevation: 3,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 3,
                }
              ]}
            />
          );
        })}
        
        {/* Chord name with improved styling */}
        <Text
          style={[
            styles.chordName,
            {
              color: theme.primary || '#007AFF',
              fontSize: dimensions.fontSize + 6,
              fontWeight: 'bold',
              textAlign: 'center',
              position: 'absolute',
              bottom: 10,
              width: '100%',
              textShadowColor: 'rgba(0,0,0,0.2)',
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 2,
            }
          ]}
        >
          {chord}
        </Text>
      </Animated.View>
    );
  };

  return renderEnhancedFretboard();
};

// Styles with better organization
const styles = StyleSheet.create({
  fretboardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  fretboardBackground: {
    position: 'absolute',
  },
  nut: {
    position: 'absolute',
  },
  fretLine: {
    position: 'absolute',
  },
  stringLine: {
    position: 'absolute',
  },
  stringLabel: {
    position: 'absolute',
    width: 16,
  },
  baseFretNumber: {
    position: 'absolute',
  },
  openStringIndicator: {
    position: 'absolute',
  },
  mutedIndicator: {
    position: 'absolute',
    width: 16,
  },
  fingerDot: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fingerNumber: {
    alignSelf: 'center',
  },
  barreFinger: {
    position: 'absolute',
  },
  chordName: {
    position: 'absolute',
  }
});
