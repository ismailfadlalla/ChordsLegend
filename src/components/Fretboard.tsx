import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';
import { ChordDefinition } from '../utils/chordLibrary';

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
  chord: ChordDefinition;
  fingering?: ChordFingering;
  onFingeringChange?: (fingering: ChordFingering) => void;
  theme: any;
  size?: 'small' | 'medium' | 'large';
  isHighlighted?: boolean;
  animationDelay?: number;
}

// Enhanced sizing system for better mobile experience with MUCH MORE COMPACT layout
const getSizeDimensions = (size: 'small' | 'medium' | 'large') => {
  const baseWidth = Math.min(screenWidth * 0.85, 300); // Responsive to screen width
  
  switch (size) {
    case 'small':
      return {
        width: baseWidth * 0.5, // Even smaller
        height: (baseWidth * 0.5) * 0.7, // Much more compact height ratio
        stringSpacing: (baseWidth * 0.5) / 8, // Even tighter spacing
        fretSpacing: ((baseWidth * 0.5) * 0.7) / 5,
        dotSize: 10, // Smaller dots
        fontSize: 9
      };
    case 'medium':
      return {
        width: baseWidth * 0.65, // Smaller than before
        height: (baseWidth * 0.65) * 0.8, // Much more compact
        stringSpacing: (baseWidth * 0.65) / 8,
        fretSpacing: ((baseWidth * 0.65) * 0.8) / 5,
        dotSize: 14,
        fontSize: 11
      };
    case 'large':
      return {
        width: baseWidth * 0.8, // Reduced from full width
        height: baseWidth * 0.85, // Much more compact from 1.2 to 0.85
        stringSpacing: baseWidth / 8, // Much tighter string spacing
        fretSpacing: (baseWidth * 0.85) / 5,
        dotSize: 18, // Smaller dots
        fontSize: 13
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
  
  // Use passed fingering or default to first fingering from chord definition
  const activeFingering = fingering || (chord.fingerings && chord.fingerings[0]) || {
    name: 'Default',
    frets: [0, 0, 0, 0, 0, 0],
    fingers: [0, 0, 0, 0, 0, 0],
    type: 'open' as const
  };
  
  const baseFret = activeFingering.baseFret || 1;
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
          padding: 8, // Reduced from 12 to 8
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
            width: dimensions.width - 16, // Adjusted for reduced padding
            height: dimensions.height - 16, // Adjusted for reduced padding
            backgroundColor: '#F5DEB3', // Light wood color
            borderRadius: 8,
            position: 'absolute',
            top: 8, // Adjusted for reduced padding
            left: 8, // Adjusted for reduced padding
          }
        ]} />
        
        {/* Nut (thick line at the beginning for open chords) - adjusted position */}
        <View
          style={[
            styles.nut,
            {
              backgroundColor: baseFret === 1 ? '#8B4513' : 'transparent',
              height: (strings.length - 1) * dimensions.stringSpacing + 10,
              width: baseFret === 1 ? 6 : 0,
              left: 20,
              top: 30, // Moved up from 40 to 30
              borderRadius: 3,
            }
          ]}
        />
        
        {/* Frets with MUCH REDUCED prominence - barely visible lines */}
        {Array.from({ length: maxFrets + 1 }, (_, fretIndex) => (
          <View
            key={`fret-${fretIndex}`}
            style={[
              styles.fretLine,
              {
                height: (strings.length - 1) * dimensions.stringSpacing + 8, // Slightly shorter
                width: fretIndex === 0 ? (baseFret === 1 ? 0 : 1) : 0.5, // Much thinner: 2->1 and 1->0.5
                backgroundColor: fretIndex === 0 && baseFret > 1 
                  ? theme.text + '30' // Very transparent
                  : '#C0C0C0' + '20', // Extremely transparent fret wire
                left: 25 + (fretIndex * dimensions.fretSpacing),
                top: 25, // Moved up more: from 30 to 25
                borderRadius: 0.2, // Very thin rounded edges
                opacity: 0.3, // Added opacity for extra subtlety
              }
            ]}
          />
        ))}
        
        {/* Strings with realistic thickness variation - adjusted positioning */}
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
                  top: 30 + (stringIndex * dimensions.stringSpacing), // Moved up from 40 to 30
                  borderRadius: stringThickness / 2,
                }
              ]}
            />
          );
        })}
        
        {/* String labels with better positioning - moved up */}
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
                top: 25 + (stringIndex * dimensions.stringSpacing), // Moved up from 35 to 25
                textAlign: 'center',
              }
            ]}
          >
            {stringName}
          </Text>
        ))}
        
        {/* Fret numbers (only show if not starting from 1st fret) - moved up */}
        {baseFret > 1 && (
          <Text
            style={[
              styles.baseFretNumber,
              {
                color: theme.text,
                fontSize: dimensions.fontSize + 2,
                fontWeight: 'bold',
                left: 30 + (dimensions.fretSpacing / 2),
                top: 8, // Moved up from 15 to 8
                textAlign: 'center',
              }
            ]}
          >
            {baseFret}fr
          </Text>
        )}
        
        {/* Open string indicators - adjusted position */}
        {activeFingering.frets.map((fret, stringIndex) => {
          if (fret !== 0) {
            return null; // Only show for open strings
          }
          
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
                  top: 30 + (stringIndex * dimensions.stringSpacing) - (dimensions.dotSize * 0.4), // Moved up from 40 to 30
                }
              ]}
            />
          );
        })}
        
        {/* Muted string indicators - adjusted position */}
        {activeFingering.frets.map((fret, stringIndex) => {
          if (fret !== -1) {
            return null; // Only show for muted strings
          }
          
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
                  top: 22 + (stringIndex * dimensions.stringSpacing), // Moved up from 32 to 22
                  textAlign: 'center',
                }
              ]}
            >
              ✕
            </Text>
          );
        })}
        
        {/* Enhanced finger positions with shadows and better styling */}
        {activeFingering.frets.map((fret, stringIndex) => {
          if (fret <= 0) {
            return null; // Skip open or muted strings
          }
          
          const fretPosition = fret - baseFret + 1;
          if (fretPosition < 1 || fretPosition > maxFrets) {
            return null;
          }
          
          const x = 25 + (fretPosition * dimensions.fretSpacing) - (dimensions.fretSpacing / 2);
          const y = 30 + (stringIndex * dimensions.stringSpacing) - (dimensions.dotSize / 2); // Moved up from 40 to 30
          const fingerNumber = activeFingering.fingers?.[stringIndex] || '';
          
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
        {activeFingering.barres?.map((barre, index) => {
          const fretPosition = barre.fret - baseFret + 1;
          if (fretPosition < 1 || fretPosition > maxFrets) {
            return null;
          }
          
          const startString = barre.startString || 0;
          const endString = barre.endString || 5;
          const x = 25 + (fretPosition * dimensions.fretSpacing) - (dimensions.fretSpacing / 2);
          const startY = 30 + (startString * dimensions.stringSpacing) - (dimensions.dotSize / 2); // Moved up from 40 to 30
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
        
        {/* Chord name with improved styling - moved up */}
        <Text
          style={[
            styles.chordName,
            {
              color: theme.primary || '#007AFF',
              fontSize: dimensions.fontSize + 6,
              fontWeight: 'bold',
              textAlign: 'center',
              position: 'absolute',
              bottom: 5, // Moved up from 10 to 5
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
