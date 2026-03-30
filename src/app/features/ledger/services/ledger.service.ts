import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Operation } from '../../operations/models/operation.model';

export interface LedgerData {
  operations: Operation[];
  totalDebit: number;
  totalCredit: number;
  balance: number;
}

@Injectable({ providedIn: 'root' })
export class LedgerService {
  private http = inject(HttpClient);

  getLedger(): Observable<LedgerData> {
    return this.http.get<LedgerData>('http://localhost:3000/ledger');
  }
}
