import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAI6ymMD18qwJSDpvfnP4KmELj0mlf0zXw",
  authDomain: "election-education-f3282.firebaseapp.com",
  projectId: "election-education-f3282",
  storageBucket: "election-education-f3282.firebasestorage.app",
  messagingSenderId: "996104706188",
  appId: "1:996104706188:web:d24ba8fb69a10c4a13c3a9",
  measurementId: "G-J4H1DJ1NRG"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Initialize Analytics only in browser environments
export const analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);

export default app;
