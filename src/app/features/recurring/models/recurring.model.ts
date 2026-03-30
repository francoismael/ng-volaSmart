export type RecurringFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';
export type RecurringType = 'debit' | 'credit';

export interface RecurringOperation {
  id: string;
  label: string;
  amount: number;
  type: RecurringType;
  frequency: RecurringFrequency;
  dayOfMonth?: number;
  daysOfWeek?: number[];  // [0=dim, 1=lun, 2=mar, 3=mer, 4=jeu, 5=ven, 6=sam]
  isActive: boolean;
  notes?: string;
  nextDate?: string;
  lastExecutedDate?: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

export const FREQUENCY_SHORT: Record<RecurringFrequency, string> = {
  daily:   'Quotidien',
  weekly:  'Hebdomadaire',
  monthly: 'Mensuel',
  yearly:  'Annuel',
};

export const DAY_OF_WEEK_LABELS: string[] = [
  'Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam',
];

export const DAY_OF_WEEK_FULL: string[] = [
  'Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi',
];
