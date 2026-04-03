import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecurringOperation } from '../models/recurring.model';

/** Service de gestion des operations recurrentes (abonnements, prelevements automatiques). */
@Injectable({ providedIn: 'root' })
export class RecurringService {
    private http = inject(HttpClient);
    private base = 'http://localhost:3000/recurring';

    /**
     * Recupere toutes les operations recurrentes.
     * @returns Observable contenant le tableau des operations recurrentes
     */
    getAll() {
        return this.http.get<RecurringOperation[]>(this.base);
    }

    /**
     * Cree une nouvelle operation recurrente.
     * @param data - Donnees partielles de l'operation recurrente
     * @returns Observable contenant l'operation recurrente creee
     */
    create(data: Partial<RecurringOperation>) {
        return this.http.post<RecurringOperation>(this.base, data);
    }

    /**
     * Met a jour une operation recurrente existante.
     * @param id - Identifiant de l'operation recurrente
     * @param data - Donnees partielles a mettre a jour
     * @returns Observable contenant l'operation recurrente mise a jour
     */
    update(id: string, data: Partial<RecurringOperation>) {
        return this.http.patch<RecurringOperation>(`${this.base}/${id}`, data);
    }

    /**
     * Supprime une operation recurrente par son identifiant.
     * @param id - Identifiant de l'operation recurrente a supprimer
     * @returns Observable de type void
     */
    delete(id: string) {
        return this.http.delete<void>(`${this.base}/${id}`);
    }

    /**
     * Active ou desactive une operation recurrente.
     * @param id - Identifiant de l'operation recurrente
     * @param isActive - Etat d'activation souhaite
     * @returns Observable contenant l'operation recurrente mise a jour
     */
    toggle(id: string, isActive: boolean) {
        return this.http.patch<RecurringOperation>(`${this.base}/${id}`, { isActive });
    }
}
