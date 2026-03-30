import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardData {
  initialBalance: number;
  totalCredit: number;
  totalDebit: number;
  currentBalance: number;
  todayDebit: number;
  todayCredit: number;
  weekDebit: number;
  weekCredit: number;
  monthDebit: number;
  monthCredit: number;
  yearDebit: number;
  yearCredit: number;
  recentOperations: any[];
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private http = inject(HttpClient);

  getDashboard(): Observable<DashboardData> {
    return this.http.get<DashboardData>('http://localhost:3000/dashboard');
  }
}
