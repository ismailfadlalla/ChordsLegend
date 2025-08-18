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
  const baseWidth = Math.min(screenWidth * 0.85, 320); // Responsive to screen width
  
  switch (size) {
    case 'small':
      return {
        width: baseWidth * 0.6,
        height: (baseWidth * 0.6) * 1.3,
        stringSpacing: (baseWidth * 0.6) / 7,
        fretSpacing: ((baseWidth * 0.6) * 1.3) / 6,
        dotSize: 14,
        fontSize: 10
      };
    case 'medium':
      return {
        width: baseWidth * 0.75,
        height: (baseWidth * 0.75) * 1.3,
        stringSpacing: (baseWidth * 0.75) / 7,
        fretSpacing: ((baseWidth * 0.75) * 1.3) / 6,
        dotSize: 18,
        fontSize: 12
      };
    case 'large':
      return {
        width: baseWidth,
        height: baseWidth * 1.3,
        stringSpacing: baseWidth / 7,
        fretSpacing: (baseWidth * 1.3) / 6,
        dotSize: 22,
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
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(highlightAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.loop(
            Animated.sequence([
              Animated.timing(pulseAnim, {
                toValue: 1.05,
                duration: 600,
                useNativeDriver: true,
              }),
              Animated.timing(pulseAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
              }),
            ]),
            { iterations: -1 }
          ),
        ]).start();
      }, animationDelay);
    } else {
      pulseAnim.stopAnimation();
      Animated.parallel([
        Animated.timing(highlightAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isHighlighted, animationDelay, highlightAnim, pulseAnim]);

  return (
    <Animated.View style={[
      styles.container,
      {
        width: dimensions.width,
        height: dimensions.height,
        transform: [{ scale: pulseAnim }],
      }
    ]}>
      <Animated.View style={[
        styles.fretboardContainer, 
        { 
          width: dimensions.width, 
          height: dimensions.height,
          backgroundColor: theme.surface + '20',
          borderRadius: 12,
          padding: 8,
          elevation: isHighlighted ? 6 : 2,
          shadowColor: theme.primary || '#007AFF',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isHighlighted ? 0.4 : 0.1,
          shadowRadius: isHighlighted ? 8 : 4,
          borderWidth: highlightAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 3],
            extrapolate: 'clamp',
          }),
          borderColor: highlightAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [theme.divider || '#E0E0E0', theme.primary || '#007AFF'],
            extrapolate: 'clamp',
          }),
        }
      ]}>
        {/* Fretboard background with wood texture feel */}
        <View style={[
          styles.fretboardBackground,
          {
            width: dimensions.width - 16,
            height: dimensions.height - 16,
            backgroundColor: '#F5DEB3',
            borderRadius: 8,
            position: 'absolute',
            top: 8,
            left: 8,
          }
        ]} />
        
        {/* Chord name at top */}
        <Text
          style={[
            styles.chordNameTop,
            {
              color: theme.text,
              fontSize: dimensions.fontSize + 2,
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: 8,
            }
          ]}
        >
          {chord}
        </Text>
        
        {/* Nut (thick line at the beginning for open chords) */}
        <View
          style={[
            styles.nut,
            {
              backgroundColor: baseFret === 1 ? '#8B4513' : 'transparent',
              height: (strings.length - 1) * dimensions.stringSpacing + 10,
              width: baseFret === 1 ? 5 : 0,
              left: 25,
              top: 35,
              borderRadius: 2,
            }
          ]}
        />
        
        {/* Frets */}
        {Array.from({ length: maxFrets + 1 }, (_, fretIndex) => (
          <View
            key={`fret-${fretIndex}`}
            style={[
              styles.fretLine,
              {
                height: (strings.length - 1) * dimensions.stringSpacing + 10,
                width: fretIndex === 0 ? (baseFret === 1 ? 0 : 2.5) : 1.5,
                backgroundColor: fretIndex === 0 && baseFret > 1 
                  ? theme.text 
                  : '#C0C0C0',
                left: 30 + (fretIndex * dimensions.fretSpacing),
                top: 35,
                borderRadius: 0.75,
                elevation: 1,
              }
            ]}
          />
        ))}
        
        {/* Strings with realistic thickness */}
        {strings.map((stringName, stringIndex) => {
          const stringThickness = stringIndex < 2 ? 2.5 : stringIndex < 4 ? 1.8 : 1.2;
          return (
            <View
              key={`string-${stringIndex}`}
              style={[
                styles.stringLine,
                {
                  width: maxFrets * dimensions.fretSpacing + 15,
                  height: stringThickness,
                  backgroundColor: '#666',
                  left: 25,
                  top: 35 + (stringIndex * dimensions.stringSpacing),
                  borderRadius: stringThickness / 2,
                }
              ]}
            />
          );
        })}
        
        {/* String labels */}
        {strings.map((stringName, stringIndex) => (
          <Text
            key={`label-${stringIndex}`}
            style={[
              styles.stringLabel,
              {
                color: theme.text,
                fontSize: dimensions.fontSize - 1,
                fontWeight: '600',
                left: 8,
                top: 30 + (stringIndex * dimensions.stringSpacing),
                textAlign: 'center',
                width: 12,
              }
            ]}
          >
            {stringName}
          </Text>
        ))}
        
        {/* Fret number indicator */}
        {baseFret > 1 && (
          <Text
            style={[
              styles.baseFretNumber,
              {
                color: theme.text,
                fontSize: dimensions.fontSize,
                fontWeight: 'bold',
                left: 35 + (dimensions.fretSpacing / 2),
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
          if (fret !== 0) { return null; }
          
          return (
            <View
              key={`open-${stringIndex}`}
              style={[
                styles.openStringIndicator,
                {
                  width: dimensions.dotSize * 0.7,
                  height: dimensions.dotSize * 0.7,
                  borderRadius: (dimensions.dotSize * 0.7) / 2,
                  borderWidth: 2,
                  borderColor: theme.primary || '#007AFF',
                  backgroundColor: 'transparent',
                  left: 30 - (dimensions.dotSize * 0.35),
                  top: 35 + (stringIndex * dimensions.stringSpacing) - (dimensions.dotSize * 0.35),
                }
              ]}
            />
          );
        })}
        
        {/* Muted string indicators */}
        {fingering.frets.map((fret, stringIndex) => {
          if (fret !== -1) { return null; }
          
          return (
            <Text
              key={`muted-${stringIndex}`}
              style={[
                styles.mutedIndicator,
                {
                  fontSize: dimensions.fontSize + 1,
                  color: '#FF3B30',
                  fontWeight: 'bold',
                  left: 30 - (dimensions.fontSize / 2),
                  top: 27 + (stringIndex * dimensions.stringSpacing),
                  textAlign: 'center',
                  width: dimensions.fontSize,
                }
              ]}
            >
              ✕
            </Text>
          );
        })}
        
        {/* Finger positions */}
        {fingering.frets.map((fret, stringIndex) => {
          if (fret <= 0) { return null; }
          
          const fretPosition = fret - baseFret + 1;
          if (fretPosition < 1 || fretPosition > maxFrets) { return null; }
          
          const x = 30 + (fretPosition * dimensions.fretSpacing) - (dimensions.fretSpacing / 2);
          const y = 35 + (stringIndex * dimensions.stringSpacing) - (dimensions.dotSize / 2);
          const fingerNumber = fingering.fingers?.[stringIndex] || '';
          
          return (
            <View
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
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.3,
                  shadowRadius: 2,
                  justifyContent: 'center',
                  alignItems: 'center',
                }
              ]}
            >
              {fingerNumber > 0 && (
                <Text
                  style={[
                    styles.fingerNumber,
                    {
                      fontSize: dimensions.fontSize - 3,
                      color: '#fff',
                      fontWeight: 'bold',
                      textAlign: 'center',
                    }
                  ]}
                >
                  {fingerNumber}
                </Text>
              )}
            </View>
          );
        })}
        
        {/* Barre indicators */}
        {fingering.barres?.map((barre, index) => {
          const fretPosition = barre.fret - baseFret + 1;
          if (fretPosition < 1 || fretPosition > maxFrets) { return null; }
          
          const startY = 35 + (barre.startString * dimensions.stringSpacing);
          const endY = 35 + (barre.endString * dimensions.stringSpacing);
          const x = 30 + (fretPosition * dimensions.fretSpacing) - (dimensions.fretSpacing / 2);
          
          return (
            <View
              key={`barre-${index}`}
              style={[
                styles.barreIndicator,
                {
                  width: dimensions.dotSize * 0.6,
                  height: Math.abs(endY - startY) + dimensions.dotSize,
                  backgroundColor: theme.primary || '#007AFF',
                  left: x - (dimensions.dotSize * 0.3),
                  top: Math.min(startY, endY) - (dimensions.dotSize / 2),
                  borderRadius: dimensions.dotSize * 0.3,
                  borderWidth: 1,
                  borderColor: '#fff',
                  elevation: 2,
                }
              ]}
            />
          );
        })}
        
        {/* Fingering type indicator */}
        <Text
          style={[
            styles.fingeringType,
            {
              color: theme.secondaryText || '#666',
              fontSize: dimensions.fontSize - 2,
              textAlign: 'center',
              position: 'absolute',
              bottom: 8,
              width: dimensions.width - 16,
              left: 8,
              fontStyle: 'italic',
            }
          ]}
        >
          {fingering.type} • {fingering.name}
        </Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fretboardContainer: {
    position: 'relative',
  },
  fretboardBackground: {
    // Background styling handled inline for responsiveness
  },
  chordNameTop: {
    marginTop: 4,
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
  },
  baseFretNumber: {
    position: 'absolute',
  },
  openStringIndicator: {
    position: 'absolute',
  },
  mutedIndicator: {
    position: 'absolute',
  },
  fingerDot: {
    position: 'absolute',
  },
  fingerNumber: {
    // Finger number styling handled inline
  },
  barreIndicator: {
    position: 'absolute',
  },
  fingeringType: {
    // Fingering type styling handled inline
  },
});

export default Fretboard;
