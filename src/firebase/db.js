import { db } from './config';
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { getAnalytics, logEvent, isSupported } from 'firebase/analytics';
import app from './config';

const SCORES_COLLECTION = 'scores';

/**
 * Save a quiz score to Firestore
 * @param {string} name - The player's name
 * @param {number} score - The quiz score
 * @param {string} persona - The chosen persona (voter/candidate/officer)
 * @returns {Promise<DocumentReference>}
 */
export async function saveScore(name, score, persona) {
  try {
    const docRef = await addDoc(collection(db, SCORES_COLLECTION), {
      name: name.trim() || 'Anonymous',
      score,
      persona,
      total: 3, // total questions
      timestamp: serverTimestamp()
    });

    // Log analytics event
    isSupported().then(yes => {
      if (yes) {
        const analytics = getAnalytics(app);
        logEvent(analytics, 'quiz_completed', { score, persona });
      }
    });

    return docRef;
  } catch (error) {
    console.error('Error saving score:', error);
    throw error;
  }
}

/**
 * Get the top scores from Firestore
 * @param {number} count - Number of top scores to fetch
 * @returns {Promise<Array>}
 */
export async function getTopScores(count = 10) {
  try {
    const q = query(
      collection(db, SCORES_COLLECTION),
      orderBy('score', 'desc'),
      orderBy('timestamp', 'asc'),
      limit(count)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc, index) => ({
      id: doc.id,
      rank: index + 1,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate()
    }));
  } catch (error) {
    console.error('Error fetching scores:', error);
    return [];
  }
}

/**
 * Log a persona selection analytics event
 * @param {string} persona
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
 * Log a journey started analytics event
 * @param {string} persona
 */
export function trackJourneyStarted(persona) {
  isSupported().then(yes => {
    if (yes) {
      const analytics = getAnalytics(app);
      logEvent(analytics, 'journey_started', { persona });
    }
  });
}
