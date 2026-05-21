import { Platform } from 'react-native';

/**
 * Symfony WEBAPP base URL (no trailing slash).
 * Android emulator: http://10.0.2.2:8000
 * iOS simulator / PC: http://127.0.0.1:8000
 * Physical device: copy apiConfig.override.example.ts → apiConfig.override.ts with your LAN IP.
 */
let overrideBaseUrl: string | undefined;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  overrideBaseUrl = require('./apiConfig.override').API_BASE_URL as string;
} catch {
  overrideBaseUrl = undefined;
}

export const API_BASE_URL =
  overrideBaseUrl?.trim() ||
  (Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://127.0.0.1:8000');
