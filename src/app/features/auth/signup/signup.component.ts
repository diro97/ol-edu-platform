import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserAuthService } from '../../../core/services/user-auth.service';
import { PAYMENT_INFO } from '../../../core/config/payment-info';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  error = '';
  loading = false;
  googleLoading = false;
  done = false;

  paymentInfo = PAYMENT_INFO;

  constructor(private auth: UserAuthService) {}

  async submit(): Promise<void> {
    if (!this.name.trim()) {
      this.error = 'Enter your full name.';
      return;
    }
    if (!this.email.trim() || !this.password) {
      this.error = 'Enter an email and password.';
      return;
    }
    if (this.password.length < 6) {
      this.error = 'Password must be at least 6 characters.';
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match.';
      return;
    }
    this.loading = true;
    this.error = '';
    try {
      await this.auth.signUp(this.email.trim(), this.password, this.name.trim());
      this.done = true;
    } catch (e: any) {
      this.error = this.friendlyError(e?.code);
    } finally {
      this.loading = false;
    }
  }

  async signUpWithGoogle(): Promise<void> {
    this.googleLoading = true;
    this.error = '';
    try {
      const user = await this.auth.signInWithGoogle();
      this.email = user?.email ?? this.email;
      this.done = true;
    } catch (e: any) {
      this.error = this.friendlyError(e?.code);
    } finally {
      this.googleLoading = false;
    }
  }

  private friendlyError(code?: string): string {
    if (code === 'auth/email-already-in-use') return 'That email is already registered — try logging in instead.';
    if (code === 'auth/invalid-email') return 'That doesn\'t look like a valid email address.';
    if (code === 'auth/weak-password') return 'Please choose a stronger password.';
    if (code === 'auth/popup-closed-by-user') return 'Google sign-in was closed before finishing.';
    if (code === 'auth/popup-blocked') return 'Your browser blocked the Google sign-in popup — please allow popups and try again.';
    if (code === 'auth/account-exists-with-different-credential') return 'This email already has an account — please log in with your email and password instead.';
    return 'Something went wrong. Please try again.';
  }
}
