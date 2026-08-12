import { Component, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AnnouncementsService } from '../../core/services/announcements.service';
import { Announcement } from '../../core/models/models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnDestroy {
  subjects = [
    { name: 'Mathematics', slug: 'Mathematics', color: 'math', icon: '&#8721;', blurb: 'Algebra, geometry, trigonometry — past papers, model papers and step-by-step practice.' },
    { name: 'Science', slug: 'Science', color: 'science', icon: '&#129514;', blurb: 'Biology, chemistry and physics fundamentals with full worked solutions.' },
    { name: 'IT', slug: 'IT', color: 'it', icon: '&#128187;', blurb: 'Computer systems, programming logic and databases explained clearly.' }
  ];

  announcements = signal<Announcement[]>([]);
  private announcementsSub?: Subscription;

  constructor(private announcementsSvc: AnnouncementsService) {
    this.announcementsSub = this.announcementsSvc.watchLatest(3).subscribe((a) => this.announcements.set(a));
  }

  ngOnDestroy(): void {
    this.announcementsSub?.unsubscribe();
  }
}
