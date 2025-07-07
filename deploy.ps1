# Full deployment PowerShell script for ChordsLegend

# Function for section headers
function Write-SectionHeader {
    param($message)
    Write-Host "▶ $message" -ForegroundColor Blue
    Write-Host "════════════════════════════════════════" -ForegroundColor Blue
}

Write-SectionHeader "Starting ChordsLegend Deployment"

# 1. Build the Expo web app
Write-SectionHeader "Building Expo Web App"
Write-Host "Building the React/Expo web app..." -ForegroundColor Cyan
npx expo export:web --clear
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Expo web build successful!" -ForegroundColor Green
}
else {
    Write-Host "✗ Expo web build failed!" -ForegroundColor Red
    exit 1
}

# 2. Copy web-build to server directory
Write-SectionHeader "Preparing Web Build for Server"
Write-Host "Copying web-build files to server/web-build..." -ForegroundColor Cyan
if (Test-Path "server\web-build") {
    Remove-Item -Path "server\web-build" -Recurse -Force
}
New-Item -ItemType Directory -Path "server\web-build" -Force | Out-Null
Copy-Item -Path "web-build\*" -Destination "server\web-build\" -Recurse -Force

# 3. Fix paths in web-build files
Write-Host "Fixing paths in web files..." -ForegroundColor Cyan
$indexPath = "server\web-build\index.html"
$indexContent = Get-Content $indexPath -Raw

# Replace incorrect paths with correct ones
$fixedContent = $indexContent -replace 'href="\\ismailfadlalla\\ChordsLegend\\', 'href="/'
$fixedContent = $fixedContent -replace '(src|href)="\/ismailfadlalla\/ChordsLegend\/', '$1="/'
$fixedContent = $fixedContent -replace '\\', '/'

# Save the fixed content
$fixedContent | Set-Content $indexPath

# Also fix manifest.json
$manifestPath = "server\web-build\manifest.json"
if (Test-Path $manifestPath) {
    Write-Host "Fixing paths in manifest.json..." -ForegroundColor Cyan
    $manifestContent = Get-Content $manifestPath -Raw
    $fixedManifest = $manifestContent -replace '\/ismailfadlalla\/ChordsLegend\/', '/'
    $fixedManifest = $fixedManifest -replace '\\ismailfadlalla\\ChordsLegend\\', '/'
    $fixedManifest | Set-Content $manifestPath
}

# 4. Add to git
Write-SectionHeader "Committing to Git"
git add server/web-build -f
git commit -m "Deploy web app to Railway"

# 5. Push to GitHub
Write-SectionHeader "Pushing to GitHub"
Write-Host "Pushing to GitHub to trigger Railway deployment..." -ForegroundColor Cyan
git push

Write-Host "✓ Deployment initiated!" -ForegroundColor Green
Write-Host "⚠ Railway deployment will take 3-5 minutes to complete." -ForegroundColor Yellow
Write-Host ""
Write-Host "Run the following to verify deployment:" -ForegroundColor Cyan
Write-Host "  node test-railway-deployment.js"
Write-Host ""
Write-Host "Your app will be available at:" -ForegroundColor Green
Write-Host "  https://chordslegend-production.up.railway.app/"
