# Changelog

All notable changes to the CAPS Mobile project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Summary
This update turns the frontend into a configurable mobile-ready build instead of a web app that depends on one hardcoded backend URL. The main goal is to let the same build connect to local Docker, the shared AWS test server, or another custom API endpoint without editing source code and rebuilding each time.

### Added
- Android packaging support through Capacitor, including a committed `Frontend - Deployment/android` project, Gradle wrapper files, Android resources, splash assets, launcher icons, and native project metadata.
- `Frontend - Deployment/capacitor.config.json` to define the mobile app identity (`com.caps.mobile`), output directory (`dist`), native HTTP support, splash styling, status bar styling, and Android mixed-content behavior.
- `Frontend - Deployment/src/components/ServerConfigModal.jsx` to let users choose where the app should connect before or during use.
- `Frontend - Deployment/src/utils/config.js` to store and retrieve the selected API base URL from `localStorage`, so the chosen server survives reloads and app restarts.
- First-run server setup prompting in `Frontend - Deployment/src/App.jsx`, so a fresh install immediately asks for backend configuration instead of failing later on the login screen.
- A login-page shortcut for server setup plus a visible current-server indicator, making it easier to confirm which backend the app is using before signing in.
- A header-level "Server Configuration" action so authenticated users can switch environments without leaving the app.
- Android build helper scripts in `Frontend - Deployment/package.json`:
  - `npm run build:android`
  - `npm run open:android`
- This changelog file to document the mobile setup work and the related frontend behavior changes.

### Changed
- Replaced hardcoded `import.meta.env.VITE_API_BASE_URL` usage across the main frontend flow with `getApiUrl()` so the chosen server is used consistently across authentication, dashboards, subject management, exam generation, printing, account recovery, and auto-logout requests.
- Updated the login flow to use the saved server target, show connection context to the user, and surface clearer debugging information when the backend responds with invalid JSON, HTML, or network failures.
- Updated `Frontend - Deployment/vite.config.js` to build into `dist`, which is the directory Capacitor expects to sync into the Android app.
- Updated `Frontend - Deployment/package.json` and `Frontend - Deployment/package-lock.json` to add Capacitor dependencies and the CLI needed to build and open the Android project.
- Updated the frontend Docker build process with `Frontend - Deployment/.dockerignore` and a simpler install flow in `Frontend - Deployment/Dockerfile` so the web build is less affected by local machine artifacts such as `node_modules`, Android folders, IDE files, or incompatible lockfile/platform combinations.
- Branded the Android app as CAPS instead of the default generated naming in `Frontend - Deployment/android/app/src/main/res/values/strings.xml`.

### Fixed
- Prevented the common `/api/api/...` bug by stripping a trailing `/api` from saved base URLs before request paths are appended.
- Corrected the default shared test server target to `http://18.142.190.113:8000`, which matches the configuration exposed in the new server setup flow.
- Made local development more flexible by allowing the local Docker port to be edited instead of assuming a single fixed port.
- Added a built-in connection test in the server configuration modal so users can validate a target server before saving it.
- Enabled `android:usesCleartextTraffic="true"` in `Frontend - Deployment/android/app/src/main/AndroidManifest.xml` so the Android app can reach HTTP-based local or test servers on Android 9+.
- Enabled the Capacitor HTTP plugin in `Frontend - Deployment/capacitor.config.json` to support native-side HTTP handling for mobile scenarios where browser-style networking and CORS restrictions are a problem.
- Improved error messaging around connection failures so users get a useful reason when the app cannot reach the selected backend.

### Purpose And Impact
- The app can now be handed to testers without rebuilding for every environment change.
- Local laptop-based Docker testing is easier because testers can point the mobile app to a local IP and custom port.
- The same frontend codebase now supports both browser testing and Android packaging with less manual configuration.
- API endpoint handling is centralized, which reduces configuration drift and makes future environment changes easier to maintain.

### Scope Of Files Updated
- Entry and configuration flow:
  - `Frontend - Deployment/src/App.jsx`
  - `Frontend - Deployment/src/pages/Login.jsx`
  - `Frontend - Deployment/src/components/header.jsx`
  - `Frontend - Deployment/src/components/ServerConfigModal.jsx`
  - `Frontend - Deployment/src/utils/config.js`
- Widespread API URL refactor across forms, dashboards, subject pages, exam pages, printing, and account flows:(getApiUrl())
  - `AddQuestionForm.jsx`
  - `CombinedExamQuestionForm.jsx`
  - `CombinedPracticeQuestionForm.jsx`
  - `DuplicateQuestionForm.jsx`
  - `EditQuestionForm.jsx`
  - `PrintExamModal.jsx`
  - `SubjectSettingsDean.jsx`
  - `SubjectSettingsDeanProgChair.jsx`
  - `appVersion.jsx`
  - `forgotPassForm.jsx`
  - `resetPassForm.jsx`
  - `subjectCard.jsx`
  - `subjectCardFaculty.jsx`
  - `subjectCardProgramChair.jsx`
  - `subjectsDean.jsx`
  - `subjectsFaculty.jsx`
  - `subjectsProgramChair.jsx`
  - `userList.jsx`
  - `useAutoLogoutOnClose.js`
  - `AdminContent.jsx`
  - `AdminDashboard.jsx`
  - `AssoDeanContent.jsx`
  - `FacultyContent.jsx`
  - `PracticeExam.jsx`
  - `PracticeExamPreview.jsx`
  - `ProgramChairContent.jsx`
  - `Register.jsx`
  - `StudentDashboard.jsx`
- Android/mobile packaging:
  - `Frontend - Deployment/capacitor.config.json`
  - `Frontend - Deployment/android/...`
  - `Frontend - Deployment/vite.config.js`
  - `Frontend - Deployment/package.json`
  - `Frontend - Deployment/package-lock.json`
  - `Frontend - Deployment/.dockerignore`
  - `Frontend - Deployment/Dockerfile`

### Technical Notes
- App ID: `com.caps.mobile`
- App name: `CAPS`
- Default local setup: `http://<your-ip>:8005(change it to your port that use in docker)`
- Default test server: `http://18.142.190.113:8000`
- API base path: `/api` is still appended by the frontend request code
- Saved server configuration storage: `localStorage`
- Android web assets directory: `dist`

### Dependencies Added
- `@capacitor/android` `^8.1.0`
- `@capacitor/core` `^8.1.0`
- `@capacitor/preferences` `^8.0.1`
- `@capacitor/splash-screen` `^8.0.1`
- `@capacitor/status-bar` `^8.0.1`
- `@capacitor/cli` `^8.1.0`

## Notes

### Server Modes
The current mobile/frontend configuration supports three server targets:

1. Local Development: for a Docker or local backend running on your machine and exposed on your local network IP.
2. Test Server: for the shared AWS testing environment at `18.142.190.113:8000`.
3. Custom URL: for any other backend host, as long as the user enters the base URL without appending `/api`.

### Build Notes
To build and sync the Android app:

```bash
cd "Frontend - Deployment"
npm run build:android
npm run open:android
```

To run the frontend in the browser:

```bash
cd "Frontend - Deployment"
npm run dev
```
  
