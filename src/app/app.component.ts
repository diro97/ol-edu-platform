import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { ToastComponent } from './shared/components/toast/toast.component';
import { ConfirmModalComponent } from './shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, ToastComponent, ConfirmModalComponent],
  template: `
    <app-header></app-header>

    <div class="brand-badge" title="Developed by Lear-Era Organization Team">
      <span class="le-mark" aria-hidden="true">
        <span class="le-l">L</span><span class="le-e">E</span>
      </span>
      <span>Learn-Era</span>
    </div>

    <router-outlet></router-outlet>
    <app-footer></app-footer>
    <app-toast></app-toast>
    <app-confirm-modal></app-confirm-modal>
  `,
  styles: [`
    .brand-badge{
      position: absolute;
      top: 76px;
      right: 20px;
      z-index: 30;
      display: inline-flex;
      align-items: center;
      gap: 7px;
      font-family: var(--font-display);
      font-size: 13px;
      font-weight: 600;
      color: var(--ink-dim);
      opacity: 0.85;
      transition: opacity .15s;
    }
    .brand-badge:hover{
      opacity: 1;
    }

    .le-mark{
      display:inline-flex; align-items:center; justify-content:center;
      width:22px; height:22px; border-radius:7px;
      background:var(--primary);
      font-family:var(--font-display);
      font-weight:700; font-size:11px; line-height:1;
      letter-spacing:-0.02em;
      flex-shrink:0;
    }
    .le-l{color:#fff;}
    .le-e{color:var(--accent-bright);}

    /* Mobile header wraps to two rows and is taller — push the badge
       down enough to clear it, but keep it in the same top-right
       corner as desktop rather than relocating it. */
    @media (max-width: 640px){
      .brand-badge{
        top: 118px;
        right: 12px;
        font-size: 11.5px;
      }
      .le-mark{ width: 19px; height: 19px; font-size: 10px; }
    }
  `]
})
export class AppComponent {}
