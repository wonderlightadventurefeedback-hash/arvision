// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getDatabase, Database } from "firebase/database";
import { getStorage, FirebaseStorage } from "firebase/storage";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyBh1MLOfoGxcIK30XbhAiPoVTwtbLX-_3s",
  authDomain: "wonderlight-campus-ambassader.firebaseapp.com",
  databaseURL: "https://wonderlight-campus-ambassader-default-rtdb.firebaseio.com",
  projectId: "wonderlight-campus-ambassader",
  storageBucket: "wonderlight-campus-ambassader.firebasestorage.app",
  messagingSenderId: "825389026280",
  appId: "1:825389026280:web:bd21cb8779d8c92a4ff25d",
  measurementId: "G-80FBXC77EV"
};

// Initialize Firebase (singleton pattern to prevent re-initialization)
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const rtdb: Database = getDatabase(app);
export const storage: FirebaseStorage = getStorage(app);

// Safe Analytics initialization (only in supported browser environments)
let analyticsInstance: Analytics | null = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analyticsInstance = getAnalytics(app);
    }
  }).catch((err) => {
    console.warn("Firebase Analytics initialization skipped or unsupported:", err);
  });
}

export const getFirebaseAnalytics = () => analyticsInstance;
export default app;

