# 🔧 Firebase "Not Connected" Troubleshooting Guide

## Quick Diagnosis Steps

### Step 1: Check Internet Connection

- Make sure your device has internet access
- Try opening a website in your browser

### Step 2: Verify Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Look for a project called **"chords-legend"**
3. If you don't see it, the project may not exist or you may not have access

### Step 3: Check Authentication Setup

If the project exists:

1. Click on the "chords-legend" project
2. Go to **Authentication** in the left sidebar
3. Click on **Sign-in method** tab
4. Verify that **Email/Password** is **Enabled**

### Step 4: Verify Project Configuration

In the Firebase Console:

1. Go to **Project Settings** (gear icon)
2. Scroll down to **Your apps** section
3. Look for an Android app with the ID: `com.chordslegend`
4. Check if the configuration matches what's in your `.env` file

## Common Issues and Solutions

### Issue 1: Project Doesn't Exist

**Problem:** The Firebase project "chords-legend" doesn't exist
**Solution:**

- Create a new Firebase project
- Or ask for access to the existing project
- Or update the configuration to point to your own project

### Issue 2: Authentication Not Enabled

**Problem:** Authentication is disabled in Firebase Console
**Solution:**

1. Go to Firebase Console → Authentication
2. Click "Get started" if you see it
3. Go to Sign-in method tab
4. Enable "Email/Password" provider

### Issue 3: Wrong Configuration

**Problem:** The configuration in `.env` doesn't match the Firebase project
**Solution:**

1. Go to Firebase Console → Project Settings
2. Scroll to "Your apps" section
3. Copy the configuration values
4. Update your `.env` file with the correct values

### Issue 4: Network/Firewall Issues

**Problem:** Your network blocks Firebase
**Solution:**

- Try using mobile data instead of WiFi
- Check if your firewall blocks Firebase domains
- Try from a different network

## Testing Your Fix

After making changes:

1. **Restart Expo:** `npx expo start --clear`
2. **Open AuthTestScreen:** Use the "Auth Debug" button in the app
3. **Run Connection Tests:** Tap "Run Connection Tests"
4. **Check the logs:** Look for "Firebase connection: SUCCESS"

## Manual Firebase Project Setup

If you need to create your own Firebase project:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Name it anything you want (e.g., "my-chords-app")
4. Enable Google Analytics (optional)
5. Go to Authentication → Sign-in method
6. Enable Email/Password
7. Go to Project Settings
8. Add an Android app with package name: `com.chordslegend`
9. Copy the configuration values to your `.env` file

## What the Logs Should Show

When working correctly, you should see:

```
✅ Firebase configuration is complete
✅ Firebase Auth API is reachable
Firebase connection: SUCCESS
```

When not working, you might see:

```
❌ No internet connection
❌ Specific issue connecting to Firebase
Firebase connection: FAILED
```
