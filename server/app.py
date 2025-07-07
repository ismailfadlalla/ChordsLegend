from flask import Flask, jsonify, request, send_from_directory
import json
import random
import os

app = Flask(__name__)

# Configure static folder for legal documents
app.static_folder = 'legal'

# Simple CORS handling
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

@app.route('/options', methods=['OPTIONS'])
def handle_options():
    return '', 204

@app.route('/')
def home():
    return jsonify({
        "message": "ChordsLegend API is running!",
        "status": "success",
        "version": "1.0.0",
        "endpoints": {
            "test_chords": "/api/test-chords",
            "analyze_song": "/api/analyze-song",
            "health": "/api/health"
        }
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "service": "ChordsLegend API",
        "timestamp": "2025-07-02"
    })

@app.route('/api/test-chords', methods=['GET'])
def test_chords():
    return jsonify({
        "chords": ["C", "G", "Am", "F"],
        "progression": "I-V-vi-IV", 
        "bpm": 120,
        "key": "C major"
    })

@app.route('/analyze', methods=['POST'])
def analyze_chords():
    try:
        data = request.get_json()
        youtube_url = data.get('youtube_url', '')
        
        if not youtube_url:
            return jsonify({
                "status": "error",
                "error": "YouTube URL is required"
            }), 400
        
        # Mock chord analysis - in a real implementation, this would:
        # 1. Download audio from YouTube URL
        # 2. Perform audio analysis
        # 3. Extract chord progressions
        
        mock_chords = [
            {"chord": "C", "time": 0, "confidence": 0.9},
            {"chord": "G", "time": 8, "confidence": 0.85},
            {"chord": "Am", "time": 16, "confidence": 0.88},
            {"chord": "F", "time": 24, "confidence": 0.92},
            {"chord": "C", "time": 32, "confidence": 0.87},
            {"chord": "G", "time": 40, "confidence": 0.91},
            {"chord": "Am", "time": 48, "confidence": 0.86},
            {"chord": "F", "time": 56, "confidence": 0.89},
        ]
        
        return jsonify({
            "status": "success",
            "chords": mock_chords,
            "duration": 180,
            "key": "C major",
            "bpm": random.randint(60, 140),
            "analysis_time": "2.3s"
        })
        
    except Exception as e:
        return jsonify({
            "status": "error",
            "error": str(e)
        }), 500

# Legal document routes
@app.route('/legal/<filename>')
def serve_legal_document(filename):
    """Serve legal documents (terms, privacy policy)"""
    try:
        # Serve from the legal directory
        return send_from_directory('legal', filename)
    except FileNotFoundError:
        return jsonify({
            "error": "Legal document not found",
            "available_documents": [
                "terms-of-service.html",
                "privacy-policy.html"
            ]
        }), 404

@app.route('/legal/')
def legal_index():
    """List available legal documents"""
    return jsonify({
        "message": "ChordsLegend Legal Documents",
        "available_documents": {
            "terms_of_service": "/legal/terms-of-service.html",
            "privacy_policy": "/legal/privacy-policy.html"
        },
        "note": "These documents are accessible for Pi Network compliance"
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print("🎵 Starting ChordsLegend API Server...")
    print(f"🌐 Server will be available at: http://0.0.0.0:{port}")
    print("🔧 CORS enabled for all origins")
    app.run(debug=False, host='0.0.0.0', port=port)