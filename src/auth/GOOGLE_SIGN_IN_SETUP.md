# Google Sign-In + Firebase Auth (Android, `com.appdev`)

## Already in the repo

- `android/app/google-services.json` with package `com.appdev`
- Gradle: `com.google.gms.google-services` plugin on `:app`
- `@react-native-firebase/app`, `@react-native-firebase/auth`, `@react-native-google-signin/google-signin`
- `src/auth/googleWebClientId.ts` — must be the **Web** OAuth client ID (same idea as `client_type: 3` in `google-services.json`)

## Firebase Console (required)

1. **Authentication → Sign-in method → Google** — enable the provider.
2. **Project settings → Your apps → Android (`com.appdev`)** — add **SHA-1** (and SHA-256) for every keystore you use:
   - Debug: from `./gradlew signingReport` (variant `debug`)
   - Release: same for your release keystore  
   Missing SHA → Android `DEVELOPER_ERROR` (code `10`) or sign-in failures.

## After changing native deps

```bash
cd android
./gradlew clean
cd ..
npx react-native run-android
```

## Optional

- **iOS:** add URL types / `GoogleService-Info.plist` and configure the Google Sign-In iOS client ID per library docs.
