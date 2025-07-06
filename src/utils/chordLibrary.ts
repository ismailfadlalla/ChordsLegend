import { ChordFingering } from '../components/Fretboard';

export interface ChordDefinition {
  name: string;
  fingerings: ChordFingering[];
}

export const CHORD_LIBRARY: Record<string, ChordDefinition> = {
  'C': {
    name: 'C Major',
    fingerings: [
      {
        name: 'Open Position',
        frets: [0, 3, 2, 0, 1, 0],
        fingers: [0, 3, 2, 0, 1, 0],
        type: 'open',
      },
      {
        name: 'Barre 3rd Fret',
        frets: [3, 3, 5, 5, 5, 3],
        fingers: [1, 1, 3, 4, 4, 1],
        barres: [{ fret: 3, startString: 0, endString: 5 }],
        baseFret: 3,
        type: 'barre',
      }
    ]
  },
  'G': {
    name: 'G Major',
    fingerings: [
      {
        name: 'Open Position',
        frets: [3, 2, 0, 0, 3, 3],
        fingers: [3, 2, 0, 0, 4, 4],
        type: 'open',
      }
    ]
  },
  'Am': {
    name: 'A Minor',
    fingerings: [
      {
        name: 'Open Position',
        frets: [0, 0, 2, 2, 1, 0],
        fingers: [0, 0, 3, 2, 1, 0],
        type: 'open',
      }
    ]
  },
  'F': {
    name: 'F Major',
    fingerings: [
      {
        name: 'Barre 1st Fret',
        frets: [1, 3, 3, 2, 1, 1],
        fingers: [1, 3, 4, 2, 1, 1],
        barres: [{ fret: 1, startString: 0, endString: 5 }],
        baseFret: 1,
        type: 'barre',
      }
    ]
  },
  'Em': {
    name: 'E Minor',
    fingerings: [
      {
        name: 'Open Position',
        frets: [0, 2, 2, 0, 0, 0],
        fingers: [0, 2, 3, 0, 0, 0],
        type: 'open',
      }
    ]
  },
  'Em7': {
    name: 'E Minor 7',
    fingerings: [
      {
        name: 'Open Position',
        frets: [0, 2, 0, 0, 0, 0],
        fingers: [0, 2, 0, 0, 0, 0],
        type: 'open',
      }
    ]
  },
  'D': {
    name: 'D Major',
    fingerings: [
      {
        name: 'Open Position',
        frets: [-1, -1, 0, 2, 3, 2],
        fingers: [0, 0, 0, 1, 3, 2],
        type: 'open',
      }
    ]
  },
  'Dm': {
    name: 'D Minor',
    fingerings: [
      {
        name: 'Open Position',
        frets: [-1, -1, 0, 2, 3, 1],
        fingers: [0, 0, 0, 2, 3, 1],
        type: 'open',
      }
    ]
  },
  'B7': {
    name: 'B Dominant 7',
    fingerings: [
      {
        name: 'Open Position',
        frets: [-1, 2, 1, 2, 0, 2],
        fingers: [0, 2, 1, 3, 0, 4],
        type: 'open',
      }
    ]
  },
  'E': {
    name: 'E Major',
    fingerings: [
      {
        name: 'Open Position',
        frets: [0, 2, 2, 1, 0, 0],
        fingers: [0, 2, 3, 1, 0, 0],
        type: 'open',
      }
    ]
  }
};

export const getChordFingerings = (chordName: string): ChordDefinition | null => {
  // First try the exact chord name
  if (CHORD_LIBRARY[chordName]) {
    return CHORD_LIBRARY[chordName];
  }
  
  // Then try the base chord (remove extensions)
  const baseChord = chordName.replace(/7|maj7|m7|add9|sus2|sus4|dim|aug|9|11|13/g, '');
  if (CHORD_LIBRARY[baseChord]) {
    return CHORD_LIBRARY[baseChord];
  }
  
  // Handle specific mappings for common extensions
  if (chordName.includes('m7') && !chordName.includes('maj7')) {
    const minorChord = chordName.replace('m7', 'm');
    if (CHORD_LIBRARY[minorChord]) {
      return CHORD_LIBRARY[minorChord];
    }
  }
  
  return null;
};

export const getAvailableChords = (): string[] => {
  return Object.keys(CHORD_LIBRARY);
};
