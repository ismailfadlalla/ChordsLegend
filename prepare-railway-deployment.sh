#!/bin/bash
# Deployment script for Railway

echo "🚀 Preparing ChordsLegend for deployment..."

# Create web-build directory in server folder if it doesn't exist
if [ ! -d "server/web-build" ]; then
  echo "📁 Creating server/web-build directory..."
  mkdir -p server/web-build
fi

# Copy web-build contents to server/web-build
echo "📋 Copying web app files to server directory..."
cp -r web-build/* server/web-build/

echo "✅ Deployment preparation complete!"
echo "🌐 Files ready for Railway deployment"
