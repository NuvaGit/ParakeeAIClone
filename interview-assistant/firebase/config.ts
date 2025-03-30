import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

// 🔹 Firebase Config from Environment Variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// 🔹 Initialize Firebase App (Prevent re-initialization in Next.js)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// 🔹 Firebase Services
const auth = getAuth(app);
const functions = getFunctions(app);

// 🔹 Firestore initialization (simplified)
const db = getFirestore(app);

// Note: As of Firebase v9+, offline persistence is enabled by default
// for web applications, so explicit enableIndexedDbPersistence is no longer needed

// 🔹 Export Firebase Services
export { app, auth, db, functions };