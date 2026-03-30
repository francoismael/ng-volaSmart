import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecurringOperation } from '../models/recurring.model';

@Injectable({ providedIn: 'root' })
export class RecurringService {
  private http = inject(HttpClient);
  private base = 'http://localhost:3000/recurring';

  getAll() {
    return this.http.get<RecurringOperation[]>(this.base);
  }

  create(data: Partial<RecurringOperation>) {
    return this.http.post<RecurringOperation>(this.base, data);
  }

  update(id: string, data: Partial<RecurringOperation>) {
    return this.http.patch<RecurringOperation>(`${this.base}/${id}`, data);
  }

  delete(id: string) {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  toggle(id: string, isActive: boolean) {
    return this.http.patch<RecurringOperation>(`${this.base}/${id}`, { isActive });
  }
}
