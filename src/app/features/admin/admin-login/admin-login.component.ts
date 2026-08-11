
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule],

  template: `
    <div class="login-wrap">
      <div class="card login-card">

        <!-- Professional Admin Logo -->
        <div class="admin-logo">
          <svg
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Admin security logo">

            <!-- Shield -->
            <path
              d="M32 7L53 15V29C53 42 44.5 52.5 32 57C19.5 52.5 11 42 11 29V15L32 7Z"
              fill="none"
              stroke="currentColor"
              stroke-width="4"
              stroke-linejoin="round"/>

            <!-- Check -->
            <path
              d="M21 32L28 39L43 23"
              fill="none"
              stroke="currentColor"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"/>
          </svg>
        </div>

        <h2>Admin access</h2>

        <p class="text-dim">
          Enter the admin passcode to manage papers and quizzes.
        </p>

        <input
          type="password"
          [(ngModel)]="password"
          placeholder="Passcode"
          (keydown.enter)="submit()"
        >

        <p class="err">{{ error }}</p>

        <button
          class="btn primary full"
          (click)="submit()">
          Enter admin panel
        </button>

      </div>
    </div>
  `,

  styles: [`
    .login-wrap {
      display: flex;
      justify-content: center;
      padding: 80px 20px;
    }

    .login-card {
      padding: 34px;
      width: 100%;
      max-width: 380px;
      text-align: center;
    }

    /* Professional Admin Logo */
    .admin-logo {
      width: 68px;
      height: 68px;
      margin: 0 auto 18px;

      display: flex;
      align-items: center;
      justify-content: center;

      color: var(--primary);

      background: rgba(37, 99, 235, 0.10);

      border-radius: 20px;

      box-shadow:
        0 8px 22px rgba(37, 99, 235, 0.12);
    }

    .admin-logo svg {
      width: 40px;
      height: 40px;
    }

    h2 {
      font-size: 21px;
      margin-bottom: 8px;
    }

    p.text-dim {
      font-size: 13.5px;
      margin-bottom: 20px;
    }

    input {
      width: 100%;
      box-sizing: border-box;

      text-align: center;

      font-family: var(--font-mono);
      font-size: 15px;
      letter-spacing: 0.08em;

      border: 1px solid var(--border);
      border-radius: var(--radius-sm);

      padding: 12px;

      outline: none;
      margin-bottom: 6px;

      transition: border-color 0.2s, box-shadow 0.2s;
    }

    input:focus {
      border-color: var(--primary);

      box-shadow:
        0 0 0 3px rgba(37, 99, 235, 0.10);
    }

    .err {
      color: var(--error);
      font-size: 12px;
      min-height: 16px;
      margin-bottom: 12px;
    }
  `]
})
export class AdminLoginComponent {

  password = '';
  error = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  submit(): void {
    if (this.auth.login(this.password)) {
      this.router.navigateByUrl('/admin');
    } else {
      this.error = 'Incorrect passcode. Try again.';
    }
  }
}

