$ErrorActionPreference = "Stop"

Write-Host "🚀 Preparing ChordsLegend for deployment..." -ForegroundColor Green

# Create web-build directory in server folder if it doesn't exist
if (-not (Test-Path "server\web-build")) {
    Write-Host "📁 Creating server\web-build directory..." -ForegroundColor Cyan
    New-Item -ItemType Directory -Path "server\web-build" -Force | Out-Null
}

# Copy web-build contents to server/web-build
Write-Host "📋 Copying web app files to server directory..." -ForegroundColor Cyan
Copy-Item -Path "web-build\*" -Destination "server\web-build\" -Recurse -Force

Write-Host "✅ Deployment preparation complete!" -ForegroundColor Green
Write-Host "🌐 Files ready for Railway deployment" -ForegroundColor Green
