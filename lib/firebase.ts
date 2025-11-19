import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// Your Firebase configuration
// Replace these with your actual Firebase project credentials
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "YOUR_AUTH_DOMAIN",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "YOUR_STORAGE_BUCKET",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "YOUR_APP_ID"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

// IMPORTANT: By default, getFirestore() connects to Cloud Firestore
// This ensures data syncs across all devices. The emulator is NOT connected unless explicitly enabled.
// To verify cloud connection, check the browser console - you should see the project ID logged.

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Log connection status in development
  const isEmulator = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true';
  if (isEmulator) {
    console.warn('⚠️ WARNING: Using Firebase Emulator. Data will NOT sync across devices!');
    connectFirestoreEmulator(db, 'localhost', 8080);
  } else {
    console.log('✅ Connected to Cloud Firestore - Data will sync across all devices');
    console.log('📡 Project ID:', firebaseConfig.projectId || 'Not configured - check environment variables');
  }
}

export { db, app };

