import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { QuizResultsService } from '../../../core/services/quiz-results.service';
import { ToastService } from '../../../core/services/toast.service';
import { ConfirmService } from '../../../core/services/confirm.service';
import { QuizResult, Subject } from '../../../core/models/models';

@Component({
  selector: 'app-manage-quiz-results',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './manage-quiz-results.component.html',
  styleUrl: './Manage quiz results.component.css'
})
export class ManageQuizResultsComponent implements OnInit, OnDestroy {
  results: QuizResult[] = [];
  search = '';
  subjectFilter: Subject | 'all' = 'all';
  resetting = false;

  /** Set via ?uid=... when arriving from a "View results" link in Manage Users */
  focusedUid: string | null = null;
  focusedEmail: string | null = null;

  private resultsSub?: Subscription;
  private routeSub?: Subscription;

  constructor(
    private resultsSvc: QuizResultsService,
    private route: ActivatedRoute,
    private toast: ToastService,
    private confirm: ConfirmService
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.queryParamMap.subscribe((params) => {
      this.focusedUid = params.get('uid');
      this.focusedEmail = params.get('email');
    });
    this.resultsSub = this.resultsSvc.watchAll().subscribe((r) => {
      this.results = r;
      if (this.focusedUid && !this.focusedEmail) {
        const match = r.find((x) => x.uid === this.focusedUid);
        if (match) this.focusedEmail = match.email;
      }
    });
  }

  ngOnDestroy(): void {
    this.resultsSub?.unsubscribe();
    this.routeSub?.unsubscribe();
  }

  get filtered(): QuizResult[] {
    let list = this.results;
    if (this.focusedUid) {
      list = list.filter((r) => r.uid === this.focusedUid);
    } else if (this.search.trim()) {
      const s = this.search.trim().toLowerCase();
      list = list.filter((r) => r.email.toLowerCase().includes(s));
    }
    if (this.subjectFilter !== 'all') {
      list = list.filter((r) => r.subject === this.subjectFilter);
    }
    return list;
  }

  get averageForFocused(): number {
    if (!this.focusedUid) return 0;
    const list = this.results.filter((r) => r.uid === this.focusedUid);
    if (list.length === 0) return 0;
    const total = list.reduce((acc, r) => acc + r.percentage, 0);
    return Math.round(total / list.length);
  }

  clearFocus(): void {
    this.focusedUid = null;
    this.focusedEmail = null;
  }

  async allowRetake(r: QuizResult): Promise<void> {
    const ok = await this.confirm.ask(
      `Allow ${r.email} to retake "${r.quizTitle}"? Their current score (${r.score}/${r.total}) will be deleted and they'll be able to attempt it again.`
    );
    if (!ok) return;
    await this.resultsSvc.remove(r.id);
    this.toast.show(`${r.email} can now retake "${r.quizTitle}"`);
  }

  /**
   * Bulk action: clears every quiz attempt, for every student, across
   * every quiz — so everyone can retake everything fresh. Big hammer,
   * confirmed with an explicit typed-count warning.
   */
  async resetAllAttempts(): Promise<void> {
    if (this.results.length === 0) {
      this.toast.show('There are no quiz attempts to reset.');
      return;
    }
    const ok = await this.confirm.ask(
      `Reset ALL quiz attempts for ALL students? This permanently deletes all ${this.results.length} recorded results across every quiz and every user — every student will be able to retake every quiz from scratch. This cannot be undone.`
    );
    if (!ok) return;

    this.resetting = true;
    try {
      const count = await this.resultsSvc.removeAll();
      this.toast.show(`Reset complete — ${count} quiz attempt${count === 1 ? '' : 's'} cleared. All students can retake all quizzes.`);
    } catch (e) {
      console.error(e);
      this.toast.show('Something went wrong while resetting — please try again.');
    } finally {
      this.resetting = false;
    }
  }
}
