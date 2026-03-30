import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account } from '../models/account.model';

@Injectable({ providedIn: 'root' })
export class AccountsService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/accounts';

  getAll(): Observable<Account[]> {
    return this.http.get<Account[]>(this.apiUrl);
  }

  create(data: Partial<Account>): Observable<Account> {
    return this.http.post<Account>(this.apiUrl, data);
  }

  update(id: string, data: Partial<Account>): Observable<Account> {
    return this.http.patch<Account>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
