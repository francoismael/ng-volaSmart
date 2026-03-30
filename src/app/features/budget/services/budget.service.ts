import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BudgetLine {
  category: string;
  amount: number;
  month: string;
}

export interface BudgetSummaryItem {
  category: string;
  budgeted: number;
  spent: number;
  remaining: number;
  pct: number;
}

@Injectable({ providedIn: 'root' })
export class BudgetService {
  private http = inject(HttpClient);
  private base = 'http://localhost:3000/budgets';

  getSummary(month: string): Observable<BudgetSummaryItem[]> {
    return this.http.get<BudgetSummaryItem[]>(`${this.base}/summary`, {
      params: { month },
    });
  }

  upsert(line: BudgetLine): Observable<BudgetLine> {
    return this.http.put<BudgetLine>(this.base, line);
  }

  delete(month: string, category: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${month}/${category}`);
  }
}
