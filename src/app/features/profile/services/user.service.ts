import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/auth';

  getProfile(): Observable<{ id: string; username: string; email: string }> {
    return this.http.get<{ id: string; username: string; email: string }>(`${this.apiUrl}/profile`);
  }
}
