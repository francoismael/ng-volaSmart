import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Operation } from '../../operations/models/operation.model';

/** Données du grand livre : liste des opérations et totaux. */
export interface LedgerData {
    /** Liste complète des opérations */
    operations: Operation[];
    /** Total des débits */
    totalDebit: number;
    /** Total des crédits */
    totalCredit: number;
    /** Solde résultant */
    balance: number;
}

/** Service de récupération des données du grand livre comptable. */
@Injectable({ providedIn: 'root' })
export class LedgerService {
    private http = inject(HttpClient);

    /**
     * Récupère les données du grand livre.
     * @returns {Observable<LedgerData>} Les opérations et totaux du grand livre
     */
    getLedger(): Observable<LedgerData> {
        return this.http.get<LedgerData>('http://localhost:3000/ledger');
    }
}
