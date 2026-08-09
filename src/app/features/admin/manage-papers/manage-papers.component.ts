import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PapersService } from '../../../core/services/papers.service';
import { ToastService } from '../../../core/services/toast.service';
import { ConfirmService } from '../../../core/services/confirm.service';
import { Paper, Subject, PaperType } from '../../../core/models/models';

@Component({
  selector: 'app-manage-papers',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './manage-papers.component.html',
  styleUrl: './manage-papers.component.css'
})
export class ManagePapersComponent implements OnInit, OnDestroy {
  subjects: Subject[] = ['Mathematics', 'Science', 'IT'];
  types: PaperType[] = ['Past Paper', 'Model Paper'];

  papers: Paper[] = [];
  editingId: string | null = null;

  form = this.emptyForm();
  saving = false;

  private sub?: Subscription;

  constructor(
    private papersSvc: PapersService,
    private toast: ToastService,
    private confirm: ConfirmService
  ) {}

  ngOnInit(): void {
    this.sub = this.papersSvc.watchAll().subscribe((p) => (this.papers = p));
  }
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  emptyForm() {
    return {
      subject: 'Mathematics' as Subject,
      type: 'Past Paper' as PaperType,
      title: '',
      year: '',
      fileUrl: '',
      answerUrl: '',
      solutionNotes: ''
    };
  }

  async save(): Promise<void> {
    if (!this.form.title.trim()) {
      this.toast.show('A title is required');
      return;
    }
    if (!this.form.fileUrl.trim()) {
      this.toast.show('A link to the question paper is required');
      return;
    }
    this.saving = true;
    try {
      const payload = {
        ...this.form,
        title: this.form.title.trim(),
        year: this.form.year.trim(),
        fileUrl: this.form.fileUrl.trim(),
        answerUrl: this.form.answerUrl.trim(),
        solutionNotes: this.form.solutionNotes.trim()
      };
      if (this.editingId) {
        await this.papersSvc.update(this.editingId, payload);
        this.toast.show('Paper updated');
      } else {
        await this.papersSvc.add({ ...payload, createdAt: Date.now() });
        this.toast.show('Paper added');
      }
      this.resetForm();
    } catch (e) {
      console.error(e);
      this.toast.show('Something went wrong — check Firebase setup');
    } finally {
      this.saving = false;
    }
  }

  edit(p: Paper): void {
    this.editingId = p.id;
    this.form = {
      subject: p.subject,
      type: p.type,
      title: p.title,
      year: p.year,
      fileUrl: p.fileUrl,
      answerUrl: p.answerUrl,
      solutionNotes: p.solutionNotes
    };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  resetForm(): void {
    this.editingId = null;
    this.form = this.emptyForm();
  }

  async remove(p: Paper): Promise<void> {
    const ok = await this.confirm.ask(`Delete "${p.title}"? This cannot be undone.`);
    if (!ok) return;
    await this.papersSvc.remove(p.id);
    this.toast.show('Paper deleted');
  }
}
