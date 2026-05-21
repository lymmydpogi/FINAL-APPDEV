# Campana Designs — APPDEV (React Native) + WEBAPP (Symfony)

Mobile mirrors the **WEBAPP client area** (`/client`, services, contact, profile). Symfony JWT is the source of truth.

## API base URL

| Environment | `API_BASE_URL` |
|-------------|----------------|
| Android emulator | `http://10.0.2.2:8000` |
| iOS simulator / PC | `http://127.0.0.1:8000` |

See `.env.example` and `src/services/config.ts`.

## Auth

| Flow | Endpoint | Notes |
|------|----------|--------|
| Register | `POST /api/register` | Shows “Verify your email”; open link or deep link |
| Verify | `GET /api/verify-email/{token}` | Deep link: `campanadesigns://verify-email?token=...` |
| Login | `POST /api/login` | `{ email, password }` → JWT; blocked if `isVerified === false` |
| Google | `POST /api/auth/google` | Native Google **OAuth idToken** → Symfony JWT in **Redux** (Firebase sign-in is optional; backend does **not** accept Firebase JWT) |
| Session | `GET /api/me` | After redux-persist rehydrate (bootstrap saga) |
| Profile | `PATCH` / `POST /api/client/profile` | JSON or multipart (avatar) |

**Google:** Use the same Google Cloud project as WEBAPP `GOOGLE_CLIENT_ID`. OAuth consent screen app name must be **Campana Designs** (not Brevo). Register Android OAuth client (package `com.appdev` + SHA-1) and use Web client ID in `src/auth/googleWebClientId.ts`.

## UI when logged in

Matches website header: **Profile** + **Log out** only — no Log in / Register on tabs, landing, service detail, or contact.

## Manual test checklist

1. **Register** → verify email screen → open link → **Email verified** → **Login**
2. **Login** unverified → **Verify your email** screen (not main app)
3. **Google** new user → JWT → profile; returning user → same email
4. **Services** → brief (20+ chars) → success on Profile → row in `` `order` ``
5. **Contact** autofill when logged in
6. **Guest** cannot submit brief (redirect to Login)
7. **Logged in** — no “Log in” on Home; header shows Profile + Log out
8. **Profile** — avatar, first/last name, Save → “Profile updated successfully.”

## UI polish (app)

- **CampanaBackground** — soft cyan / indigo orbs on navy (no extra native deps).
- **Toasts** — `useToast()` for quick success / error feedback (wraps app in `ToastProvider`).
- **Glass cards** — elevated `Card` with shadows; **ScreenLayout** `ambient` for auth screens.
- **Typography** — hero / overline / title hierarchy in `src/theme/tokens.ts`.


- **Redux** `auth` slice holds JWT + user (`auth.data`)
- **redux-persist** writes `auth.data` to AsyncStorage (no direct `tokenStorage` usage)
- **Sagas** handle login, Google, logout, and bootstrap

## Run

```powershell
cd C:\Users\lyman\WEBAPP
symfony serve

cd c:\Campana\appdev
npm install
npx react-native start --reset-cache
npm run android
```

After adding `react-native-image-picker`, rebuild the native app.

## WEBAPP new endpoints

- `POST /api/auth/google`
- `POST|PATCH /api/client/profile` (multipart avatar)
- Extended `GET /api/me` — `avatarUrl`, `createdAt`, `firstName`, `lastName`

```powershell
cd C:\Users\lyman\WEBAPP
php bin/console cache:clear
```
