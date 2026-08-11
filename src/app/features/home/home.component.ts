import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  subjects = [
    { name: 'Mathematics', slug: 'Mathematics', color: 'math', icon: '&#8721;', blurb: 'Algebra, geometry, trigonometry — past papers, model papers and step-by-step practice.' },
    { name: 'Science', slug: 'Science', color: 'science', icon: '&#129514;', blurb: 'Biology, chemistry and physics fundamentals with full worked solutions.' },
    { name: 'IT', slug: 'IT', color: 'it', icon: '&#128187;', blurb: 'Computer systems, programming logic and databases explained clearly.' }
  ];
}
