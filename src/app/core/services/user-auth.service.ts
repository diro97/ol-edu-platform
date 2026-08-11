import { Injectable, signal } from '@angular/core';
import {
  Auth, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, onAuthStateChanged, User, GoogleAuthProvider, signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, onSnapshot, getDoc } from 'firebase/firestore';
import { FirebaseService } from './firebase.service';
import { PlatformUser } from '../models/models';

@Injectable({ providedIn: 'root' })
export class UserAuthService {
  auth: Auth;
  currentUser = signal<User | null>(null);
  profile = signal<PlatformUser | null>(null);
  authReady = signal<boolean>(false);

  private profileUnsub: (() => void) | null = null;

  constructor(private fb: FirebaseService) {
    this.auth = getAuth(this.fb.app);
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser.set(user);
      this.authReady.set(true);
      if (this.profileUnsub) { this.profileUnsub(); this.profileUnsub = null; }
      if (user) {
        this.profileUnsub = onSnapshot(doc(this.fb.db, 'ol_platform_users', user.uid), (snap) => {
          this.profile.set(snap.exists() ? (snap.data() as PlatformUser) : null);
        });
      } else {
        this.profile.set(null);
      }
    });
  }

  get isPaid(): boolean {
    return !!this.profile()?.isPaid;
  }

  /** Display name to show in the UI — falls back to the email's local part if no name is set. */
  get displayName(): string {
    const p = this.profile();
    if (p?.name?.trim()) return p.name.trim();
    const email = p?.email || this.currentUser()?.email || '';
    return email.split('@')[0] || 'Account';
  }

  async signUp(email: string, password: string, name: string): Promise<void> {
    const cred = await createUserWithEmailAndPassword(this.auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    const newUser: PlatformUser = {
      uid: cred.user.uid,
      email: cred.user.email || email,
      name: name.trim(),
      isPaid: false,
      createdAt: Date.now(),
      approvedAt: null
    };
    await setDoc(doc(this.fb.db, 'ol_platform_users', cred.user.uid), newUser);
  }

  async login(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(this.auth, email, password);
  }

  /**
   * Sign in (or sign up, on first use) with Google.
   * Only creates a ol_platform_users doc if one doesn't already exist,
   * so returning users keep their existing isPaid/approvedAt status.
   */
  async signInWithGoogle(): Promise<User> {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(this.auth, provider);

    const userRef = doc(this.fb.db, 'ol_platform_users', cred.user.uid);
    const existing = await getDoc(userRef);

    if (!existing.exists()) {
      const newUser: PlatformUser = {
        uid: cred.user.uid,
        email: cred.user.email || '',
        name: cred.user.displayName || (cred.user.email || '').split('@')[0] || 'Account',
        isPaid: false,
        createdAt: Date.now(),
        approvedAt: null
      };
      await setDoc(userRef, newUser);
    }

    return cred.user;
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  async refreshProfile(): Promise<void> {
    const user = this.currentUser();
    if (!user) return;
    const snap = await getDoc(doc(this.fb.db, 'ol_platform_users', user.uid));
    this.profile.set(snap.exists() ? (snap.data() as PlatformUser) : null);
  }
}
