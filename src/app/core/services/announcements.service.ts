import { Injectable } from '@angular/core';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, orderBy, query, limit } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { FirebaseService } from './firebase.service';
import { Announcement } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AnnouncementsService {
  constructor(private fb: FirebaseService) {}

  private col() {
    return collection(this.fb.db, 'ol_announcements');
  }

  /** All announcements, newest first — used by the admin management page. */
  watchAll(): Observable<Announcement[]> {
    return new Observable<Announcement[]>((subscriber) => {
      const q = query(this.col(), orderBy('createdAt', 'desc'));
      const unsub = onSnapshot(
        q,
        (snap) => subscriber.next(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Announcement))),
        (err) => subscriber.error(err)
      );
      return () => unsub();
    });
  }

  /** Just the most recent few — used on the home page. */
  watchLatest(max: number = 3): Observable<Announcement[]> {
    return new Observable<Announcement[]>((subscriber) => {
      const q = query(this.col(), orderBy('createdAt', 'desc'), limit(max));
      const unsub = onSnapshot(
        q,
        (snap) => subscriber.next(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Announcement))),
        (err) => subscriber.error(err)
      );
      return () => unsub();
    });
  }

  async add(announcement: Omit<Announcement, 'id'>): Promise<void> {
    await addDoc(this.col(), announcement);
  }

  async update(id: string, announcement: Partial<Announcement>): Promise<void> {
    await updateDoc(doc(this.fb.db, 'ol_announcements', id), announcement as any);
  }

  async remove(id: string): Promise<void> {
    await deleteDoc(doc(this.fb.db, 'ol_announcements', id));
  }
}
