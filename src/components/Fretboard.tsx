import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

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
  
  // Size configurations
  const sizeConfig = {
    small: {
      stringSpacing: 28,
      fretSpacing: 32,
      dotSize: 18,
      fontSize: 10,
      nutThickness: 3,
      fretThickness: 1.5,
      stringThickness: 1,
    },
    medium: {
      stringSpacing: 36,
      fretSpacing: 40,
      dotSize: 24,
      fontSize: 12,
      nutThickness: 4,
      fretThickness: 2,
      stringThickness: 1.5,
    },
    large: {
      stringSpacing: 44,
      fretSpacing: 48,
      dotSize: 30,
      fontSize: 14,
      nutThickness: 5,
      fretThickness: 2.5,
      stringThickness: 2,
    },
  };

  const config = sizeConfig[size];
  const totalWidth = maxFrets * config.fretSpacing + 40;
  const totalHeight = (strings.length - 1) * config.stringSpacing + 80;

  const renderFretboard = () => {
    return (
      <View style={[styles.fretboardContainer, { width: totalWidth, height: totalHeight }]}>
        {/* Nut (thick vertical line at the beginning) */}
        {baseFret === 1 && (
          <View 
            style={[
              styles.nut, 
              { 
                height: (strings.length - 1) * config.stringSpacing + 10,
                width: config.nutThickness,
                backgroundColor: theme.text,
                left: 20,
                top: 35,
              }
            ]} 
          />
        )}
        
        {/* Fret lines */}
        {Array.from({ length: maxFrets + 1 }, (_, fretIndex) => (
          <View
            key={`fret-${fretIndex}`}
            style={[
              styles.fretLine,
              {
                height: (strings.length - 1) * config.stringSpacing + 10,
                width: config.fretThickness,
                backgroundColor: fretIndex === 0 && baseFret > 1 
                  ? theme.text 
                  : fretIndex === 0 && baseFret === 1
                    ? '#8B4513' // Brown nut color
                    : '#C0C0C0', // Silver fret wire
                left: 20 + (fretIndex * config.fretSpacing),
                top: 35,
                borderRadius: config.fretThickness / 2,
              }
            ]}
          />
        ))}
        
        {/* Strings */}
        {strings.map((stringName, stringIndex) => (
          <View
            key={`string-${stringIndex}`}
            style={[
              styles.stringLine,
              {
                width: maxFrets * config.fretSpacing + 10,
                height: config.stringThickness,
                backgroundColor: '#888',
                left: 15,
                top: 35 + (stringIndex * config.stringSpacing),
              }
            ]}
          />
        ))}
        
        {/* String labels */}
        {strings.map((stringName, stringIndex) => (
          <Text
            key={`label-${stringIndex}`}
            style={[
              styles.stringLabel,
              {
                color: theme.text,
                fontSize: config.fontSize,
                left: 2,
                top: 30 + (stringIndex * config.stringSpacing),
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
                fontSize: config.fontSize + 2,
                left: 30 + (config.fretSpacing / 2),
                top: 10,
              }
            ]}
          >
            {baseFret}fr
          </Text>
        )}
        
        {/* Finger positions */}
        {fingering.frets.map((fret, stringIndex) => {
          if (fret <= 0) return null; // Skip open or muted strings
          
          const fretPosition = fret - baseFret + 1;
          if (fretPosition < 1 || fretPosition > maxFrets) return null;
          
          const x = 20 + (fretPosition * config.fretSpacing) - (config.fretSpacing / 2);
          const y = 35 + (stringIndex * config.stringSpacing) - (config.dotSize / 2);
          
          return (
            <View
              key={`finger-${stringIndex}`}
              style={[
                styles.fingerDot,
                {
                  width: config.dotSize,
                  height: config.dotSize,
                  borderRadius: config.dotSize / 2,
                  backgroundColor: theme.primary || '#007AFF',
                  left: x,
                  top: y,
                  borderWidth: 2,
                  borderColor: '#fff',
                }
              ]}
            >
              <Text
                style={[
                  styles.fingerNumber,
                  {
                    fontSize: config.fontSize - 2,
                    color: '#fff',
                    fontWeight: 'bold',
                  }
                ]}
              >
                {fingering.fingers?.[stringIndex] || '●'}
              </Text>
            </View>
          );
        })}
        
        {/* Open string indicators */}
        {fingering.frets.map((fret, stringIndex) => {
          if (fret !== 0) return null;
          
          return (
            <View
              key={`open-${stringIndex}`}
              style={[
                styles.openStringIndicator,
                {
                  width: config.dotSize - 4,
                  height: config.dotSize - 4,
                  borderRadius: (config.dotSize - 4) / 2,
                  borderColor: theme.primary || '#007AFF',
                  left: 20 - ((config.dotSize - 4) / 2),
                  top: 35 + (stringIndex * config.stringSpacing) - ((config.dotSize - 4) / 2),
                }
              ]}
            >
              <Text
                style={[
                  styles.openStringText,
                  {
                    fontSize: config.fontSize - 2,
                    color: theme.primary || '#007AFF',
                  }
                ]}
              >
                ○
              </Text>
            </View>
          );
        })}
        
        {/* Muted string indicators */}
        {fingering.frets.map((fret, stringIndex) => {
          if (fret !== -1) return null;
          
          return (
            <View
              key={`muted-${stringIndex}`}
              style={[
                styles.mutedStringIndicator,
                {
                  left: 20 - (config.dotSize / 2),
                  top: 35 + (stringIndex * config.stringSpacing) - (config.dotSize / 2),
                }
              ]}
            >
              <Text
                style={[
                  styles.mutedStringText,
                  {
                    fontSize: config.fontSize,
                    color: theme.error || '#ff4444',
                  }
                ]}
              >
                ✕
              </Text>
            </View>
          );
        })}
        
        {/* Barre indicators */}
        {fingering.barres?.map((barre, index) => {
          const fretPosition = barre.fret - baseFret + 1;
          if (fretPosition < 1 || fretPosition > maxFrets) return null;
          
          const x = 20 + (fretPosition * config.fretSpacing) - (config.fretSpacing / 2);
          const startY = 35 + (barre.startString * config.stringSpacing);
          const endY = 35 + (barre.endString * config.stringSpacing);
          const height = endY - startY;
          
          return (
            <View
              key={`barre-${index}`}
              style={[
                styles.barreIndicator,
                {
                  width: config.dotSize - 4,
                  height: height + config.dotSize,
                  borderRadius: (config.dotSize - 4) / 2,
                  backgroundColor: theme.primary || '#007AFF',
                  left: x - ((config.dotSize - 4) / 2),
                  top: startY - (config.dotSize / 2),
                }
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          backgroundColor: theme.surface,
          transform: [{ scale: pulseAnim }],
        }
      ]}
    >
      <Animated.View
        style={[
          styles.highlightOverlay,
          {
            opacity: highlightAnim,
            backgroundColor: theme.primary + '20',
            borderColor: theme.primary,
          }
        ]}
      />
      
      <Text style={[styles.chordName, { color: theme.text, fontSize: config.fontSize + 6 }]}>
        {chord}
      </Text>
      
      {renderFretboard()}
      
      <View style={styles.chordInfo}>
        <Text style={[styles.chordVariation, { color: theme.secondaryText, fontSize: config.fontSize - 1 }]}>
          {fingering.name}
        </Text>
        <Text style={[styles.chordType, { color: theme.secondaryText, fontSize: config.fontSize - 1 }]}>
          {fingering.type}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  highlightOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
    borderWidth: 3,
    zIndex: 1,
  },
  chordName: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  fretboardContainer: {
    position: 'relative',
  },
  nut: {
    position: 'absolute',
    borderRadius: 1,
  },
  fretLine: {
    position: 'absolute',
    borderRadius: 0.5,
  },
  stringLine: {
    position: 'absolute',
  },
  stringLabel: {
    position: 'absolute',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  baseFretNumber: {
    position: 'absolute',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  fingerDot: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  fingerNumber: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  openStringIndicator: {
    position: 'absolute',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  openStringText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  mutedStringIndicator: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mutedStringText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  barreIndicator: {
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  chordInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    width: '100%',
  },
  chordVariation: {
    fontStyle: 'italic',
  },
  chordType: {
    fontStyle: 'italic',
    textTransform: 'capitalize',
  },
});

export default Fretboard;
