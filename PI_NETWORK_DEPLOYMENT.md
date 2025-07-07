# Pi Network Sandbox Deployment Guide

## 🚀 For Pi Network Submission: https://sandbox.minepi.com/app/chords-legend

This guide explains how to deploy ChordsLegend for Pi Network's sandbox testing environment.

## 📋 Prerequisites

1. **Pi Network Developer Account**: Registered at https://developers.minepi.com/
2. **App Registration**: App registered with username `chords-legend`
3. **Built Web App**: Production build of ChordsLegend

## 🛠️ Deployment Steps

### Step 1: Build for Production

```bash
cd e:\ChordsLegend
npx expo export:web --clear
```

### Step 2: Serve Locally for Testing

```bash
npx serve web-build -s -l 3000
```

- **Local URL**: http://localhost:60752
- **Network URL**: http://192.168.1.118:60752

### Step 3: Deploy to Pi Network Hosting

#### Option A: Upload to Pi Network Hosting

1. Zip the `web-build` folder contents
2. Upload to Pi Network Developer Portal
3. Set the app URL to: `https://sandbox.minepi.com/app/chords-legend`

#### Option B: Use External Hosting (Railway)

1. Deploy `web-build` contents to Railway/Vercel/Netlify
2. Configure Pi Network to point to your external URL
3. Ensure HTTPS and proper CORS headers

## 🔧 Pi Browser Configuration

### Automatic Pi Browser Detection

The app automatically detects Pi Browser environment:

```typescript
// In piSandboxConfig.ts
isPiBrowser: () => {
  return (
    window.navigator.userAgent.includes('PiBrowser') ||
    window.location.hostname.includes('minepi.com') ||
    window.location.hostname.includes('sandbox.minepi.com')
  );
};
```

### Pi SDK Integration

- **Sandbox Mode**: Enabled for testing
- **Authentication Scopes**: `['username', 'payments']`
- **Payment Features**: Test mode enabled

## 📱 Testing in Pi Browser

### Access Methods

1. **Pi Mobile App**: Open Pi Browser → Apps → ChordsLegend
2. **Direct URL**: https://sandbox.minepi.com/app/chords-legend
3. **Pi Desktop**: Use Pi Network desktop app

### Test Scenarios

- ✅ App loads in Pi Browser
- ✅ Pi SDK initialization works
- ✅ User authentication flows
- ✅ Payment testing (sandbox mode)
- ✅ All core app features functional

## 🎯 Pi Network Submission Checklist

### Required Information

- [x] **App Name**: ChordsLegend
- [x] **App Username**: chords-legend
- [x] **Description**: Professional chord detection with Pi integration
- [x] **Category**: Music & Audio
- [x] **Version**: 2.0.0

### Legal Documents (Accessible URLs)

- [x] **Terms of Service**: https://chordslegend-production.up.railway.app/legal/terms-of-service.html
- [x] **Privacy Policy**: https://chordslegend-production.up.railway.app/legal/privacy-policy.html

### Technical Requirements

- [x] **HTTPS Enabled**: Required for Pi Browser
- [x] **Mobile Responsive**: Enhanced fretboard for touch devices
- [x] **Pi SDK Integration**: Sandbox configuration ready
- [x] **Payment Integration**: Test mode configured

### App Features for Pi Network

- [x] **Basic Chord Detection**: Free feature
- [x] **Premium Chord Library**: 1 Pi payment
- [x] **YouTube Synchronization**: 1.5 Pi payment
- [x] **AI Chord Recognition**: 2 Pi payment
- [x] **Offline Mode**: 0.5 Pi payment

## 🌐 Deployment URLs

### Current Deployment

- **Local Development**: http://localhost:60752
- **Network Access**: http://192.168.1.118:60752
- **Production Build**: Ready in `web-build/` folder

### Pi Network URLs

- **Sandbox**: https://sandbox.minepi.com/app/chords-legend
- **Production**: https://app.minepi.com/chords-legend (after approval)

## 🔒 Environment Variables for Pi

Ensure these are configured in your deployment:

```env
# Pi Network Configuration
PI_API_KEY=your_pi_api_key
PI_APP_ID=your_pi_app_id
PI_APP_USERNAME=chords-legend
PI_ENVIRONMENT=sandbox
PI_DEVELOPER_ID=your_developer_id
PI_APP_SECRET=your_app_secret

# Standard App Configuration
FIREBASE_API_KEY=your_firebase_key
YOUTUBE_API_KEY=your_youtube_key
```

## 📞 Support & Troubleshooting

### Common Issues

1. **App won't load in Pi Browser**: Check HTTPS and CORS
2. **Pi SDK errors**: Verify sandbox configuration
3. **Payment testing fails**: Ensure test mode enabled

### Pi Network Support

- **Developer Portal**: https://developers.minepi.com/
- **Documentation**: https://developers.minepi.com/docs
- **Support**: Through Pi Network Developer Portal

## ✅ Ready for Submission

The app is now configured and ready for Pi Network submission:

1. **Upload built files** to Pi Network hosting
2. **Configure sandbox URL**: https://sandbox.minepi.com/app/chords-legend
3. **Submit for review** through Pi Developer Portal
4. **Test in Pi Browser** using the sandbox environment

---

**Build Status**: ✅ Production Ready  
**Pi Integration**: ✅ Sandbox Configured  
**Legal Compliance**: ✅ All documents accessible  
**Mobile Optimized**: ✅ Enhanced for touch devices
