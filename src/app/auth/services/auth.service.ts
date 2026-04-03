import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/** Service d'authentification gerant l'inscription, la connexion, la deconnexion et le profil utilisateur. */
@Injectable({ providedIn: 'root' })
export class AuthService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/auth';

    /**
     * Inscrit un nouvel utilisateur.
     * @param data - Donnees d'inscription (nom d'utilisateur, email, mot de passe)
     * @returns Observable contenant l'utilisateur cree
     */
    register(data: {
        username: string;
        email: string;
        password: string;
    }): Observable<{ id: string; username: string; email: string }> {
        return this.http.post<{ id: string; username: string; email: string }>(`${this.apiUrl}/register`, data);
    }

    /**
     * Connecte un utilisateur et stocke le token d'acces.
     * @param data - Identifiants de connexion (nom d'utilisateur, mot de passe)
     * @returns Observable contenant le token d'acces
     */
    login(data: { username: string; password: string }): Observable<{ access_token: string }> {
        return this.http
            .post<{ access_token: string }>(`${this.apiUrl}/login`, data)
            .pipe(tap((res) => localStorage.setItem('vs_token', res.access_token)));
    }

    /**
     * Deconnecte l'utilisateur et supprime le token local.
     * @returns Observable de type void
     */
    logout(): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/logout`, {}).pipe(tap(() => localStorage.removeItem('vs_token')));
    }

    /**
     * Recupere le profil de l'utilisateur connecte.
     * @returns Observable contenant les informations du profil
     */
    getProfile(): Observable<{ id: string; username: string; email: string }> {
        return this.http.get<{ id: string; username: string; email: string }>(`${this.apiUrl}/profile`);
    }
}
