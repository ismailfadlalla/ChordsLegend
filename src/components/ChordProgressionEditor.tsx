// src/components/ChordProgressionEditor.tsx
import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList, Modal, ScrollView, StyleSheet,
  Text, TouchableOpacity, View
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { CHORD_LIBRARY } from '../utils/chordLibrary';
import { ChordFingering, Fretboard } from './Fretboard';

interface ChordSlot {
  id: string;
  chord: string | null;
  position: number;
}

interface ChordProgressionEditorProps {
  initialProgression?: string[];
  onProgressionChange?: (progression: string[]) => void;
  onChordSelect?: (chord: string) => void;
}

export const ChordProgressionEditor: React.FC<ChordProgressionEditorProps> = ({
  initialProgression = ['C', 'G', 'Am', 'F'], // Changed to match common 4-chord progressions
  onProgressionChange,
  onChordSelect,
}) => {
  const { theme } = useTheme();
  const [progression, setProgression] = useState<ChordSlot[]>(
    initialProgression.map((chord, index) => ({
      id: `slot-${index}`,
      chord: chord || null,
      position: index,
    }))
  );
  
  const [selectedInstrument, setSelectedInstrument] = useState<'guitar' | 'ukulele'>('guitar');
  const [transposeValue, setTransposeValue] = useState(0);
  const [capoPosition, setCapoPosition] = useState(0);
  const [simplifyMode, setSimplifyMode] = useState(false);
  const [selectedChordSlot, setSelectedChordSlot] = useState<string | null>(null);
  const [chordSelectorVisible, setChordSelectorVisible] = useState(false);
  const [selectedChordForDisplay, setSelectedChordForDisplay] = useState<string>('C');

  // Sync internal state with initialProgression prop when it changes
  useEffect(() => {
    const newProgression = initialProgression.map((chord, index) => ({
      id: `slot-${index}`,
      chord: chord || null,
      position: index,
    }));
    setProgression(newProgression);
  }, [initialProgression]);

  // Call onProgressionChange whenever progression changes
  useEffect(() => {
    const chordNames = progression.map(slot => slot.chord || '');
    onProgressionChange?.(chordNames);
  }, [progression, onProgressionChange]);

  // Update displayed chord when progression changes
  useEffect(() => {
    const firstChord = progression.find(slot => slot.chord)?.chord;
    if (firstChord && firstChord !== selectedChordForDisplay) {
      setSelectedChordForDisplay(firstChord);
    }
  }, [progression, selectedChordForDisplay]);

  // Available chords for selection
  const availableChords = Object.keys(CHORD_LIBRARY).sort();

  // Simple transpose function
  const transposeChord = useCallback((chord: string, semitones: number): string => {
    const chromaticScale = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const chordBase = chord.replace(/m|7|maj|dim|aug|sus|add/g, ''); // Extract root note
    const chordSuffix = chord.replace(chordBase, ''); // Extract suffix
    
    let rootIndex = chromaticScale.indexOf(chordBase);
    if (rootIndex === -1) {
      return chord; // Return original if not found
    }
    
    rootIndex = (rootIndex + semitones + 12) % 12;
    return chromaticScale[rootIndex] + chordSuffix;
  }, []);

  const transposeChordProgression = useCallback((semitones: number) => {
    setProgression(currentProgression => {
      const transposedProgression = currentProgression.map(slot => ({
        ...slot,
        chord: slot.chord ? transposeChord(slot.chord, semitones) : null,
      }));
      return transposedProgression;
    });
    setTransposeValue(prev => prev + semitones);
  }, [transposeChord]);

  const handleChordSelect = useCallback((chordName: string, slotId: string) => {
    setProgression(currentProgression => {
      const updatedProgression = currentProgression.map(slot => 
        slot.id === slotId ? { ...slot, chord: chordName } : slot
      );
      return updatedProgression;
    });
    
    onChordSelect?.(chordName);
    setChordSelectorVisible(false);
    setSelectedChordSlot(null);
  }, [onChordSelect]);

  const openChordSelector = useCallback((slotId: string) => {
    setSelectedChordSlot(slotId);
    setChordSelectorVisible(true);
  }, []);

  const clearChordSlot = useCallback((slotId: string) => {
    setProgression(currentProgression => {
      const updatedProgression = currentProgression.map(slot => 
        slot.id === slotId ? { ...slot, chord: null } : slot
      );
      return updatedProgression;
    });
  }, []);

  const simplifyChords = useCallback(() => {
    setSimplifyMode(!simplifyMode);
    // TODO: Implement chord simplification logic
  }, [simplifyMode]);

  const getChordFingering = useCallback((chordName: string): ChordFingering | null => {
    const chordDef = CHORD_LIBRARY[chordName];
    if (!chordDef || !chordDef.fingerings.length) {
      return null;
    }
    
    // Return the first (usually simplest) fingering
    return chordDef.fingerings[0];
  }, []);

  // Add a new chord slot
  const addChordSlot = useCallback(() => {
    setProgression(currentProgression => {
      const newSlot: ChordSlot = {
        id: `slot-${Date.now()}`, // Use timestamp for unique IDs
        chord: null,
        position: currentProgression.length,
      };
      return [...currentProgression, newSlot];
    });
  }, []);

  // Remove the last chord slot (minimum 2 slots)
  const removeChordSlot = useCallback(() => {
    setProgression(currentProgression => {
      if (currentProgression.length <= 2) {
        return currentProgression; // Minimum 2 chords
      }
      return currentProgression.slice(0, -1);
    });
  }, []);

  const renderChordSlot = ({ item }: { item: ChordSlot }) => (
    <TouchableOpacity
      style={[
        styles.chordSlot,
        { 
          backgroundColor: item.chord ? theme.primary : theme.surface,
          borderColor: theme.divider,
        }
      ]}
      onPress={() => openChordSelector(item.id)}
      onLongPress={() => item.chord && clearChordSlot(item.id)}
    >
      <Text style={[
        styles.chordSlotText,
        { color: item.chord ? theme.onPrimary : theme.text }
      ]}>
        {item.chord || '|'}
      </Text>
    </TouchableOpacity>
  );

  const renderChordSelector = () => (
    <Modal
      visible={chordSelectorVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setChordSelectorVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
          <Text style={[styles.modalTitle, { color: theme.text }]}>
            Select Chord
          </Text>
          
          <FlatList
            data={availableChords}
            numColumns={4}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.chordOption, { backgroundColor: theme.background }]}
                onPress={() => selectedChordSlot && handleChordSelect(item, selectedChordSlot)}
              >
                <Text style={[styles.chordOptionText, { color: theme.text }]}>
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
          
          <TouchableOpacity
            style={[styles.cancelButton, { backgroundColor: theme.divider }]}
            onPress={() => setChordSelectorVisible(false)}
          >
            <Text style={[styles.cancelButtonText, { color: theme.text }]}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const displayChord = progression.find(slot => slot.chord)?.chord || selectedChordForDisplay;
  const chordFingering = getChordFingering(displayChord);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}> 
      {/* Header Controls */}
      <View style={styles.headerControls}>
        <View style={styles.controlGroup}>
          <Text style={[styles.controlLabel, { color: theme.text }]}>GUITAR</Text>
          <TouchableOpacity style={[styles.dropdownButton, { borderColor: theme.divider }]}>
            <Text style={[styles.dropdownText, { color: theme.text }]}>▼</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.controlButton, { backgroundColor: theme.surface }]}
          onPress={() => transposeChordProgression(1)}
        >
          <Text style={[styles.controlButtonText, { color: theme.text }]}>TRANSPOSE</Text>
        </TouchableOpacity>

        <View style={styles.controlGroup}>
          <Text style={[styles.controlLabel, { color: theme.text }]}>CAPO</Text>
          <TouchableOpacity
            style={[styles.capoButton, { backgroundColor: theme.surface }]}
            onPress={() => setCapoPosition(prev => (prev + 1) % 12)}
          >
            <Text style={[styles.capoText, { color: theme.text }]}>{capoPosition}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.controlButton,
            { backgroundColor: simplifyMode ? theme.primary : theme.surface }
          ]}
          onPress={simplifyChords}
        >
          <Text style={[
            styles.controlButtonText,
            { color: simplifyMode ? theme.onPrimary : theme.text }
          ]}>
            SIMPLIFY
          </Text>
        </TouchableOpacity>
      </View>

      {/* Chord Progression */}
      <View style={styles.progressionContainer}>
        <FlatList
          data={progression}
          horizontal
          keyExtractor={(item) => item.id}
          renderItem={renderChordSlot}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.progressionList}
        />
      </View>

      {/* Progression Controls */}
      <View style={styles.progressionControls}>
        <TouchableOpacity
          style={[styles.progressionControlButton, { backgroundColor: theme.surface }]}
          onPress={addChordSlot}
        >
          <Text style={[styles.progressionControlText, { color: theme.text }]}>+ Add Chord</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.progressionControlButton, 
            { 
              backgroundColor: progression.length <= 2 ? theme.divider : theme.surface,
              opacity: progression.length <= 2 ? 0.5 : 1
            }
          ]}
          onPress={removeChordSlot}
          disabled={progression.length <= 2}
        >
          <Text style={[styles.progressionControlText, { color: theme.text }]}>- Remove Chord</Text>
        </TouchableOpacity>
        
        <Text style={[styles.chordCountText, { color: theme.text }]}>
          {progression.length} chords
        </Text>
      </View>

      {/* Chord Diagrams */}
      <View style={styles.diagramsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {progression
            .filter(slot => slot.chord)
            .map(slot => {
              const fingering = getChordFingering(slot.chord!);
              if (!fingering) {
                return null;
              }

              return (
                <View key={slot.id} style={styles.diagramWrapper}>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedChordForDisplay(slot.chord!);
                      onChordSelect?.(slot.chord!);
                    }}
                  >
                    <Fretboard
                      chord={slot.chord!}
                      fingering={fingering}
                      theme={theme}
                    />
                    <Text style={[styles.chordLabel, { color: theme.text }]}>
                      {slot.chord}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
        </ScrollView>
      </View>

      {/* Transpose Controls */}
      <View style={styles.transposeControls}>
        <TouchableOpacity
          style={[styles.transposeButton, { backgroundColor: theme.surface }]}
          onPress={() => transposeChordProgression(-1)}
        >
          <Text style={[styles.transposeButtonText, { color: theme.text }]}>♭</Text>
        </TouchableOpacity>
        
        <Text style={[styles.transposeDisplay, { color: theme.text }]}>
          {transposeValue === 0 ? 'Original Key' : `${transposeValue > 0 ? '+' : ''}${transposeValue}`}
        </Text>
        
        <TouchableOpacity
          style={[styles.transposeButton, { backgroundColor: theme.surface }]}
          onPress={() => transposeChordProgression(1)}
        >
          <Text style={[styles.transposeButtonText, { color: theme.text }]}>♯</Text>
        </TouchableOpacity>
      </View>

      {renderChordSelector()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    minHeight: 400,
  },
  headerControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  controlGroup: {
    alignItems: 'center',
  },
  controlLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  dropdownButton: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 14,
  },
  controlButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  controlButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  capoButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  capoText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressionContainer: {
    marginBottom: 20,
  },
  progressionList: {
    alignItems: 'center',
  },
  chordSlot: {
    width: 60,
    height: 40,
    marginHorizontal: 4,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chordSlotText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  diagramsContainer: {
    marginBottom: 20,
    minHeight: 200,
  },
  diagramWrapper: {
    marginRight: 20,
    alignItems: 'center',
  },
  chordLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
  },
  transposeControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  transposeButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transposeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  transposeDisplay: {
    fontSize: 16,
    fontWeight: 'bold',
    minWidth: 120,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '70%',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  chordOption: {
    flex: 1,
    margin: 4,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 60,
  },
  chordOptionText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 20,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressionControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 16,
    paddingHorizontal: 20,
  },
  progressionControlButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  progressionControlText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  chordCountText: {
    fontSize: 14,
    fontWeight: 'bold',
    opacity: 0.7,
  },
});

export default ChordProgressionEditor;
