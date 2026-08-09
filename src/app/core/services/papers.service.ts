import { Injectable } from '@angular/core';
import {
  collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, orderBy, query
} from 'firebase/firestore';
import { Observable } from 'rxjs';
import { FirebaseService } from './firebase.service';
import { Paper } from '../models/models';

@Injectable({ providedIn: 'root' })
export class PapersService {
  constructor(private fb: FirebaseService) {}

  private col() {
    return collection(this.fb.db, 'ol_platform_papers');
  }

  watchAll(): Observable<Paper[]> {
    return new Observable<Paper[]>((subscriber) => {
      const q = query(this.col(), orderBy('createdAt', 'desc'));
      const unsub = onSnapshot(
        q,
        (snap) => {
          const list: Paper[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
          subscriber.next(list);
        },
        (err) => subscriber.error(err)
      );
      return () => unsub();
    });
  }

  async add(paper: Omit<Paper, 'id'>): Promise<void> {
    await addDoc(this.col(), paper);
  }

  async update(id: string, paper: Partial<Paper>): Promise<void> {
    await updateDoc(doc(this.fb.db, 'ol_platform_papers', id), paper as any);
  }

  async remove(id: string): Promise<void> {
    await deleteDoc(doc(this.fb.db, 'ol_platform_papers', id));
  }
}
