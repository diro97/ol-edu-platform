import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { QuizzesService } from '../../../core/services/quizzes.service';
import { ToastService } from '../../../core/services/toast.service';
import { ConfirmService } from '../../../core/services/confirm.service';
import { Quiz, QuizQuestion, Subject } from '../../../core/models/models';

@Component({
  selector: 'app-manage-quizzes',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './manage-quizzes.component.html',
  styleUrl: './manage-quizzes.component.css'
})
export class ManageQuizzesComponent implements OnInit, OnDestroy {
  subjects: Subject[] = ['Mathematics', 'Science', 'IT'];
  quizzes: Quiz[] = [];
  editingId: string | null = null;

  title = '';
  description = '';
  subject: Subject = 'Mathematics';
  questions: QuizQuestion[] = [];
  saving = false;

  private sub?: Subscription;

  constructor(
    private quizzesSvc: QuizzesService,
    private toast: ToastService,
    private confirm: ConfirmService
  ) {}

  ngOnInit(): void {
    this.sub = this.quizzesSvc.watchAll().subscribe((q) => (this.quizzes = q));
  }
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  newQuestion(): QuizQuestion {
    return {
      id: 'q_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      question: '',
      options: ['', '', '', ''],
      correctIndex: 0,
      explanation: ''
    };
  }

  addQuestion(): void {
    this.questions.push(this.newQuestion());
  }
  removeQuestion(i: number): void {
    this.questions.splice(i, 1);
  }

  resetForm(): void {
    this.editingId = null;
    this.title = '';
    this.description = '';
    this.subject = 'Mathematics';
    this.questions = [];
  }

  edit(q: Quiz): void {
    this.editingId = q.id;
    this.title = q.title;
    this.description = q.description;
    this.subject = q.subject;
    this.questions = JSON.parse(JSON.stringify(q.questions));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async save(): Promise<void> {
    if (!this.title.trim()) { this.toast.show('A quiz title is required'); return; }
    if (this.questions.length === 0) { this.toast.show('Add at least one question'); return; }
    for (const q of this.questions) {
      if (!q.question.trim() || q.options.some((o) => !o.trim())) {
        this.toast.show('Every question needs text and all 4 options filled in');
        return;
      }
    }
    this.saving = true;
    try {
      const payload = {
        title: this.title.trim(),
        description: this.description.trim(),
        subject: this.subject,
        questions: this.questions
      };
      if (this.editingId) {
        await this.quizzesSvc.update(this.editingId, payload);
        this.toast.show('Quiz updated');
      } else {
        await this.quizzesSvc.add({ ...payload, createdAt: Date.now() });
        this.toast.show('Quiz created');
      }
      this.resetForm();
    } catch (e) {
      console.error(e);
      this.toast.show('Something went wrong — check Firebase setup');
    } finally {
      this.saving = false;
    }
  }

  async remove(q: Quiz): Promise<void> {
    const ok = await this.confirm.ask(`Delete quiz "${q.title}"? This cannot be undone.`);
    if (!ok) return;
    await this.quizzesSvc.remove(q.id);
    this.toast.show('Quiz deleted');
  }
}
