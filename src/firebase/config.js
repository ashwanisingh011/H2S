/**
 * @fileoverview Firebase app initialization and service exports.
 * Configuration values are read from environment variables (VITE_ prefix)
 * to ensure no secrets are committed to source control.
 *
 * @see https://firebase.google.com/docs/web/setup
 */

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported as isAnalyticsSupported } from 'firebase/analytics';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getPerformance } from 'firebase/performance';

/**
 * Firebase project configuration sourced from environment variables.
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

/** Firebase Authentication instance to secure writes via anonymous sign-in */
export const auth = getAuth(app);

// Sign in anonymously immediately so writes are authenticated
signInAnonymously(auth).catch(error => {
  console.error("Anonymous auth failed:", error);
});

/**
 * Firebase Analytics instance — only initialized in browser environments
 * that support the Analytics API.
 */
export const analytics = isAnalyticsSupported().then(yes => yes ? getAnalytics(app) : null);

/** Firebase Performance Monitoring to automatically track page loads and network requests */
export const perf = getPerformance(app);

export default app;
