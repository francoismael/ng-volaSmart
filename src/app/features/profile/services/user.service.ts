import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/** Service de gestion du profil utilisateur. */
@Injectable({ providedIn: 'root' })
export class UserService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/auth';

    /**
     * Récupère le profil de l'utilisateur connecté.
     * @returns {Observable} Les informations du profil (id, nom, email)
     */
    getProfile(): Observable<{ id: string; username: string; email: string }> {
        return this.http.get<{ id: string; username: string; email: string }>(`${this.apiUrl}/profile`);
    }
}
