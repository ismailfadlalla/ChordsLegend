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

# Fix paths in index.html
Write-Host "🔧 Fixing paths in index.html..." -ForegroundColor Yellow
$indexPath = "server\web-build\index.html"
$indexContent = Get-Content $indexPath -Raw

# Replace incorrect paths with correct ones
$fixedContent = $indexContent -replace '(src|href)="\/ismailfadlalla\/ChordsLegend\/', '$1="/'

# Save the fixed content
$fixedContent | Set-Content $indexPath

# Fix the manifest.json path
$manifestPath = "server\web-build\manifest.json"
if (Test-Path $manifestPath) {
    $manifestContent = Get-Content $manifestPath -Raw
    $fixedManifest = $manifestContent -replace '\/ismailfadlalla\/ChordsLegend\/', '/'
    $fixedManifest | Set-Content $manifestPath
}

Write-Host "✅ Deployment preparation complete!" -ForegroundColor Green
Write-Host "🌐 Files ready for Railway deployment" -ForegroundColor Green
Write-Host "ℹ️ Next steps:" -ForegroundColor Blue
Write-Host "1. Add the fixed files to git: git add server/web-build -f" -ForegroundColor White
Write-Host "2. Commit: git commit -m 'Add web-build for Railway deployment'" -ForegroundColor White
Write-Host "3. Push: git push" -ForegroundColor White
