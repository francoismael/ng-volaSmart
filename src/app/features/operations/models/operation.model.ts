/** Représentation d'une opération comptable (débit ou crédit). */
export interface Operation {
    id: string;
    /** Date de l'opération (ISO) */
    date: string;
    /** Libellé descriptif */
    label: string;
    /** Montant débité */
    debit: number;
    /** Montant crédité */
    credit: number;
    /** Identifiant du compte associé */
    accountId?: string;
    /** Identifiant du propriétaire */
    userId: string;
    /** Catégorie de l'opération */
    category?: string;
    /** Notes complémentaires */
    notes?: string;
    /** Utilisateur ayant créé l'opération */
    createdBy?: string;
    /** Utilisateur ayant modifié l'opération */
    updatedBy?: string;
    /** Date de création */
    createdAt?: string;
    /** Date de dernière modification */
    updatedAt?: string;
}
