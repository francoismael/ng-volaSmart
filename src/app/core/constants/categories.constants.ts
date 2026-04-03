/** Définition d'une catégorie d'opération avec sa clé, son libellé et sa couleur. */
export interface Category {
    /** Identifiant technique de la catégorie */
    key: string;
    /** Libellé affiché à l'utilisateur */
    label: string;
    /** Couleur hexadécimale associée */
    color: string;
}

/** Liste des catégories disponibles pour les opérations. */
export const CATEGORIES: Category[] = [
    { key: 'alimentation', label: 'Alimentation', color: '#F97316' },
    { key: 'transport', label: 'Transport', color: '#3B82F6' },
    { key: 'logement', label: 'Logement', color: '#8B5CF6' },
    { key: 'sante', label: 'Santé', color: '#EF4444' },
    { key: 'loisirs', label: 'Loisirs', color: '#EC4899' },
    { key: 'salaire', label: 'Salaire', color: '#10B981' },
    { key: 'epargne', label: 'Épargne', color: '#F59E0B' },
    { key: 'education', label: 'Éducation', color: '#6366F1' },
    { key: 'vetements', label: 'Vêtements', color: '#06B6D4' },
    { key: 'factures', label: 'Factures', color: '#64748B' },
    { key: 'remboursement', label: 'Remboursement', color: '#A855F7' },
    { key: 'autres', label: 'Autres', color: '#6B7280' },
];

/**
 * Retourne le libellé d'une catégorie à partir de sa clé.
 * @param {string} key - Clé de la catégorie
 * @returns {string} Libellé correspondant ou la clé si non trouvée
 */
export function getCategoryLabel(key: string): string {
    return CATEGORIES.find((c) => c.key === key)?.label ?? key ?? 'Autres';
}

/**
 * Retourne la couleur associée à une catégorie.
 * @param {string} key - Clé de la catégorie
 * @returns {string} Code couleur hexadécimal
 */
export function getCategoryColor(key: string): string {
    return CATEGORIES.find((c) => c.key === key)?.color ?? '#6B7280';
}
