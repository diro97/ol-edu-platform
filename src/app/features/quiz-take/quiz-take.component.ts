import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { QuizzesService } from '../../core/services/quizzes.service';
import { QuizResultsService } from '../../core/services/quiz-results.service';
import { UserAuthService } from '../../core/services/user-auth.service';
import { Quiz } from '../../core/models/models';

@Component({
  selector: 'app-quiz-take',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './quiz-take.component.html',
  styleUrl: './quiz-take.component.css'
})
export class QuizTakeComponent implements OnInit, OnDestroy {
  quiz: Quiz | null = null;
  answers: (number | null)[] = [];
  submitted = false;

  /** True once we've already looked up whether this student has a prior attempt. */
  checkingAttempt = true;
  /** True if this student already completed this quiz before — locks retaking. */
  alreadyAttempted = false;
  attemptedAt: number | null = null;

  private sub?: Subscription;
  private quizzesSub?: Subscription;
  private checkedQuizId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private quizzesSvc: QuizzesService,
    private quizResultsSvc: QuizResultsService,
    private userAuth: UserAuthService
  ) {}

  ngOnInit(): void {
    this.sub = this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.quizzesSub = this.quizzesSvc.watchAll().subscribe((all) => {
        const found = all.find((q) => q.id === id) || null;
        if (found && !this.quiz) {
          this.answers = new Array(found.questions.length).fill(null);
        }
        this.quiz = found;

        if (found && this.checkedQuizId !== found.id) {
          this.checkedQuizId = found.id;
          this.checkExistingAttempt(found.id);
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.quizzesSub?.unsubscribe();
  }

  private async checkExistingAttempt(quizId: string): Promise<void> {
    this.checkingAttempt = true;
    const user = this.userAuth.currentUser();
    if (!user) {
      // Not logged in — studentGuard should normally prevent this, but bail safely.
      this.checkingAttempt = false;
      return;
    }
    try {
      const existing = await this.quizResultsSvc.getForUserAndQuiz(user.uid, quizId);
      if (existing) {
        this.alreadyAttempted = true;
        this.attemptedAt = existing.submittedAt;
        this.answers = existing.answers && existing.answers.length
          ? existing.answers
          : this.answers;
        this.submitted = true;
      }
    } catch (e) {
      console.error('Failed to check for an existing quiz attempt', e);
    } finally {
      this.checkingAttempt = false;
    }
  }

  select(qIndex: number, optIndex: number): void {
    if (this.submitted) return;
    this.answers[qIndex] = optIndex;
  }

  get answeredCount(): number {
    return this.answers.filter((a) => a !== null).length;
  }

  submit(): void {
    if (this.alreadyAttempted) return; // safety net — button is hidden anyway
    this.submitted = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.saveResult();
  }

  private async saveResult(): Promise<void> {
    if (!this.quiz) return;
    const user = this.userAuth.currentUser();
    if (!user) return; // not logged in — nothing to attribute the attempt to

    try {
      await this.quizResultsSvc.addResult({
        uid: user.uid,
        email: user.email || '',
        quizId: this.quiz.id,
        quizTitle: this.quiz.title,
        subject: this.quiz.subject,
        score: this.score,
        total: this.quiz.questions.length,
        percentage: this.percentage,
        answers: this.answers,
        submittedAt: Date.now()
      });
      this.alreadyAttempted = true;
      this.attemptedAt = Date.now();
    } catch (e) {
      // Don't block the student's result screen if saving fails —
      // just log it so it's visible during development.
      console.error('Failed to save quiz result', e);
    }
  }

  get score(): number {
    if (!this.quiz) return 0;
    return this.quiz.questions.reduce(
      (acc, q, i) => acc + (this.answers[i] === q.correctIndex ? 1 : 0),
      0
    );
  }

  get percentage(): number {
    if (!this.quiz || this.quiz.questions.length === 0) return 0;
    return Math.round((this.score / this.quiz.questions.length) * 100);
  }

  get celebrate(): boolean {
    return this.percentage >= 75;
  }

  optionClass(qIndex: number, optIndex: number): string {
    if (!this.submitted || !this.quiz) {
      return this.answers[qIndex] === optIndex ? 'selected' : '';
    }
    const correct = this.quiz.questions[qIndex].correctIndex;
    if (optIndex === correct) return 'correct';
    if (optIndex === this.answers[qIndex] && optIndex !== correct) return 'incorrect';
    return '';
  }
}
