export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: Date;
  notes?: string;
}

export type FilterPeriod = 'all' | 'today' | 'week' | 'month' | 'year';