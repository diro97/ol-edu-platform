import { Injectable } from '@angular/core';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore';

/* ============================================================
   FIREBASE SETUP — REQUIRED FOR DATA (FIRESTORE ONLY)
   ============================================================
   This project is set up to run entirely on Firebase's free
   Spark plan — no Blaze upgrade and no card required. PDFs
   are linked (e.g. a Google Drive/Dropbox share link the admin
   pastes in) rather than uploaded through the site, so Firebase
   Storage isn't used at all.

   1. Go to https://console.firebase.google.com → create a free
      project (or reuse an existing one).
   2. Build → Firestore Database → Create database → test mode.
   3. Project settings → General → Your apps → Web app (</>)
      → copy the firebaseConfig values into the object below.
   4. Firestore Rules (Firestore → Rules) — use a rule with no
      expiry date, matching the actual collection names this app
      uses:
        rules_version = '2';
        service cloud.firestore {
          match /databases/{database}/documents {
            match /ol_platform_papers/{doc=**} { allow read, write: if true; }
            match /ol_platform_quizzes/{doc=**} { allow read, write: if true; }
            match /ol_platform_special_questions/{doc=**} { allow read, write: if true; }
          }
        }
   ============================================================ */
const firebaseConfig = {
  apiKey: 'AIzaSyBBIiZCno0CTtdQm_aLMVeGXUm7A8dh1dk',
  authDomain: 'education-51356.firebaseapp.com',
  projectId: 'education-51356',
  storageBucket: 'education-51356.firebasestorage.app',
  messagingSenderId: '191782984883',
  appId: '1:191782984883:web:afb38e80dcd2c55deb24c6'
};

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  app: FirebaseApp;
  db: Firestore;
  isConfigured: boolean;

  constructor() {
    this.isConfigured = firebaseConfig.apiKey !== 'PASTE_YOUR_API_KEY';
    this.app = initializeApp(firebaseConfig);
    this.db = getFirestore(this.app);
  }
}
