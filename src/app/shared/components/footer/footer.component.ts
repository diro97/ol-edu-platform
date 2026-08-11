import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer>
      <div class="container inner">
        <p>O/L Learning Hub &middot; Free study resources for Maths, Science &amp; IT</p>
        <div class="credit">
          <span class="le-mark" aria-hidden="true">
            <span class="le-l">L</span><span class="le-e">E</span>
          </span>
          <span>Developed by <strong>Learn-Era</strong> Organization Team</span>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    footer{border-top:1px solid var(--border); padding:24px 0; margin-top:60px;}
    .inner{text-align:center;}
    p{font-family:var(--font-mono); font-size:11.5px; color:var(--ink-faint); letter-spacing:0.04em;}

    .credit{
      display:flex; align-items:center; justify-content:center; gap:8px;
      margin-top:10px;
      font-family:var(--font-mono); font-size:11.5px; color:var(--ink-faint); letter-spacing:0.04em;
    }
    .credit strong{color:var(--ink-dim); font-weight:700;}

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
  `]
})
export class FooterComponent {}
