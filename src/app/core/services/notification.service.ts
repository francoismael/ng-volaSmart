import { Injectable, inject, signal, computed } from '@angular/core';
import { RecurringService } from '../../features/recurring/services/recurring.service';
import { RecurringOperation } from '../../features/recurring/models/recurring.model';

export interface AppNotification {
  id: string;
  label: string;
  amount: number;
  type: 'debit' | 'credit';
  nextDate: string;
  daysUntil: number;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private recurringService = inject(RecurringService);

  private _notifications = signal<AppNotification[]>([]);
  notifications = this._notifications.asReadonly();
  count = computed(() => this._notifications().length);

  load() {
    this.recurringService.getAll().subscribe({
      next: (items) => {
        const now = new Date();
        const todayMs = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
        const result: AppNotification[] = [];

        for (const item of items) {
          if (!item.isActive || !item.nextDate) continue;
          const next = new Date(item.nextDate);
          const nextMs = Date.UTC(next.getUTCFullYear(), next.getUTCMonth(), next.getUTCDate());
          const daysUntil = Math.round((nextMs - todayMs) / 86_400_000);
          if (daysUntil <= 3) {
            result.push({
              id: item.id,
              label: item.label,
              amount: item.amount,
              type: item.type,
              nextDate: item.nextDate,
              daysUntil,
            });
          }
        }

        result.sort((a, b) => a.daysUntil - b.daysUntil);
        this._notifications.set(result);
      },
      error: () => {}, // silent — notifications are non-critical
    });
  }
}
