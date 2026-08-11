import { Injectable } from '@angular/core';
import {
  collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, orderBy, query
} from 'firebase/firestore';
import { Observable } from 'rxjs';
import { FirebaseService } from './firebase.service';
import { Quiz } from '../models/models';

@Injectable({ providedIn: 'root' })
export class QuizzesService {
  constructor(private fb: FirebaseService) {}

  private col() {
    return collection(this.fb.db, 'ol_platform_quizzes');
  }

  watchAll(): Observable<Quiz[]> {
    return new Observable<Quiz[]>((subscriber) => {
      const q = query(this.col(), orderBy('createdAt', 'desc'));
      const unsub = onSnapshot(
        q,
        (snap) => {
          const list: Quiz[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
          subscriber.next(list);
        },
        (err) => subscriber.error(err)
      );
      return () => unsub();
    });
  }

  async add(quiz: Omit<Quiz, 'id'>): Promise<void> {
    await addDoc(this.col(), quiz);
  }

  async update(id: string, quiz: Partial<Quiz>): Promise<void> {
    await updateDoc(doc(this.fb.db, 'ol_platform_quizzes', id), quiz as any);
  }

  async remove(id: string): Promise<void> {
    await deleteDoc(doc(this.fb.db, 'ol_platform_quizzes', id));
  }
}
