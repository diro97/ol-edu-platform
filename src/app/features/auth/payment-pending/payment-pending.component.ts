import { Component, effect } from '@angular/core';
import { Router } from '@angular/router';
import { UserAuthService } from '../../../core/services/user-auth.service';
import { PAYMENT_INFO } from '../../../core/config/payment-info';

@Component({
  selector: 'app-payment-pending',
  standalone: true,
  templateUrl: './payment-pending.component.html',
  styleUrl: './payment-pending.component.css'
})
export class PaymentPendingComponent {
  paymentInfo = PAYMENT_INFO;

  constructor(public auth: UserAuthService, private router: Router) {
    effect(() => {
      if (this.auth.profile()?.isPaid) {
        this.router.navigateByUrl('/');
      }
    });
  }

  async logout(): Promise<void> {
    await this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
