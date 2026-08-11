import { Injectable } from '@angular/core';
import { collection, onSnapshot, updateDoc, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { FirebaseService } from './firebase.service';
import { PlatformUser } from '../models/models';

@Injectable({ providedIn: 'root' })
export class UsersService {
  constructor(private fb: FirebaseService) {}

  private col() {
    return collection(this.fb.db, 'ol_platform_users');
  }

  watchAll(): Observable<PlatformUser[]> {
    return new Observable<PlatformUser[]>((subscriber) => {
      const q = query(this.col(), orderBy('createdAt', 'desc'));
      const unsub = onSnapshot(
        q,
        (snap) => subscriber.next(snap.docs.map((d) => d.data() as PlatformUser)),
        (err) => subscriber.error(err)
      );
      return () => unsub();
    });
  }

  async setPaid(uid: string, isPaid: boolean): Promise<void> {
    await updateDoc(doc(this.fb.db, 'ol_platform_users', uid), {
      isPaid,
      approvedAt: isPaid ? Date.now() : null
    });
  }

  /**
   * Deletes this user's Firestore profile document.
   * NOTE: this does NOT delete their Firebase Authentication login —
   * the client SDK can't delete other users' accounts. See
   * delete-user-guide.md for how to fully remove their login too.
   */
  async remove(uid: string): Promise<void> {
    await deleteDoc(doc(this.fb.db, 'ol_platform_users', uid));
  }
}
