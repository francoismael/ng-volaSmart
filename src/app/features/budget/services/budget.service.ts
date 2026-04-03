import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BudgetLine {
    category: string;
    amount: number;
    month: string;
}

export interface BudgetSummaryItem {
    category: string;
    budgeted: number;
    spent: number;
    remaining: number;
    pct: number;
}

/** Service de gestion du budget permettant de consulter, creer et supprimer des lignes budgetaires. */
@Injectable({ providedIn: 'root' })
export class BudgetService {
    private http = inject(HttpClient);
    private base = 'http://localhost:3000/budgets';

    /**
     * Recupere le resume budgetaire pour un mois donne.
     * @param month - Mois au format YYYY-MM
     * @returns Observable contenant la liste des postes budgetaires
     */
    getSummary(month: string): Observable<BudgetSummaryItem[]> {
        return this.http.get<BudgetSummaryItem[]>(`${this.base}/summary`, {
            params: { month },
        });
    }

    /**
     * Cree ou met a jour une ligne budgetaire.
     * @param line - Ligne budgetaire a inserer ou mettre a jour
     * @returns Observable contenant la ligne budgetaire sauvegardee
     */
    upsert(line: BudgetLine): Observable<BudgetLine> {
        return this.http.put<BudgetLine>(this.base, line);
    }

    /**
     * Supprime une ligne budgetaire pour un mois et une categorie donnes.
     * @param month - Mois au format YYYY-MM
     * @param category - Categorie budgetaire a supprimer
     * @returns Observable de type void
     */
    delete(month: string, category: string): Observable<void> {
        return this.http.delete<void>(`${this.base}/${month}/${category}`);
    }
}
