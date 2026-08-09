import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { QuizzesService } from '../../core/services/quizzes.service';
import { Quiz } from '../../core/models/models';

@Component({
  selector: 'app-quiz-take',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './quiz-take.component.html',
  styleUrl: './quiz-take.component.css'
})
export class QuizTakeComponent implements OnInit, OnDestroy {
  quiz: Quiz | null = null;
  answers: (number | null)[] = [];
  submitted = false;
  private sub?: Subscription;
  private quizzesSub?: Subscription;

  constructor(private route: ActivatedRoute, private quizzesSvc: QuizzesService) {}

  ngOnInit(): void {
    this.sub = this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.quizzesSub = this.quizzesSvc.watchAll().subscribe((all) => {
        const found = all.find((q) => q.id === id) || null;
        if (found && !this.quiz) {
          this.answers = new Array(found.questions.length).fill(null);
        }
        this.quiz = found;
      });
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.quizzesSub?.unsubscribe();
  }

  select(qIndex: number, optIndex: number): void {
    if (this.submitted) return;
    this.answers[qIndex] = optIndex;
  }

  get answeredCount(): number {
    return this.answers.filter((a) => a !== null).length;
  }

  submit(): void {
    this.submitted = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  retake(): void {
    if (!this.quiz) return;
    this.answers = new Array(this.quiz.questions.length).fill(null);
    this.submitted = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  get score(): number {
    if (!this.quiz) return 0;
    return this.quiz.questions.reduce(
      (acc, q, i) => acc + (this.answers[i] === q.correctIndex ? 1 : 0),
      0
    );
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
