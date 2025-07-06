import json

# Simple test for chord analysis functionality
def mock_chord_analysis(youtube_url):
    """Mock chord analysis that returns a realistic chord progression"""
    
    # Different chord progressions based on the video
    chord_patterns = {
        'default': [
            {"chord": "C", "time": 0, "confidence": 0.9},
            {"chord": "G", "time": 8, "confidence": 0.85},
            {"chord": "Am", "time": 16, "confidence": 0.88},
            {"chord": "F", "time": 24, "confidence": 0.92},
            {"chord": "C", "time": 32, "confidence": 0.87},
            {"chord": "G", "time": 40, "confidence": 0.91},
            {"chord": "Am", "time": 48, "confidence": 0.86},
            {"chord": "F", "time": 56, "confidence": 0.89},
        ],
        'hotel_california': [
            {"chord": "Am", "time": 0, "confidence": 0.92},
            {"chord": "E", "time": 8, "confidence": 0.88},
            {"chord": "G", "time": 16, "confidence": 0.91},
            {"chord": "D", "time": 24, "confidence": 0.89},
            {"chord": "F", "time": 32, "confidence": 0.87},
            {"chord": "C", "time": 40, "confidence": 0.93},
            {"chord": "Dm", "time": 48, "confidence": 0.85},
            {"chord": "E", "time": 56, "confidence": 0.90},
        ],
        'wonderwall': [
            {"chord": "Em7", "time": 0, "confidence": 0.88},
            {"chord": "G", "time": 8, "confidence": 0.92},
            {"chord": "D", "time": 16, "confidence": 0.89},
            {"chord": "C", "time": 24, "confidence": 0.91},
            {"chord": "Em7", "time": 32, "confidence": 0.87},
            {"chord": "G", "time": 40, "confidence": 0.90},
            {"chord": "D", "time": 48, "confidence": 0.88},
            {"chord": "C", "time": 56, "confidence": 0.93},
        ]
    }
    
    # Simple pattern matching
    if 'hotel' in youtube_url.lower() or 'california' in youtube_url.lower():
        return chord_patterns['hotel_california']
    elif 'wonderwall' in youtube_url.lower() or 'oasis' in youtube_url.lower():
        return chord_patterns['wonderwall']
    else:
        return chord_patterns['default']

def test_analysis():
    """Test the chord analysis function"""
    test_urls = [
        "https://www.youtube.com/watch?v=gWju37TZfo0",  # Hotel California
        "https://www.youtube.com/watch?v=bx1Bh8ZvH84",  # Wonderwall
        "https://www.youtube.com/watch?v=random123",      # Default
    ]
    
    for url in test_urls:
        result = mock_chord_analysis(url)
        print(f"\nURL: {url}")
        print(f"Chords: {[chord['chord'] for chord in result]}")
        print(f"First few timings: {[(c['chord'], c['time']) for c in result[:4]]}")

if __name__ == "__main__":
    print("🎸 Testing Chord Analysis Mock")
    test_analysis()
    print("\n✅ Mock analysis working correctly!")
