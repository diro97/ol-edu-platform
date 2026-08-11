import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PapersService } from '../../../core/services/papers.service';
import { QuizzesService } from '../../../core/services/quizzes.service';
import { SpecialQuestionsService } from '../../../core/services/special-questions.service';
import { AuthService } from '../../../core/services/auth.service';
import { FirebaseService } from '../../../core/services/firebase.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  paperCount = 0;
  quizCount = 0;
  specialCount = 0;
  private subs: Subscription[] = [];

  constructor(
    public auth: AuthService,
    private router: Router,
    private papersSvc: PapersService,
    private quizzesSvc: QuizzesService,
    private specialSvc: SpecialQuestionsService,
    public fb: FirebaseService
  ) {}

  ngOnInit(): void {
    if (!this.auth.isAdmin()) {
      this.router.navigateByUrl('/admin-login');
      return;
    }
    this.subs.push(this.papersSvc.watchAll().subscribe((p) => (this.paperCount = p.length)));
    this.subs.push(this.quizzesSvc.watchAll().subscribe((q) => (this.quizCount = q.length)));
    this.subs.push(this.specialSvc.watchAll().subscribe((s) => (this.specialCount = s.length)));
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }
}
