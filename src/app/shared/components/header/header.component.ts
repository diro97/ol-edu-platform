import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserAuthService } from '../../../core/services/user-auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private router = inject(Router);

  /**
   * True on /admin OR /admin-login. Needed because adminGuard redirects
   * unauthenticated visits to /admin-login, so a plain routerLinkActive
   * (exact match on "/admin") never lights up in that case even though
   * the user is clearly in the admin section.
   */
  inAdminArea = signal(this.router.url.startsWith('/admin'));

  constructor(public auth: AuthService, public userAuth: UserAuthService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.inAdminArea.set(event.urlAfterRedirects.startsWith('/admin'));
      }
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/');
  }

  async studentLogout(): Promise<void> {
    await this.userAuth.logout();
    this.router.navigateByUrl('/login');
  }
}
