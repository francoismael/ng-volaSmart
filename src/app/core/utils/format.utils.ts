/**
 * Formate un montant en format français (séparateur de milliers, sans décimales).
 * @param {number} amount - Montant à formater
 * @returns {string} Montant formaté (ex: "1 250")
 */
export function formatAmount(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount ?? 0);
}

/**
 * Formate un montant en notation compacte (K pour milliers, M pour millions).
 * @param {number} amount - Montant à formater
 * @returns {string} Montant compact (ex: "1.2M", "350K")
 */
export function formatCompact(amount: number): string {
    if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M`;
    if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)}K`;
    return String(Math.round(amount));
}
