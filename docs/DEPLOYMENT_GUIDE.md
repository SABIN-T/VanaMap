# VanaMap Mobile App Deployment Guide

To launch VanaMap on the **Google Play Store** and **Apple App Store**, you cannot simply upload your website. You must wrap your web code into a "Native Mobile App" container.

The best way to do this for your existing React project is using **Capacitor**.

---

## 🚀 Phase 1: Technical Setup (Convert Website to App)

We will use **CapacitorJS** to wrap your build folder into an Android and iOS app.

### 1. Install Capacitor
Run these commands in your `frontend` folder:
```bash
npm install @capacitor/core
npm install -D @capacitor/cli
npx cap init
```
- **Name:** VanaMap
- **Package ID:** `com.vanamap.app` (This must be unique!)

### 2. Add Platforms
```bash
npm install @capacitor/android @capacitor/ios
npx cap add android
npx cap add ios
```

### 3. Build Your Web App
```bash
npm run build
npx cap sync
```
*This copies your `dist` folder into the Android/iOS native projects.*

---

## 🤖 Phase 2: Google Play Store (Android)

### Requirements
1.  **Google Play Developer Account**: One-time fee of **$25**.
2.  **Privacy Policy**: You must host a page (e.g., `vanamap.com/privacy`) explaining data usage.

### Steps to Build & Upload
1.  **Open Android Studio**:
    ```bash
    npx cap open android
    ```
2.  **Test:** Run the app in the Android Emulator to fix layout issues (Navbars can behave differently on phones).
3.  **Generate Signed Bundle (.aab)**:
    - Go to `Build > Generate Signed Bundle / APK`.
    - Create a "Keystore" (keep this password SAFE, or you lose access to update your app forever).
    - Select `release` mode.
4.  **Upload to Play Console**:
    - Create a new app release.
    - Upload the `.aab` file.
    - Fill out the "Main Store Listing" (Title, Description, Screenshots).
    - Submit for review (takes 2-7 days).

---

## 🍎 Phase 3: Apple App Store (iOS)

**CRITICAL REQUIREMENT:** You need a **Mac computer** to build the iOS app. You cannot do this on Windows.

### Requirements
1.  **Apple Developer Program**: Annual fee of **$99/year**.
2.  **Mac Device**: To run Xcode.

### Steps to Build & Upload
1.  **Open Xcode** (on a Mac):
    ```bash
    npx cap open ios
    ```
2.  **Configure Signing**: Login with your Apple ID in Xcode.
3.  **Test**: Run on the iOS Simulator.
4.  **Archive & Upload**:
    - Go to `Product > Archive`.
    - Once finished, click "Distribute App" -> "App Store Connect".
5.  **App Store Connect**:
    - Fill out compliance forms (encryption, privacy).
    - Add Screenshots (must be exact sizes: 6.5" and 5.5").
    - Submit for Review (Apple is strict; ensure no placeholder content remains).

---

## ✅ Phase 4: Final Checklist Before Submission

1.  **App Icon**: Generate icons for all sizes.
    - Use `cordova-res` or generic asset generators to create icons for `android/app/src/main/res`.
2.  **Offline Support**: Ensure the app shows a "No Internet" screen instead of a white blank page if offline.
3.  **Native Features**:
    - Does "Auto Detect Location" work? (You may need to add permissions in `AndroidManifest.xml` and `Info.plist`).
    - Does the Camera work for uploads?
4.  **Screenshots**: You need high-quality screenshots for the store listings. Use your "Generate Image" tool or take real device screenshots.

---

## ⚠️ Important Note on "Web vs Native"
Since VanaMap relies on a backend (Node/Mongo), your backend **MUST be hosted live** (e.g., on Render/Vercel) and the app must connect to that URL.
- **Do not use** `localhost` in your API calls for the mobile build.
- Update your `.env` to point `VITE_API_URL` to `https://api.vanamap.com` (your live server).
