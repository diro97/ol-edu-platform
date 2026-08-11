import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { UsersService } from '../../../core/services/users.service';
import { QuizResultsService } from '../../../core/services/quiz-results.service';
import { ToastService } from '../../../core/services/toast.service';
import { ConfirmService } from '../../../core/services/confirm.service';
import { PlatformUser } from '../../../core/models/models';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.css'
})
export class ManageUsersComponent implements OnInit, OnDestroy {
  users: PlatformUser[] = [];
  search = '';
  filter: 'all' | 'pending' | 'approved' = 'all';
  private sub?: Subscription;

  constructor(
    private usersSvc: UsersService,
    private resultsSvc: QuizResultsService,
    private toast: ToastService,
    private confirm: ConfirmService
  ) {}

  ngOnInit(): void {
    this.sub = this.usersSvc.watchAll().subscribe((u) => (this.users = u));
  }
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  get filtered(): PlatformUser[] {
    let list = this.users;
    if (this.filter === 'pending') list = list.filter((u) => !u.isPaid);
    if (this.filter === 'approved') list = list.filter((u) => u.isPaid);
    if (this.search.trim()) {
      const s = this.search.trim().toLowerCase();
      list = list.filter((u) => u.email.toLowerCase().includes(s));
    }
    return list;
  }

  get totalCount(): number {
    return this.users.length;
  }
  get pendingCount(): number {
    return this.users.filter((u) => !u.isPaid).length;
  }
  get approvedCount(): number {
    return this.users.filter((u) => u.isPaid).length;
  }

  async approve(u: PlatformUser): Promise<void> {
    await this.usersSvc.setPaid(u.uid, true);
    this.toast.show(`Access approved for ${u.email}`);
  }

  async revoke(u: PlatformUser): Promise<void> {
    const ok = await this.confirm.ask(`Revoke access for ${u.email}? They'll be locked out until re-approved.`);
    if (!ok) return;
    await this.usersSvc.setPaid(u.uid, false);
    this.toast.show(`Access revoked for ${u.email}`);
  }

  /**
   * Deletes the user's profile + all their quiz results from the database.
   * Their Firebase Auth login itself is NOT deleted here — see the
   * delete-user-guide.md notes for why, and how to remove that too.
   */
  async deleteUser(u: PlatformUser): Promise<void> {
    const ok = await this.confirm.ask(
      `Permanently delete ${u.email}? This removes their profile and all quiz results from the database. ` +
      `This cannot be undone. Note: their login itself isn't deleted by this action — see the admin guide.`
    );
    if (!ok) return;

    await this.usersSvc.remove(u.uid);
    await this.resultsSvc.removeAllForUser(u.uid);
    this.toast.show(`${u.email} deleted from the database`);
  }
}
