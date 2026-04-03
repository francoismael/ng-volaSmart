/** Fréquences possibles pour une opération récurrente. */
export type RecurringFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';
/** Type d'opération récurrente : débit ou crédit. */
export type RecurringType = 'debit' | 'credit';

/** Représentation d'une opération récurrente planifiée. */
export interface RecurringOperation {
    id: string;
    /** Libellé de l'opération */
    label: string;
    /** Montant de l'opération */
    amount: number;
    /** Type : débit ou crédit */
    type: RecurringType;
    /** Fréquence de récurrence */
    frequency: RecurringFrequency;
    /** Jour du mois pour les récurrences mensuelles */
    dayOfMonth?: number;
    /** Jours de la semaine [0=dim, 1=lun, 2=mar, 3=mer, 4=jeu, 5=ven, 6=sam] */
    daysOfWeek?: number[];
    /** Indique si l'opération est active */
    isActive: boolean;
    /** Notes complémentaires */
    notes?: string;
    /** Prochaine date d'exécution (ISO) */
    nextDate?: string;
    /** Date de dernière exécution (ISO) */
    lastExecutedDate?: string;
    /** Identifiant du propriétaire */
    userId: string;
    /** Date de création */
    createdAt?: string;
    /** Date de dernière modification */
    updatedAt?: string;
}

/** Libellés courts pour chaque fréquence de récurrence. */
export const FREQUENCY_SHORT: Record<RecurringFrequency, string> = {
    daily: 'Quotidien',
    weekly: 'Hebdomadaire',
    monthly: 'Mensuel',
    yearly: 'Annuel',
};

/** Libellés abrégés des jours de la semaine (index 0 = Dimanche). */
export const DAY_OF_WEEK_LABELS: string[] = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

/** Libellés complets des jours de la semaine (index 0 = Dimanche). */
export const DAY_OF_WEEK_FULL: string[] = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
