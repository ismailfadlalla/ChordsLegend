import numpy as np

# Generate chord templates for common chords
chord_templates = {
    'C': np.array([1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0]),  # C-E-G
    'G': np.array([0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1]),  # G-B-D
    'Am': np.array([1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0]),  # A-C-E
    'F': np.array([0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1]),   # F-A-C
    # Add more chords as needed
}

if __name__ == '__main__':
    print("Chord templates generated")
