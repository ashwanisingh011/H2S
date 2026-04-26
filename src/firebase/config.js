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
const getEnv = (key) => (window.__ENV__ && window.__ENV__[key]) || import.meta.env[key];

const firebaseConfig = {
  apiKey: getEnv('VITE_FIREBASE_API_KEY'),
  authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnv('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnv('VITE_FIREBASE_APP_ID'),
  measurementId: getEnv('VITE_FIREBASE_MEASUREMENT_ID'),
};

/** Initialized Firebase application instance */
let app;
export let db = null;
export let auth = null;
export let analytics = null;
export let perf = null;

try {
  if (firebaseConfig.apiKey) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    
    // Sign in anonymously immediately so writes are authenticated
    signInAnonymously(auth).catch(error => {
      console.warn("Anonymous auth failed (likely expected if config is incomplete):", error);
    });

    analytics = isAnalyticsSupported().then(yes => yes ? getAnalytics(app) : null);
    perf = getPerformance(app);
  } else {
    console.warn("Firebase configuration is missing. The app will run in degraded mode.");
  }
} catch (error) {
  console.error("Firebase initialization failed:", error);
}

export default app;
