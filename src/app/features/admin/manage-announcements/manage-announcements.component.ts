import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AnnouncementsService } from '../../../core/services/announcements.service';
import { ToastService } from '../../../core/services/toast.service';
import { ConfirmService } from '../../../core/services/confirm.service';
import { Announcement } from '../../../core/models/models';

@Component({
  selector: 'app-manage-announcements',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-announcements.component.html',
  styleUrl: './manage-announcements.component.css'
})
export class ManageAnnouncementsComponent implements OnInit, OnDestroy {
  announcements: Announcement[] = [];
  editingId: string | null = null;

  title = '';
  message = '';
  saving = false;

  private sub?: Subscription;

  constructor(
    private announcementsSvc: AnnouncementsService,
    private toast: ToastService,
    private confirm: ConfirmService
  ) {}

  ngOnInit(): void {
    this.sub = this.announcementsSvc.watchAll().subscribe((a) => (this.announcements = a));
  }
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  async save(): Promise<void> {
    if (!this.title.trim() || !this.message.trim()) {
      this.toast.show('A title and message are both required');
      return;
    }
    this.saving = true;
    try {
      const payload = { title: this.title.trim(), message: this.message.trim() };
      if (this.editingId) {
        await this.announcementsSvc.update(this.editingId, payload);
        this.toast.show('Announcement updated');
      } else {
        await this.announcementsSvc.add({ ...payload, createdAt: Date.now() });
        this.toast.show('Announcement posted');
      }
      this.resetForm();
    } catch (e) {
      console.error(e);
      this.toast.show('Something went wrong — check Firebase setup');
    } finally {
      this.saving = false;
    }
  }

  edit(a: Announcement): void {
    this.editingId = a.id;
    this.title = a.title;
    this.message = a.message;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  resetForm(): void {
    this.editingId = null;
    this.title = '';
    this.message = '';
  }

  async remove(a: Announcement): Promise<void> {
    const ok = await this.confirm.ask(`Delete "${a.title}"? This cannot be undone.`);
    if (!ok) return;
    await this.announcementsSvc.remove(a.id);
    this.toast.show('Announcement deleted');
  }
}
