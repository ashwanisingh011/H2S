/**
 * @fileoverview Firebase app initialization and service exports.
 * Configuration values are read from environment variables (VITE_ prefix)
 * to ensure no secrets are committed to source control.
 *
 * @see https://firebase.google.com/docs/web/setup
 * @see .env.example for required environment variable names
 */

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

/**
 * Firebase project configuration sourced from environment variables.
 * All VITE_ prefixed variables are injected at build time by Vite.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

/** Initialized Firebase application instance */
const app = initializeApp(firebaseConfig);

/** Firestore database instance for reading and writing quiz scores */
export const db = getFirestore(app);

/**
 * Firebase Analytics instance — only initialized in browser environments
 * that support the Analytics API (not available in all regions or SSR contexts).
 */
export const analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);

export default app;
