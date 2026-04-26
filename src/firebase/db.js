/**
 * @fileoverview Firestore database operations and Firebase Analytics event tracking.
 * Provides functions to save quiz scores and retrieve the global leaderboard.
 */

import { db } from './config';
import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { getAnalytics, logEvent, isSupported } from 'firebase/analytics';
import app from './config';

/** Firestore collection name for quiz scores */
const SCORES_COLLECTION = 'scores';

/**
 * Saves a quiz score entry to Firestore.
 *
 * @param {string} name - The player's display name (max 30 characters)
 * @param {number} score - The number of correct answers
 * @param {string} persona - The selected persona ('voter' | 'candidate' | 'officer')
 * @returns {Promise<import('firebase/firestore').DocumentReference>} Reference to the created document
 * @throws Will throw if the Firestore write fails
 */
export async function saveScore(name, score, persona) {
  const docRef = await addDoc(collection(db, SCORES_COLLECTION), {
    name: name.trim() || 'Anonymous',
    score,
    persona,
    total: 3,
    timestamp: serverTimestamp()
  });

  // Fire analytics event asynchronously — does not block score submission
  isSupported().then(yes => {
    if (yes) {
      const analytics = getAnalytics(app);
      logEvent(analytics, 'quiz_completed', {
        score,
        persona,
        player_name: name.trim() || 'Anonymous'
      });
    }
  });

  return docRef;
}

/**
 * Subscribes to a real-time stream of the top scores from Firestore.
 * Uses `onSnapshot` for live updates — the leaderboard refreshes automatically
 * when new scores are submitted by any user anywhere in the world.
 *
 * @param {number} count - Maximum number of scores to retrieve (default: 10)
 * @param {function(Array<object>): void} callback - Called with the latest scores array on every update
 * @returns {function} Unsubscribe function — call to stop listening
 */
export function subscribeToTopScores(count = 10, callback) {
  const q = query(
    collection(db, SCORES_COLLECTION),
    orderBy('score', 'desc'),
    orderBy('timestamp', 'asc'),
    limit(count)
  );

  return onSnapshot(q, snapshot => {
    const scores = snapshot.docs.map((doc, index) => ({
      id: doc.id,
      rank: index + 1,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate()
    }));
    callback(scores);
  }, error => {
    console.error('Leaderboard subscription error:', error);
    callback([]);
  });
}

/**
 * Logs a Firebase Analytics event when a user selects a persona.
 *
 * @param {string} persona - The persona ID selected by the user
 * @returns {void}
 */
export function trackPersonaSelected(persona) {
  isSupported().then(yes => {
    if (yes) {
      const analytics = getAnalytics(app);
      logEvent(analytics, 'persona_selected', { persona });
    }
  });
}

/**
 * Logs a Firebase Analytics event when a user starts the journey timeline.
 *
 * @param {string} persona - The active persona ID
 * @returns {void}
 */
export function trackJourneyStarted(persona) {
  isSupported().then(yes => {
    if (yes) {
      const analytics = getAnalytics(app);
      logEvent(analytics, 'journey_started', { persona });
    }
  });
}
