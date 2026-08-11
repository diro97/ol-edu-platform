import { Injectable } from '@angular/core';
import { collection, addDoc, doc, deleteDoc, onSnapshot, orderBy, query, where, getDocs } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { FirebaseService } from './firebase.service';
import { QuizResult } from '../models/models';

@Injectable({ providedIn: 'root' })
export class QuizResultsService {
  constructor(private fb: FirebaseService) {}

  private col() {
    return collection(this.fb.db, 'ol_quiz_results');
  }

  /** All quiz attempts, newest first — used by the admin "Quiz Results" tab. */
  watchAll(): Observable<QuizResult[]> {
    return new Observable<QuizResult[]>((subscriber) => {
      const q = query(this.col(), orderBy('submittedAt', 'desc'));
      const unsub = onSnapshot(
        q,
        (snap) => subscriber.next(snap.docs.map((d) => ({ id: d.id, ...d.data() } as QuizResult))),
        (err) => subscriber.error(err)
      );
      return () => unsub();
    });
  }

  /** Just one user's attempts, newest first — used for the per-user drill-down. */
  watchByUser(uid: string): Observable<QuizResult[]> {
    return new Observable<QuizResult[]>((subscriber) => {
      const q = query(this.col(), where('uid', '==', uid), orderBy('submittedAt', 'desc'));
      const unsub = onSnapshot(
        q,
        (snap) => subscriber.next(snap.docs.map((d) => ({ id: d.id, ...d.data() } as QuizResult))),
        (err) => subscriber.error(err)
      );
      return () => unsub();
    });
  }

  /**
   * One-time check: has this student already completed this specific quiz?
   * Used by quiz-take.component.ts to enforce "one attempt per quiz".
   */
  async getForUserAndQuiz(uid: string, quizId: string): Promise<QuizResult | null> {
    const q = query(this.col(), where('uid', '==', uid), where('quizId', '==', quizId));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const d = snap.docs[0];
    return { id: d.id, ...d.data() } as QuizResult;
  }

  /** Called by quiz-take.component.ts when a student submits a quiz. */
  async addResult(result: Omit<QuizResult, 'id'>): Promise<void> {
    await addDoc(this.col(), result);
  }

  /** Admin action: deletes one result, clearing that student's lock on that quiz. */
  async remove(id: string): Promise<void> {
    await deleteDoc(doc(this.fb.db, 'ol_quiz_results', id));
  }

  /**
   * Admin action: deletes every quiz result belonging to a user —
   * used when fully deleting a user's account, so their marks
   * don't linger as orphaned data with no matching profile.
   */
  async removeAllForUser(uid: string): Promise<void> {
    const q = query(this.col(), where('uid', '==', uid));
    const snap = await getDocs(q);
    await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
  }
}
