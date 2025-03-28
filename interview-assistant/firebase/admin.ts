// File: firebase/admin.ts

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Check if we already have initialized the app


// this is used as a more secure way to add limits as clients could pottentially just edit server side code 

const apps = getApps();

// If no apps exist, initialize one
if (!apps.length) {
  // Parse the service account JSON string from environment variable
  let serviceAccount;
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}');
  } catch (error) {
    console.error('Error parsing Firebase service account:', error);
    throw new Error('Invalid Firebase service account configuration');
  }

  initializeApp({
    credential: cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

// Export auth and db for use in other files
export const auth = getAuth();
export const db = getFirestore();