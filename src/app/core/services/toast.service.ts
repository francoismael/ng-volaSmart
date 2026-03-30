import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<Toast[]>([]);
  private nextId = 0;

  success(message: string, duration = 3500): void {
    this._add(message, 'success', duration);
  }

  error(message: string, duration = 4000): void {
    this._add(message, 'error', duration);
  }

  remove(id: number): void {
    this.toasts.update((t) => t.filter((x) => x.id !== id));
  }

  private _add(message: string, type: 'success' | 'error', duration: number): void {
    const id = this.nextId++;
    this.toasts.update((t) => [...t, { id, message, type }]);
    setTimeout(() => this.remove(id), duration);
  }
}
