export type AccountType = 'caisse' | 'banque' | 'nourriture' | 'salaire' | 'transport' | 'investissement' | 'autre';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  userId: string;
  description?: string;
}

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  caisse: '💵 Caisse',
  banque: '🏦 Banque',
  nourriture: '🍽️ Nourriture',
  salaire: '💼 Salaire',
  transport: '🚗 Transport',
  investissement: '📈 Investissement',
  autre: '📦 Autre',
};
