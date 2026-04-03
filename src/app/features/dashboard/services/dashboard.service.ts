import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

/** Donnees agrégées du tableau de bord (soldes, totaux par période, opérations récentes). */
export interface DashboardData {
    /** Solde initial du compte */
    initialBalance: number;
    /** Total des crédits */
    totalCredit: number;
    /** Total des débits */
    totalDebit: number;
    /** Solde courant calculé */
    currentBalance: number;
    /** Débits du jour */
    todayDebit: number;
    /** Crédits du jour */
    todayCredit: number;
    /** Débits de la semaine */
    weekDebit: number;
    /** Crédits de la semaine */
    weekCredit: number;
    /** Débits du mois */
    monthDebit: number;
    /** Crédits du mois */
    monthCredit: number;
    /** Débits de l'année */
    yearDebit: number;
    /** Crédits de l'année */
    yearCredit: number;
    /** Liste des opérations récentes */
    recentOperations: {
        id: string;
        label: string;
        amount: number;
        type: string;
        date: string;
        category: string;
        debit: number;
        credit: number;
    }[];
}

/** Service de récupération des données du tableau de bord. */
@Injectable({ providedIn: 'root' })
export class DashboardService {
    private http = inject(HttpClient);

    /**
     * Récupère les données agrégées du tableau de bord.
     * @returns {Observable<DashboardData>} Les données du tableau de bord
     */
    getDashboard(): Observable<DashboardData> {
        return this.http.get<DashboardData>(`${environment.apiUrl}/dashboard`);
    }
}
