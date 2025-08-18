"""
Mock chord analysis for testing purposes
"""
import random
import re


def mock_chord_analysis(url):
    """
    Generate mock chord analysis based on song characteristics
    """
    print(f"Mock chord analysis for URL: {url}")

    # Song-specific chord progressions for popular songs
    song_patterns = {
        "beat it": {
            "chords": ["Em", "Em", "Em", "Em", "C", "D", "Em", "Em",
                       "Em", "Em", "Em", "Em", "C", "D", "Em", "Em",
                       "G", "D", "Em", "Em", "G", "D", "Em", "Em",
                       "C", "D", "Em", "Em", "C", "D", "Em", "Em",
                       "Em", "Em", "Em", "Em", "C", "D", "Em", "Em",
                       "G", "D", "Em", "Em", "G", "D", "Em", "Em"],
            "duration": 258,
            "key": "E minor",
            "bpm": 138
        },
        "hotel california": {
            "chords": ["Bm", "F#", "A", "E", "G", "D", "Em", "F#",
                       "Bm", "F#", "A", "E", "G", "D", "Em", "F#"],
            "duration": 391,
            "key": "B minor",
            "bpm": 74
        },
        "wonderwall": {
            "chords": ["Em7", "G", "D", "C", "Em7", "G", "D", "C",
                       "C", "D", "Em7", "Em7", "C", "D", "G", "G"],
            "duration": 258,
            "key": "G major",
            "bpm": 87
        },
        "stairway to heaven": {
            "chords": ["Am", "C", "D", "F", "Am", "C", "D", "F",
                       "G", "Am", "Am", "Am", "C", "D", "F", "Am"],
            "duration": 482,
            "key": "A minor",
            "bpm": 82
        }
    }

    # Extract song name from URL or title
    song_key = None
    url_lower = url.lower()

    for song in song_patterns.keys():
        if song.replace(" ", "") in url_lower.replace("-", "").replace("_", "").replace(" ", ""):
            song_key = song
            break

    if song_key and song_key in song_patterns:
        pattern = song_patterns[song_key]
        chords = pattern["chords"]
        duration = pattern["duration"]
        key = pattern["key"]
        bpm = pattern["bpm"]
    else:
        # Default chord progression
        progressions = [
            ["C", "G", "Am", "F"],
            ["Am", "F", "C", "G"],
            ["Em", "C", "G", "D"],
            ["Dm", "G", "C", "Am"],
            ["F", "C", "G", "Am"]
        ]
        base_progression = random.choice(progressions)
        # Repeat and vary the progression
        chords = []
        for i in range(16):  # 16 chord changes
            chords.extend(base_progression)

        duration = random.randint(180, 300)
        keys = ["C major", "G major", "D major",
                "A major", "E major", "F major"]
        key = random.choice(keys)
        bpm = random.randint(80, 140)

    # Create timing for each chord
    chord_duration = duration / len(chords)
    chord_data = []

    for i, chord in enumerate(chords):
        start_time = i * chord_duration
        end_time = (i + 1) * chord_duration

        chord_data.append({
            "chord": chord,
            "start": round(start_time, 2),
            "end": round(end_time, 2),
            "confidence": round(random.uniform(0.8, 0.95), 2)
        })

    return chord_data


def generate_realistic_progression(key="C", num_chords=16):
    """
    Generate a realistic chord progression based on music theory
    """
    progressions_by_key = {
        "C": ["C", "F", "G", "Am", "Dm", "Em"],
        "G": ["G", "C", "D", "Em", "Am", "Bm"],
        "F": ["F", "Bb", "C", "Dm", "Gm", "Am"],
        "D": ["D", "G", "A", "Bm", "Em", "F#m"],
        "A": ["A", "D", "E", "F#m", "Bm", "C#m"],
        "E": ["E", "A", "B", "C#m", "F#m", "G#m"]
    }

    available_chords = progressions_by_key.get(key, progressions_by_key["C"])

    # Common progressions
    common_patterns = [
        [0, 3, 5, 1],  # I-vi-iii-IV
        [0, 5, 3, 1],  # I-iii-vi-IV
        [0, 1, 2, 0],  # I-IV-V-I
        [3, 1, 0, 2],  # vi-IV-I-V
    ]

    progression = []
    for _ in range(num_chords // 4):
        pattern = random.choice(common_patterns)
        for idx in pattern:
            progression.append(available_chords[idx])

    return progression[:num_chords]
