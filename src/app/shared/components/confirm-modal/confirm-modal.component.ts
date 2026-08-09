import { Component } from '@angular/core';
import { ConfirmService } from '../../../core/services/confirm.service';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  template: `
    @if (confirm.visible()) {
      <div class="overlay" (click)="onOverlay($event)">
        <div class="modal">
          <div class="icon">&#128465;</div>
          <h3>Are you sure?</h3>
          <p>{{ confirm.message() }}</p>
          <div class="actions">
            <button class="btn full" (click)="confirm.respond(false)">No, cancel</button>
            <button class="btn danger full" (click)="confirm.respond(true)">Yes, proceed</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .overlay{
      position:fixed; inset:0; background:rgba(20,24,32,0.55); backdrop-filter:blur(3px);
      display:flex; align-items:center; justify-content:center; z-index:200; padding:20px;
    }
    .modal{
      background:var(--surface); border:1px solid var(--border); border-radius:16px;
      padding:30px; width:100%; max-width:380px; text-align:center;
    }
    .icon{font-size:32px; margin-bottom:8px;}
    h3{font-size:19px; margin-bottom:8px;}
    p{color:var(--ink-dim); font-size:13.5px; margin-bottom:18px;}
    .actions{display:flex; gap:10px;}
  `]
})
export class ConfirmModalComponent {
  constructor(public confirm: ConfirmService) {}
  onOverlay(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('overlay')) {
      this.confirm.respond(false);
    }
  }
}
