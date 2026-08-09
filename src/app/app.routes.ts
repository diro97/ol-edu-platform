import { Routes } from '@angular/router';
import { adminGuard } from './core/services/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent)
  },
  {
    path: 'subject/:subject',
    loadComponent: () =>
      import('./features/subject/subject.component').then((m) => m.SubjectComponent)
  },
  {
    path: 'quiz/:id',
    loadComponent: () =>
      import('./features/quiz-take/quiz-take.component').then((m) => m.QuizTakeComponent)
  },
  {
    path: 'admin-login',
    loadComponent: () =>
      import('./features/admin/admin-login/admin-login.component').then((m) => m.AdminLoginComponent)
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/admin/admin-dashboard/admin-dashboard.component').then((m) => m.AdminDashboardComponent),
    children: [
      {
        path: 'papers',
        loadComponent: () =>
          import('./features/admin/manage-papers/manage-papers.component').then((m) => m.ManagePapersComponent)
      },
      {
        path: 'quizzes',
        loadComponent: () =>
          import('./features/admin/manage-quizzes/manage-quizzes.component').then((m) => m.ManageQuizzesComponent)
      },
      {
        path: 'special-questions',
        loadComponent: () =>
          import('./features/admin/manage-special-questions/manage-special-questions.component').then((m) => m.ManageSpecialQuestionsComponent)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
