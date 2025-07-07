$ErrorActionPreference = "Stop"

Write-Host "Preparing ChordsLegend for deployment..."

# Create web-build directory in server folder if it doesn't exist
if (-not (Test-Path "server\web-build")) {
    Write-Host "Creating server\web-build directory..."
    New-Item -ItemType Directory -Path "server\web-build" -Force | Out-Null
}

# Copy web-build contents to server/web-build
Write-Host "Copying web app files to server directory..."
Copy-Item -Path "web-build\*" -Destination "server\web-build\" -Recurse -Force

# Fix paths in index.html
Write-Host "Fixing paths in index.html..."
$indexPath = "server\web-build\index.html"
$indexContent = Get-Content $indexPath -Raw

# Replace incorrect paths with correct ones
$fixedContent = $indexContent -replace 'href="\\ismailfadlalla\\ChordsLegend\\', 'href="/'
$fixedContent = $fixedContent -replace '(src|href)="\/ismailfadlalla\/ChordsLegend\/', '$1="/'
$fixedContent = $fixedContent -replace 'href="(\/[^"]+)\\', 'href="$1/'
# Replace any remaining backslashes with forward slashes in href and src attributes
$fixedContent = $fixedContent -replace '(href|src)="([^"]*?)\\([^"]*?)"', '$1="$2/$3"'

# Save the fixed content
$fixedContent | Set-Content $indexPath

# Fix the manifest.json path
$manifestPath = "server\web-build\manifest.json"
if (Test-Path $manifestPath) {
    $manifestContent = Get-Content $manifestPath -Raw
    $fixedManifest = $manifestContent -replace '\/ismailfadlalla\/ChordsLegend\/', '/'
    $fixedManifest | Set-Content $manifestPath
}

Write-Host "Deployment preparation complete!"
Write-Host "Files ready for Railway deployment"
Write-Host "Next steps:"
Write-Host "1. Add the fixed files to git: git add server/web-build -f"
Write-Host "2. Commit: git commit -m 'Add web-build for Railway deployment'"
Write-Host "3. Push: git push"
