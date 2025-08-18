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
  },
  // Add more common chords for intelligent generation
  'A': {
    name: 'A Major',
    fingerings: [
      {
        name: 'Open Position',
        frets: [-1, 0, 2, 2, 2, 0],
        fingers: [0, 0, 1, 2, 3, 0],
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
  'B': {
    name: 'B Major',
    fingerings: [
      {
        name: 'Barre 2nd Fret',
        frets: [-1, 2, 4, 4, 4, 2],
        fingers: [0, 1, 2, 3, 4, 1],
        barres: [{ fret: 2, startString: 1, endString: 5 }],
        baseFret: 2,
        type: 'barre',
      }
    ]
  },
  'Bm': {
    name: 'B Minor',
    fingerings: [
      {
        name: 'Barre 2nd Fret',
        frets: [-1, 2, 4, 4, 3, 2],
        fingers: [0, 1, 3, 4, 2, 1],
        barres: [{ fret: 2, startString: 1, endString: 5 }],
        baseFret: 2,
        type: 'barre',
      }
    ]
  },
  'Fm': {
    name: 'F Minor',
    fingerings: [
      {
        name: 'Barre 1st Fret',
        frets: [1, 3, 3, 1, 1, 1],
        fingers: [1, 3, 4, 1, 1, 1],
        barres: [{ fret: 1, startString: 0, endString: 5 }],
        baseFret: 1,
        type: 'barre',
      }
    ]
  },
  'Gm': {
    name: 'G Minor',
    fingerings: [
      {
        name: 'Barre 3rd Fret',
        frets: [3, 5, 5, 3, 3, 3],
        fingers: [1, 3, 4, 1, 1, 1],
        barres: [{ fret: 3, startString: 0, endString: 5 }],
        baseFret: 3,
        type: 'barre',
      }
    ]
  },
  'Cm': {
    name: 'C Minor',
    fingerings: [
      {
        name: 'Barre 3rd Fret',
        frets: [-1, 3, 5, 5, 4, 3],
        fingers: [0, 1, 3, 4, 2, 1],
        type: 'barre',
      }
    ]
  },
  'Bb': {
    name: 'B Flat Major',
    fingerings: [
      {
        name: 'Barre 1st Fret',
        frets: [-1, 1, 3, 3, 3, 1],
        fingers: [0, 1, 2, 3, 4, 1],
        barres: [{ fret: 1, startString: 1, endString: 5 }],
        baseFret: 1,
        type: 'barre',
      }
    ]
  },
  'Eb': {
    name: 'E Flat Major',
    fingerings: [
      {
        name: 'Barre 6th Fret',
        frets: [-1, 6, 8, 8, 8, 6],
        fingers: [0, 1, 2, 3, 4, 1],
        barres: [{ fret: 6, startString: 1, endString: 5 }],
        baseFret: 6,
        type: 'barre',
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
  'A7': {
    name: 'A Dominant 7',
    fingerings: [
      {
        name: 'Open Position',
        frets: [-1, 0, 2, 0, 2, 0],
        fingers: [0, 0, 2, 0, 3, 0],
        type: 'open',
      }
    ]
  },
  'C7': {
    name: 'C Dominant 7',
    fingerings: [
      {
        name: 'Open Position',
        frets: [-1, 3, 2, 3, 1, 0],
        fingers: [0, 3, 2, 4, 1, 0],
        type: 'open',
      }
    ]
  },
  'F7': {
    name: 'F Dominant 7',
    fingerings: [
      {
        name: 'Barre 1st Fret',
        frets: [1, 3, 1, 2, 1, 1],
        fingers: [1, 3, 1, 2, 1, 1],
        barres: [{ fret: 1, startString: 0, endString: 5 }],
        baseFret: 1,
        type: 'barre',
      }
    ]
  },
  'G7': {
    name: 'G Dominant 7',
    fingerings: [
      {
        name: 'Open Position',
        frets: [3, 2, 0, 0, 0, 1],
        fingers: [3, 2, 0, 0, 0, 1],
        type: 'open',
      }
    ]
  }
};

export const getChordFingerings = (chordName: string): ChordDefinition | null => {
  console.log(`🔍 Looking up chord: ${chordName}`);
  
  // First try the exact chord name
  if (CHORD_LIBRARY[chordName]) {
    console.log(`✅ Found exact match for: ${chordName}`);
    return CHORD_LIBRARY[chordName];
  }
  
  // Then try the base chord (remove extensions)
  const baseChord = chordName.replace(/7|maj7|m7|add9|sus2|sus4|dim|aug|9|11|13/g, '');
  if (CHORD_LIBRARY[baseChord]) {
    console.log(`✅ Found base chord match: ${chordName} -> ${baseChord}`);
    return CHORD_LIBRARY[baseChord];
  }
  
  // Handle specific mappings for common extensions
  if (chordName.includes('m7') && !chordName.includes('maj7')) {
    const minorChord = chordName.replace('m7', 'm');
    if (CHORD_LIBRARY[minorChord]) {
      console.log(`✅ Found minor chord match: ${chordName} -> ${minorChord}`);
      return CHORD_LIBRARY[minorChord];
    }
  }
  
  // Handle sharp/flat conversions
  const chordWithFlat = chordName.replace('#', 'b');
  if (CHORD_LIBRARY[chordWithFlat]) {
    console.log(`✅ Found flat equivalent: ${chordName} -> ${chordWithFlat}`);
    return CHORD_LIBRARY[chordWithFlat];
  }
  
  const chordWithSharp = chordName.replace('b', '#');
  if (CHORD_LIBRARY[chordWithSharp]) {
    console.log(`✅ Found sharp equivalent: ${chordName} -> ${chordWithSharp}`);
    return CHORD_LIBRARY[chordWithSharp];
  }
  
  // As a last resort, return C major for any unknown chord
  console.warn(`❌ No fingering found for ${chordName}, using C major as fallback`);
  return CHORD_LIBRARY['C'];
};

export const getAvailableChords = (): string[] => {
  return Object.keys(CHORD_LIBRARY);
};
