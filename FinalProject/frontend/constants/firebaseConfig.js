import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAnIHXwphC_ywSSeowq1ilXxNukodb89ws",
  authDomain: "pet-paradise-29c2d.firebaseapp.com",
  projectId: "pet-paradise-29c2d",
  storageBucket: "pet-paradise-29c2d.firebasestorage.app",
  messagingSenderId: "62336584053",
  appId: "1:62336584053:web:d00146256b341e2673eb3c"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Set persistence for web
try {
  setPersistence(auth, browserLocalPersistence).catch(err => console.warn('Persistence setup:', err));
} catch (err) {
  console.warn('Firebase persistence error:', err);
}

export default app;
