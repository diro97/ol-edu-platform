import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserAuthService } from '../../../core/services/user-auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(private auth: UserAuthService, private router: Router) {}

  async submit(): Promise<void> {
    if (!this.email.trim() || !this.password) {
      this.error = 'Enter your email and password.';
      return;
    }
    this.loading = true;
    this.error = '';
    try {
      await this.auth.login(this.email.trim(), this.password);
      await this.auth.refreshProfile();
      if (this.auth.isPaid) {
        this.router.navigateByUrl('/');
      } else {
        this.router.navigateByUrl('/payment-pending');
      }
    } catch (e: any) {
      this.error = this.friendlyError(e?.code);
    } finally {
      this.loading = false;
    }
  }

  private friendlyError(code?: string): string {
    if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
      return 'Incorrect email or password.';
    }
    if (code === 'auth/too-many-requests') {
      return 'Too many attempts — please wait a moment and try again.';
    }
    return 'Something went wrong. Please try again.';
  }
}
