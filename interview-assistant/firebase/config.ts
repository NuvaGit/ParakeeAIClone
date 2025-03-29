// firebase/config.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  waitForPendingWrites,
  disableNetwork,
  enableNetwork,
  Firestore  // Import the Firestore type
} from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// Configure Firestore with persistence
let db: Firestore; // Explicitly type db as Firestore

if (typeof window !== 'undefined') {
  try {
    // Use the newer initializeFirestore method with persistence settings
    db = initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
      })
    });
  } catch (error) {
    console.error("Error initializing Firestore with persistence:", error);
    // Fallback to default Firestore initialization
    db = getFirestore(app);
  }
} else {
  // Server-side initialization
  db = getFirestore(app);
}

const functions = getFunctions(app);

// Network status management for Firestore
export const firestoreNetworkManager = {
  // Check if we're online
  isOnline: () => typeof navigator !== 'undefined' ? navigator.onLine : true,
  
  // Attempt to reconnect to Firestore
  reconnect: async () => {
    try {
      console.log("Attempting to reconnect to Firestore...");
      await enableNetwork(db);
      console.log("Successfully reconnected to Firestore network");
      return true;
    } catch (error) {
      console.error("Failed to reconnect to Firestore:", error);
      return false;
    }
  },
  
  // Disconnect from Firestore (useful for testing)
  disconnect: async () => {
    try {
      // Wait for any pending writes to complete first
      await waitForPendingWrites(db);
      await disableNetwork(db);
      console.log("Disconnected from Firestore network");
      return true;
    } catch (error) {
      console.error("Failed to disconnect from Firestore:", error);
      return false;
    }
  },
  
  // Setup listeners for online/offline events
  setupNetworkListeners: (onOnline?: () => void, onOffline?: () => void) => {
    if (typeof window === 'undefined') return () => {};
    
    const handleOnline = () => {
      console.log("Browser went online");
      firestoreNetworkManager.reconnect();
      if (onOnline) onOnline();
    };
    
    const handleOffline = () => {
      console.log("Browser went offline");
      if (onOffline) onOffline();
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Return cleanup function
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }
};

// Log network status on initial load
if (typeof window !== 'undefined') {
  console.log(`Initial network status: ${navigator.onLine ? 'Online' : 'Offline'}`);
}

export { app, auth, db, functions };