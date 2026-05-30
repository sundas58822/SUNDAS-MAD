// constants/firebaseConfig.js

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            "AIzaSyBYwHQKgQ6lS1pscGUNZYy5bz4iVqx4Eek",
  authDomain:        "myauthapp-195b6.firebaseapp.com",
  projectId:         "myauthapp-195b6",
  storageBucket:     "myauthapp-195b6.firebasestorage.app",
  messagingSenderId: "1064585440676",
  appId:             "1:1064585440676:web:62c0dc6a18070c6c3fa531",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db   = getFirestore(app);