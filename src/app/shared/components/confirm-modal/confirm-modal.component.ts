import { Component } from '@angular/core';
import { ConfirmService } from '../../../core/services/confirm.service';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  template: `
   @if (confirm.visible()) {
  <div class="overlay" (click)="onOverlay($event)">
    <div class="modal">
      <div class="icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
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
    .icon {
  width: 56px;
  height: 56px;
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #fef2f2;
  color: #dc2626;
}
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
