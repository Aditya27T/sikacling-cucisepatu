// components/FirebaseProvider.tsx
'use client'

import { useEffect, useState, createContext, useContext } from 'react';
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

type FirebaseContextType = {
  app: FirebaseApp | null;
  db: Firestore | null;
  auth: Auth | null;
  initialized: boolean;
};

const FirebaseContext = createContext<FirebaseContextType>({
  app: null,
  db: null,
  auth: null,
  initialized: false,
});

export const useFirebase = () => useContext(FirebaseContext);

export default function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [firebaseState, setFirebaseState] = useState<FirebaseContextType>({
    app: null,
    db: null,
    auth: null,
    initialized: false,
  });

  useEffect(() => {
    const initializeFirebase = () => {
      const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      };

      let app;
      if (!getApps().length) {
        app = initializeApp(firebaseConfig);
      } else {
        app = getApps()[0];
      }

      const db = getFirestore(app);
      const auth = getAuth(app);

      setFirebaseState({
        app,
        db,
        auth,
        initialized: true,
      });
    };

    if (typeof window !== 'undefined') {
      initializeFirebase();
    }
  }, []);

  return (
    <FirebaseContext.Provider value={firebaseState}>
      {children}
    </FirebaseContext.Provider>
  );
}
