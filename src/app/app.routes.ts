import { Routes } from '@angular/router';
import { adminGuard } from './core/services/admin.guard';
import { studentGuard } from './core/services/student.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./features/auth/signup/signup.component').then((m) => m.SignupComponent)
  },
  {
    path: 'payment-pending',
    loadComponent: () =>
      import('./features/auth/payment-pending/payment-pending.component').then((m) => m.PaymentPendingComponent)
  },
  {
    path: 'subject/:subject',
    canActivate: [studentGuard],
    loadComponent: () =>
      import('./features/subject/subject.component').then((m) => m.SubjectComponent)
  },
  {
    path: 'quiz/:id',
    canActivate: [studentGuard],
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
        path: 'quiz-results',
        loadComponent: () =>
          import('./features/admin/manage-quiz-results/manage-quiz-results.component').then((m) => m.ManageQuizResultsComponent)
      },
      {
        path: 'special-questions',
        loadComponent: () =>
          import('./features/admin/manage-special-questions/manage-special-questions.component').then((m) => m.ManageSpecialQuestionsComponent)
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./features/admin/manage-users/manage-users.component').then((m) => m.ManageUsersComponent)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
