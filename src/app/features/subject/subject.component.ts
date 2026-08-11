import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { PapersService } from '../../core/services/papers.service';
import { QuizzesService } from '../../core/services/quizzes.service';
import { SpecialQuestionsService } from '../../core/services/special-questions.service';
import { Paper, Quiz, SpecialQuestion, Subject } from '../../core/models/models';

@Component({
  selector: 'app-subject',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './subject.component.html',
  styleUrl: './subject.component.css'
})
export class SubjectComponent implements OnInit, OnDestroy {
  subject: Subject = 'Mathematics';
  tab: 'past' | 'model' | 'quiz' | 'special' = 'past';
  allPapers: Paper[] = [];
  allQuizzes: Quiz[] = [];
  allSpecial: SpecialQuestion[] = [];
  expandedId: string | null = null;
  revealedExplanation: Set<string> = new Set();
  private subs: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private papersSvc: PapersService,
    private quizzesSvc: QuizzesService,
    private specialSvc: SpecialQuestionsService
  ) {}

  ngOnInit(): void {
    this.subs.push(
      this.route.paramMap.subscribe((params) => {
        this.subject = (params.get('subject') as Subject) || 'Mathematics';
        this.tab = 'past';
      })
    );
    this.subs.push(this.papersSvc.watchAll().subscribe((p) => (this.allPapers = p)));
    this.subs.push(this.quizzesSvc.watchAll().subscribe((q) => (this.allQuizzes = q)));
    this.subs.push(this.specialSvc.watchAll().subscribe((s) => (this.allSpecial = s)));
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  get pastPapers(): Paper[] {
    return this.allPapers.filter((p) => p.subject === this.subject && p.type === 'Past Paper');
  }
  get modelPapers(): Paper[] {
    return this.allPapers.filter((p) => p.subject === this.subject && p.type === 'Model Paper');
  }
  get quizzes(): Quiz[] {
    return this.allQuizzes.filter((q) => q.subject === this.subject);
  }
  get specialQuestions(): SpecialQuestion[] {
    return this.allSpecial.filter((s) => s.subject === this.subject);
  }

  toggle(id: string): void {
    this.expandedId = this.expandedId === id ? null : id;
  }

  toggleExplanation(id: string): void {
    if (this.revealedExplanation.has(id)) {
      this.revealedExplanation.delete(id);
    } else {
      this.revealedExplanation.add(id);
    }
  }

  colorClass(): string {
    if (this.subject === 'Mathematics') return 'math';
    if (this.subject === 'Science') return 'science';
    return 'it';
  }
}
