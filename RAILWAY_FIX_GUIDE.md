# Railway Deployment Fix Guide

## 🚨 Current Issue

Railway is still using the old "ChordsLegend-v2" repository connection, causing:

- Deployment URL: `chordslegend-v2-production.up.railway.app` (old)
- Should be: `chordslegend-production.up.railway.app` (new)

## 🔧 How to Fix

### Step 1: Update Railway Project

1. Go to Railway Dashboard: https://railway.app/dashboard
2. Find your project (ChordsLegend-v2)
3. **Settings** → **Repository**
4. **Disconnect** old repository
5. **Connect** to new "ChordsLegend" repository
6. **Update project name** to "ChordsLegend"

### Step 2: Redeploy with New Configuration

```bash
cd e:\ChordsLegend
railway login
railway link
railway up
```

### Step 3: Update URLs in Code

After Railway gives you the new URL, update:

- Legal document links
- API endpoints
- App configuration

## 🎯 Expected New URLs

- **New Railway URL**: `chordslegend-production.up.railway.app`
- **Terms**: `https://chordslegend-production.up.railway.app/legal/terms-of-service.html`
- **Privacy**: `https://chordslegend-production.up.railway.app/legal/privacy-policy.html`

## ✅ What We've Already Updated

- [x] railway.json configuration
- [x] Project name to "ChordsLegend"
- [x] Service name to "chordslegend-production"

## 🚀 Next Steps

1. **Deploy with new configuration**
2. **Update all URL references**
3. **Test legal document accessibility**
4. **Update Pi Network submission with correct URLs**
