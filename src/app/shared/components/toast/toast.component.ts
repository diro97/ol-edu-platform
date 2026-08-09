import { Component } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div class="toast" [class.show]="toast.visible()">{{ toast.message() }}</div>
  `,
  styles: [`
    .toast{
      position:fixed; bottom:24px; left:50%; transform:translateX(-50%) translateY(20px);
      background:var(--ink); color:#fff; padding:12px 22px; border-radius:10px;
      font-size:13.5px; font-weight:600; opacity:0; pointer-events:none;
      transition:all .25s; z-index:300;
    }
    .toast.show{opacity:1; transform:translateX(-50%) translateY(0);}
  `]
})
export class ToastComponent {
  constructor(public toast: ToastService) {}
}
