import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Operation } from '../models/operation.model';

export interface PaginatedOperations {
  data: Operation[];
  total: number;
  page: number;
  totalPages: number;
  totalDebit: number;
  totalCredit: number;
}

@Injectable({ providedIn: 'root' })
export class OperationsService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/operations';

  getAll(filters?: { startDate?: string; endDate?: string }): Observable<Operation[]> {
    let params = new HttpParams();
    if (filters?.startDate) params = params.set('startDate', filters.startDate);
    if (filters?.endDate) params = params.set('endDate', filters.endDate);
    return this.http.get<Operation[]>(this.apiUrl, { params });
  }

  getAllPaginated(filters?: { startDate?: string; endDate?: string; page?: number; limit?: number }): Observable<PaginatedOperations> {
    let params = new HttpParams();
    if (filters?.startDate) params = params.set('startDate', filters.startDate);
    if (filters?.endDate)   params = params.set('endDate',   filters.endDate);
    params = params.set('page',  String(filters?.page  ?? 1));
    params = params.set('limit', String(filters?.limit ?? 50));
    return this.http.get<PaginatedOperations>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Operation> {
    return this.http.get<Operation>(`${this.apiUrl}/${id}`);
  }

  create(data: Partial<Operation>): Observable<Operation> {
    return this.http.post<Operation>(this.apiUrl, data);
  }

  update(id: string, data: Partial<Operation>): Observable<Operation> {
    return this.http.patch<Operation>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
