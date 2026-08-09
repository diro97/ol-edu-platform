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
        <div class="icon">&#128274;</div>
        <h2>Admin access</h2>
        <p class="text-dim">Enter the admin passcode to manage papers and quizzes.</p>
        <input
          type="password"
          [(ngModel)]="password"
          placeholder="Passcode"
          (keydown.enter)="submit()"
        >
        <p class="err">{{ error }}</p>
        <button class="btn primary full" (click)="submit()">Enter admin panel</button>
      </div>
    </div>
  `,
  styles: [`
    .login-wrap{display:flex; justify-content:center; padding:80px 20px;}
    .login-card{padding:34px; width:100%; max-width:380px; text-align:center;}
    .icon{font-size:32px; margin-bottom:10px;}
    h2{font-size:21px; margin-bottom:8px;}
    p.text-dim{font-size:13.5px; margin-bottom:20px;}
    input{
      width:100%; text-align:center; font-family:var(--font-mono); font-size:15px; letter-spacing:0.08em;
      border:1px solid var(--border); border-radius:var(--radius-sm); padding:12px; outline:none; margin-bottom:6px;
    }
    input:focus{border-color:var(--primary);}
    .err{color:var(--error); font-size:12px; min-height:16px; margin-bottom:12px;}
  `]
})
export class AdminLoginComponent {
  password = '';
  error = '';
  constructor(private auth: AuthService, private router: Router) {}

  submit(): void {
    if (this.auth.login(this.password)) {
      this.router.navigateByUrl('/admin');
    } else {
      this.error = 'Incorrect passcode. Try again.';
    }
  }
}
