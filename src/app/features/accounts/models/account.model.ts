/** Types de comptes disponibles dans l'application. */
export type AccountType = 'caisse' | 'banque' | 'nourriture' | 'salaire' | 'transport' | 'investissement' | 'autre';

/** Représentation d'un compte utilisateur. */
export interface Account {
    id: string;
    /** Nom du compte */
    name: string;
    /** Type de compte */
    type: AccountType;
    /** Identifiant du propriétaire */
    userId: string;
    /** Description optionnelle du compte */
    description?: string;
}

/** Libellés affichés pour chaque type de compte. */
export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
    caisse: '💵 Caisse',
    banque: '🏦 Banque',
    nourriture: '🍽️ Nourriture',
    salaire: '💼 Salaire',
    transport: '🚗 Transport',
    investissement: '📈 Investissement',
    autre: '📦 Autre',
};
