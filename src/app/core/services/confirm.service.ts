import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  visible = signal<boolean>(false);
  message = signal<string>('This action cannot be undone.');
  private resolver: ((value: boolean) => void) | null = null;

  ask(message: string): Promise<boolean> {
    this.message.set(message);
    this.visible.set(true);
    return new Promise<boolean>((resolve) => {
      this.resolver = resolve;
    });
  }

  respond(result: boolean): void {
    this.visible.set(false);
    if (this.resolver) {
      this.resolver(result);
      this.resolver = null;
    }
  }
}
