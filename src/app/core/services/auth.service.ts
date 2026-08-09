import { Injectable, signal } from '@angular/core';

const ADMIN_PASSWORD = 'Admin';

@Injectable({ providedIn: 'root' })
export class AuthService {
  isAdmin = signal<boolean>(false);

  login(password: string): boolean {
    if (password === ADMIN_PASSWORD) {
      this.isAdmin.set(true);
      return true;
    }
    return false;
  }

  logout(): void {
    this.isAdmin.set(false);
  }
}
