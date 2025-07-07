# Railway Deployment Fix

## Current Issue

The legal documents are returning "Not Found" when accessed from the deployed Railway server, even though they work locally.

## Diagnosis

The Flask server has the correct routes in `app.py`:

- `/legal/terms-of-service.html`
- `/legal/privacy-policy.html`

## Potential Causes:

1. **Railway deployment issue**: Files not properly uploaded
2. **Path configuration**: Flask not finding the legal directory
3. **Static file serving**: Railway might need specific configuration

## Solutions to Try:

### 1. Check Current Deployment

Visit: https://chordslegend-production.up.railway.app/legal/
This should show available legal documents.

### 2. Manual Deployment via Git

```bash
# Push latest changes to GitHub
git add .
git commit -m "Fix legal document serving on Railway"
git push origin main

# Railway should auto-deploy from GitHub
```

### 3. Alternative: Use Railway Dashboard

1. Go to Railway dashboard
2. Check deployment logs
3. Redeploy manually if needed
4. Verify file structure in deployment

### 4. Test Endpoints

After deployment, test:

- https://chordslegend-production.up.railway.app/legal/
- https://chordslegend-production.up.railway.app/legal/terms-of-service.html
- https://chordslegend-production.up.railway.app/legal/privacy-policy.html

## Quick Fix Commands

```bash
# Ensure all files are committed
git status
git add server/legal/
git commit -m "Ensure legal documents are in deployment"
git push origin main
```
