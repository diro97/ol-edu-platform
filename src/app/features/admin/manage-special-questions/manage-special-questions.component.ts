import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SpecialQuestionsService } from '../../../core/services/special-questions.service';
import { ToastService } from '../../../core/services/toast.service';
import { ConfirmService } from '../../../core/services/confirm.service';
import { compressImageToDataUrl } from '../../../core/services/image-compress.util';
import { SpecialQuestion, Subject } from '../../../core/models/models';

type InputMode = 'text' | 'photo';

@Component({
  selector: 'app-manage-special-questions',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './manage-special-questions.component.html',
  styleUrl: './manage-special-questions.component.css'
})
export class ManageSpecialQuestionsComponent implements OnInit, OnDestroy {
  subjects: Subject[] = ['Mathematics', 'Science', 'IT'];

  items: SpecialQuestion[] = [];
  editingId: string | null = null;

  subject: Subject = 'Mathematics';
  questionMode: InputMode = 'photo';
  explanationMode: InputMode = 'photo';

  questionText = '';
  questionImage = '';       // base64 data URL held in memory before save
  explanationText = '';
  explanationImage = '';

  savingQuestion = false;
  savingExplanation = false;
  saving = false;

  expandedId: string | null = null;

  private sub?: Subscription;

  constructor(
    private svc: SpecialQuestionsService,
    private toast: ToastService,
    private confirm: ConfirmService
  ) {}

  ngOnInit(): void {
    this.sub = this.svc.watchAll().subscribe((list) => (this.items = list));
  }
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  async onQuestionPhoto(e: Event): Promise<void> {
    const input = e.target as HTMLInputElement;
    const file = input.files && input.files[0];
    if (!file) return;
    this.savingQuestion = true;
    try {
      this.questionImage = await compressImageToDataUrl(file);
    } catch (err) {
      console.error(err);
      this.toast.show('Could not process that image — try a smaller photo');
    } finally {
      this.savingQuestion = false;
    }
  }

  async onExplanationPhoto(e: Event): Promise<void> {
    const input = e.target as HTMLInputElement;
    const file = input.files && input.files[0];
    if (!file) return;
    this.savingExplanation = true;
    try {
      this.explanationImage = await compressImageToDataUrl(file);
    } catch (err) {
      console.error(err);
      this.toast.show('Could not process that image — try a smaller photo');
    } finally {
      this.savingExplanation = false;
    }
  }

  clearQuestionPhoto(): void { this.questionImage = ''; }
  clearExplanationPhoto(): void { this.explanationImage = ''; }

  resetForm(): void {
    this.editingId = null;
    this.subject = 'Mathematics';
    this.questionMode = 'photo';
    this.explanationMode = 'photo';
    this.questionText = '';
    this.questionImage = '';
    this.explanationText = '';
    this.explanationImage = '';
  }

  edit(item: SpecialQuestion): void {
    this.editingId = item.id;
    this.subject = item.subject;
    this.questionText = item.questionText || '';
    this.questionImage = item.questionImage || '';
    this.questionMode = item.questionImage ? 'photo' : 'text';
    this.explanationText = item.explanationText || '';
    this.explanationImage = item.explanationImage || '';
    this.explanationMode = item.explanationImage ? 'photo' : 'text';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async save(): Promise<void> {
    const hasQuestion = this.questionMode === 'photo' ? !!this.questionImage : !!this.questionText.trim();
    if (!hasQuestion) {
      this.toast.show(this.questionMode === 'photo' ? 'Upload a question photo first' : 'Type the question text');
      return;
    }
    this.saving = true;
    try {
      const payload = {
        subject: this.subject,
        questionText: this.questionMode === 'text' ? this.questionText.trim() : '',
        questionImage: this.questionMode === 'photo' ? this.questionImage : '',
        explanationText: this.explanationMode === 'text' ? this.explanationText.trim() : '',
        explanationImage: this.explanationMode === 'photo' ? this.explanationImage : ''
      };
      if (this.editingId) {
        await this.svc.update(this.editingId, payload);
        this.toast.show('Special question updated');
      } else {
        await this.svc.add({ ...payload, createdAt: Date.now() });
        this.toast.show('Special question added');
      }
      this.resetForm();
    } catch (e) {
      console.error(e);
      this.toast.show('Something went wrong — the photo may be too large. Try a smaller image.');
    } finally {
      this.saving = false;
    }
  }

  toggle(id: string): void {
    this.expandedId = this.expandedId === id ? null : id;
  }

  async remove(item: SpecialQuestion): Promise<void> {
    const ok = await this.confirm.ask('Delete this special question? This cannot be undone.');
    if (!ok) return;
    await this.svc.remove(item.id);
    this.toast.show('Deleted');
  }
}
