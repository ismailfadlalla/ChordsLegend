# Pi Network Sandbox Testing Guide

## Overview

This guide explains how to test ChordsLegend in Pi Network's sandbox environment as required for app submission.

## Pi Network Testing Requirements

According to Pi Network's instructions, you need to:

1. **Set sandbox flag to "true"** ✅ COMPLETED
2. **Copy URL from dev portal and paste in desktop browser**
3. **Enter provided code in Pi Mining App utilities page**
4. **Test your browser in sandbox mode connected to Pi account**

## Current Configuration

### ✅ Sandbox Mode Enabled

```javascript
// In src/config/piConfig.ts
SANDBOX_MODE: true,
SDK_CONFIG: {
  version: "2.0",
  sandbox: true,
  environment: 'sandbox'
}
```

### ✅ Pi Browser Detection

The app automatically detects when running in Pi Browser:

- Checks for `PiBrowser` user agent
- Detects `minepi.com` or `pi.network` domains
- Looks for Pi SDK global objects
- Identifies sandbox URLs

### ✅ Pi SDK Integration

```javascript
// Automatic Pi SDK initialization
await window.Pi.init({
  version: '2.0',
  sandbox: true,
});
```

## Testing Process

### Step 1: Deploy to Pi Network Sandbox

1. **Get your sandbox URL from Pi Developer Portal:**

   ```
   https://sandbox.minepi.com/app/chords-legend
   ```

2. **Make sure app is accessible at this URL**

### Step 2: Pi Mining App Setup

1. Open Pi Mining App on your phone
2. Go to menu (top left)
3. Find "Utilities" page
4. Enter the code provided by Pi Network Developer Portal
5. This puts your browser in sandbox mode

### Step 3: Test in Desktop Browser

1. Open desktop browser
2. Navigate to your sandbox URL
3. Browser should now be connected to your Pi account
4. Test all app functionality

## App Features to Test

### ✅ Core Functionality

- [ ] App loads correctly in Pi Browser
- [ ] Authentication flow works
- [ ] Chord progression features function
- [ ] Fretboard interaction works
- [ ] YouTube integration functions

### ✅ Pi-Specific Features

- [ ] Pi SDK initializes correctly
- [ ] Sandbox mode is detected
- [ ] Pi authentication works (if implemented)
- [ ] Payment flow works (if implemented)

### ✅ Legal Requirements

- [ ] Terms of Service accessible
- [ ] Privacy Policy accessible
- [ ] Pi Network integration properly disclosed

## Deployment Instructions

### Option 1: Use Railway (Current Setup)

The app is already deployed at:

```
https://chordslegend-production.up.railway.app
```

You may need to configure Pi Network to point to this URL.

### Option 2: Build and Deploy Static Files

```bash
# Build for production
cd e:\ChordsLegend
npx expo export:web

# Deploy the web-build folder to your Pi Network app URL
# Copy contents of web-build/ to your Pi Network hosting
```

### Option 3: Local Testing Server

```bash
# Serve locally for testing
cd e:\ChordsLegend
npx expo export:web
cd web-build
npx serve -s . -p 3000

# Make accessible on network
npx serve -s . -p 3000 -h 0.0.0.0
```

## Verification Checklist

### ✅ Pre-Testing

- [x] Sandbox mode enabled (`SANDBOX_MODE: true`)
- [x] Pi SDK configuration correct
- [x] App builds without errors
- [x] Legal documents accessible
- [x] No competitor references in code

### 🔄 During Pi Network Testing

- [ ] App loads in Pi Browser sandbox
- [ ] Pi SDK detects sandbox environment
- [ ] Console shows correct initialization logs
- [ ] All features work as expected
- [ ] No JavaScript errors in browser console

### 📊 Post-Testing

- [ ] Document any issues found
- [ ] Verify all Pi Network requirements met
- [ ] Submit for Pi Network review

## Troubleshooting

### App Not Loading in Pi Browser

1. Check browser console for errors
2. Verify Pi SDK is available (`window.Pi`)
3. Check network connectivity
4. Ensure sandbox URL is correct

### Pi SDK Not Initializing

1. Verify sandbox mode is enabled
2. Check Pi SDK version compatibility
3. Ensure proper permissions in Pi Browser

### Authentication Issues

1. Verify Pi account is properly set up
2. Check sandbox mode configuration
3. Ensure proper scopes are requested

## Console Output

When running correctly, you should see:

```
🥧 Pi Network SDK detected
🥧 Pi SDK initialized in sandbox mode
ChordsLegend running in Pi Browser environment
Sandbox mode: true
Environment: sandbox
```

## Support

If you encounter issues during Pi Network testing:

1. Check the browser console for error messages
2. Verify all configuration settings
3. Contact Pi Network Developer Support
4. Reference this documentation

---

**Status:** ✅ Ready for Pi Network Sandbox Testing
**Last Updated:** July 7, 2025
**Version:** 2.0.0 - Pi Network Ready
