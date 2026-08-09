import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer>
      <div class="container inner">
        <p>O/L Learning Hub &middot; Free study resources for Maths, Science &amp; IT</p>
      </div>
    </footer>
  `,
  styles: [`
    footer{border-top:1px solid var(--border); padding:24px 0; margin-top:60px;}
    .inner{text-align:center;}
    p{font-family:var(--font-mono); font-size:11.5px; color:var(--ink-faint); letter-spacing:0.04em;}
  `]
})
export class FooterComponent {}
