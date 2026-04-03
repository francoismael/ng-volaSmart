import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account } from '../models/account.model';

/** Service de gestion des comptes bancaires (CRUD). */
@Injectable({ providedIn: 'root' })
export class AccountsService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/accounts';

    /**
     * Recupere la liste de tous les comptes.
     * @returns Observable contenant le tableau des comptes
     */
    getAll(): Observable<Account[]> {
        return this.http.get<Account[]>(this.apiUrl);
    }

    /**
     * Cree un nouveau compte.
     * @param data - Donnees partielles du compte a creer
     * @returns Observable contenant le compte cree
     */
    create(data: Partial<Account>): Observable<Account> {
        return this.http.post<Account>(this.apiUrl, data);
    }

    /**
     * Met a jour un compte existant.
     * @param id - Identifiant du compte
     * @param data - Donnees partielles a mettre a jour
     * @returns Observable contenant le compte mis a jour
     */
    update(id: string, data: Partial<Account>): Observable<Account> {
        return this.http.patch<Account>(`${this.apiUrl}/${id}`, data);
    }

    /**
     * Supprime un compte par son identifiant.
     * @param id - Identifiant du compte a supprimer
     * @returns Observable de type void
     */
    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
