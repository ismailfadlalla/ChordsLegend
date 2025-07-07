$ErrorActionPreference = "Stop"

Write-Host "Starting ChordsLegend Deployment" -ForegroundColor Green

# 1. Build the Expo web app
Write-Host "Building Expo web app..." -ForegroundColor Cyan
npx expo export:web --clear

if ($LASTEXITCODE -ne 0) {
    Write-Host "Expo build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Build successful!" -ForegroundColor Green

# 2. Copy web-build to server directory
Write-Host "Copying files to server..." -ForegroundColor Cyan
if (Test-Path "server\web-build") {
    Remove-Item -Path "server\web-build" -Recurse -Force
}
New-Item -ItemType Directory -Path "server\web-build" -Force | Out-Null
Copy-Item -Path "web-build\*" -Destination "server\web-build\" -Recurse -Force

# 3. Fix paths in index.html
Write-Host "Fixing paths..." -ForegroundColor Cyan
$indexFile = "server\web-build\index.html"
if (Test-Path $indexFile) {
    (Get-Content $indexFile) -replace '/ismailfadlalla/ChordsLegend/', '/' | Set-Content $indexFile
    (Get-Content $indexFile) -replace '\\ismailfadlalla\\ChordsLegend\\', '/' | Set-Content $indexFile
}

# 4. Commit and push
Write-Host "Committing to git..." -ForegroundColor Cyan
git add server/web-build -f
git commit -m "Fix deployment - update web build"
git push

Write-Host "Deployment complete!" -ForegroundColor Green
Write-Host "Check: https://chordslegend-production.up.railway.app/" -ForegroundColor Yellow
