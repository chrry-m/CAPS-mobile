# Android Studio deployment (based on CHANGELOG.md)

## Project location
`Frontend - Deployment/android`

## Prerequisites
- Node.js + npm installed.
- Android Studio + Android SDK installed.

## Build and sync Android assets
1. Open a terminal at the repo root.
2. Run:

```bash
cd "Frontend - Deployment"

# Build web assets and sync them into the Android project
npm run build:android

# Open the Android project in Android Studio
npm run open:android
```

## Configure the server target (inside the app)
- On first run, the app prompts for the backend server.
- Choose one:
  - Local Docker server: `http://<your-ip>:8000` (change the port to match your Docker backend).
  - Test server: `http://18.142.190.113:8000`.
  - Custom URL: any backend base URL (do not append `/api`).

## Run or build from Android Studio
- Use Run to install the debug build on device/emulator.
- Build -> Generate Signed Bundle / APK for release.

## Notes
- App ID: `com.caps.mobile`
- App name: `CAPS`
- Android web assets directory: `dist`