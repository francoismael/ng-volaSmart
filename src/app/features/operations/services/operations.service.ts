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

/** Service de gestion des operations financieres avec support de pagination et filtrage par date. */
@Injectable({ providedIn: 'root' })
export class OperationsService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/operations';

    /**
     * Recupere toutes les operations, avec filtrage optionnel par date.
     * @param filters - Filtres optionnels (date de debut, date de fin)
     * @returns Observable contenant le tableau des operations
     */
    getAll(filters?: { startDate?: string; endDate?: string }): Observable<Operation[]> {
        let params = new HttpParams();
        if (filters?.startDate) params = params.set('startDate', filters.startDate);
        if (filters?.endDate) params = params.set('endDate', filters.endDate);
        return this.http.get<Operation[]>(this.apiUrl, { params });
    }

    /**
     * Recupere les operations avec pagination et filtrage par date.
     * @param filters - Filtres optionnels (dates, page, limite)
     * @returns Observable contenant les operations paginées et les totaux
     */
    getAllPaginated(filters?: {
        startDate?: string;
        endDate?: string;
        page?: number;
        limit?: number;
    }): Observable<PaginatedOperations> {
        const { startDate, endDate, page = 1, limit = 50 } = filters ?? {};
        let params = new HttpParams().set('page', String(page)).set('limit', String(limit));
        if (startDate) params = params.set('startDate', startDate);
        if (endDate) params = params.set('endDate', endDate);
        return this.http.get<PaginatedOperations>(this.apiUrl, { params });
    }

    /**
     * Recupere une operation par son identifiant.
     * @param id - Identifiant de l'operation
     * @returns Observable contenant l'operation
     */
    getById(id: string): Observable<Operation> {
        return this.http.get<Operation>(`${this.apiUrl}/${id}`);
    }

    /**
     * Cree une nouvelle operation.
     * @param data - Donnees partielles de l'operation a creer
     * @returns Observable contenant l'operation creee
     */
    create(data: Partial<Operation>): Observable<Operation> {
        return this.http.post<Operation>(this.apiUrl, data);
    }

    /**
     * Met a jour une operation existante.
     * @param id - Identifiant de l'operation
     * @param data - Donnees partielles a mettre a jour
     * @returns Observable contenant l'operation mise a jour
     */
    update(id: string, data: Partial<Operation>): Observable<Operation> {
        return this.http.patch<Operation>(`${this.apiUrl}/${id}`, data);
    }

    /**
     * Supprime une operation par son identifiant.
     * @param id - Identifiant de l'operation a supprimer
     * @returns Observable de type void
     */
    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
