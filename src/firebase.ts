// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage"; // ← Add this

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAre3FI9AqADJ4DqzniA7-IAIbpAwEQ6nM",
  authDomain: "petalbot-2c6e7.firebaseapp.com",
  projectId: "petalbot-2c6e7",
  storageBucket: "petalbot-2c6e7.firebasestorage.app",
  messagingSenderId: "313136686045",
  appId: "1:313136686045:web:3b1f0fe9b12d60eac7cc34",
  measurementId: "G-JB8VP2W9H8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // ← Export storage
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
