import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserAuthService } from './user-auth.service';

/**
 * Waits for Firebase Auth to resolve (authReady), then:
 *  - not logged in            → /login
 *  - logged in, not approved  → /payment-pending
 *  - logged in and approved   → allow
 */
export const studentGuard: CanActivateFn = async () => {
  const auth = inject(UserAuthService);
  const router = inject(Router);

  await new Promise<void>((resolve) => {
    if (auth.authReady()) { resolve(); return; }
    const id = setInterval(() => {
      if (auth.authReady()) { clearInterval(id); resolve(); }
    }, 50);
  });

  const user = auth.currentUser();
  if (!user) {
    router.navigateByUrl('/login');
    return false;
  }

  // give the profile listener a brief moment to attach/resolve
  if (!auth.profile()) {
    await new Promise((r) => setTimeout(r, 400));
  }

  if (!auth.isPaid) {
    router.navigateByUrl('/payment-pending');
    return false;
  }
  return true;
};
