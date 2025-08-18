"""
ChordsLegend Simplified Flask API Server
A simplified version of the main server for testing and development
"""
from flask import Flask, jsonify, request, send_from_directory
import os
import random

app = Flask(__name__)

# Path to the web-build directory - always look in current directory for Railway
WEB_BUILD_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'web-build')

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

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "service": "ChordsLegend API",
        "timestamp": "2025-07-07",
        "web_build_exists": os.path.exists(WEB_BUILD_PATH)
    })

# Test chords endpoint
@app.route('/api/test-chords', methods=['GET'])
def test_chords():
    return jsonify({
        "chords": ["C", "G", "Am", "F"],
        "progression": "I-V-vi-IV", 
        "bpm": 120,
        "key": "C major"
    })

# Analyze song endpoint
@app.route('/api/analyze-song', methods=['POST'])
def analyze_song():
    try:
        data = request.json or {}
        url = data.get('url', '')
        
        # Mock response
        mock_chords = ["C", "G", "Am", "F", "C", "G", "F"]
        
        return jsonify({
            "status": "success",
            "url": url,
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

# Main route - serve React app or API
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_app(path):
    # If API route is explicitly requested, handle it above
    if path.startswith('api/'):
        return jsonify({"error": "API endpoint not found"}), 404
        
    # If requesting legal documents
    if path.startswith('legal/'):
        filename = path.replace('legal/', '')
        return serve_legal_document(filename)
        
    # Check if path exists in web-build
    if path and os.path.exists(os.path.join(WEB_BUILD_PATH, path)):
        return send_from_directory(WEB_BUILD_PATH, path)
    
    # Check if it's an API request by content type
    accept_header = request.headers.get('Accept', '')
    if 'application/json' in accept_header and not path:
        return jsonify({
            "message": "ChordsLegend API is running!",
            "status": "success",
            "version": "1.0.0",
            "web_build_path": WEB_BUILD_PATH,
            "web_build_exists": os.path.exists(WEB_BUILD_PATH),
            "endpoints": {
                "test_chords": "/api/test-chords",
                "analyze_song": "/api/analyze-song",
                "health": "/api/health"
            }
        })
        
    # Otherwise serve the index.html from web-build (React app)
    if os.path.exists(WEB_BUILD_PATH):
        return send_from_directory(WEB_BUILD_PATH, 'index.html')
    else:
        return jsonify({
            "error": "Web app not found",
            "message": "React app is not built or deployed",
            "web_build_path": WEB_BUILD_PATH
        }), 404

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    
    print("🎵 Starting ChordsLegend Server...")
    print(f"🌐 Server will be available at: http://0.0.0.0:{port}")
    print("🔧 CORS enabled for all origins")
    
    # Verify web build exists
    if os.path.exists(WEB_BUILD_PATH):
        print("✅ Web build found at:", WEB_BUILD_PATH)
        print("📱 React Native web app will be served")
        # List some files to verify
        try:
            files = os.listdir(WEB_BUILD_PATH)[:5]  # First 5 files
            print("📂 Web build contains:", files)
        except:
            print("⚠️ Could not list web build contents")
    else:
        print("❌ Web build not found at:", WEB_BUILD_PATH)
        print("⚠️ Only API endpoints will be available")
    
    app.run(debug=False, host='0.0.0.0', port=port)
