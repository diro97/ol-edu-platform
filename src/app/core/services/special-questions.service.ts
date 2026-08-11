import { Injectable } from '@angular/core';
import {
  collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, orderBy, query
} from 'firebase/firestore';
import { Observable } from 'rxjs';
import { FirebaseService } from './firebase.service';
import { SpecialQuestion } from '../models/models';

@Injectable({ providedIn: 'root' })
export class SpecialQuestionsService {
  constructor(private fb: FirebaseService) {}

  private col() {
    return collection(this.fb.db, 'ol_platform_special_questions');
  }

  watchAll(): Observable<SpecialQuestion[]> {
    return new Observable<SpecialQuestion[]>((subscriber) => {
      const q = query(this.col(), orderBy('createdAt', 'desc'));
      const unsub = onSnapshot(
        q,
        (snap) => {
          const list: SpecialQuestion[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
          subscriber.next(list);
        },
        (err) => subscriber.error(err)
      );
      return () => unsub();
    });
  }

  async add(item: Omit<SpecialQuestion, 'id'>): Promise<void> {
    await addDoc(this.col(), item);
  }

  async update(id: string, item: Partial<SpecialQuestion>): Promise<void> {
    await updateDoc(doc(this.fb.db, 'ol_platform_special_questions', id), item as any);
  }

  async remove(id: string): Promise<void> {
    await deleteDoc(doc(this.fb.db, 'ol_platform_special_questions', id));
  }
}
