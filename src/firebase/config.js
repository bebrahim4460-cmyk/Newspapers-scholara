// src/firebase/config.js
// Replace these values with your actual Firebase project configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBrxovjOkxyGGKanpYZ0lFJqxMqu6LsXPI",
  authDomain: "scholara-293f7.firebaseapp.com",
  projectId: "scholara-293f7",
  storageBucket: "scholara-293f7.firebasestorage.app",
  messagingSenderId: "525237482091",
  appId: "1:525237482091:web:edefd84d7a47a723c1b72e",
  measurementId: "G-PZ2WYEETL2"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
