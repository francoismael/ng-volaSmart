export interface Operation {
  id: string;
  date: string;
  label: string;
  debit: number;
  credit: number;
  accountId?: string;
  userId: string;
  category?: string;
  notes?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}
