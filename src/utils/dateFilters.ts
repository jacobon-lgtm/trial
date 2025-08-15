import { Expense, FilterPeriod } from '../types/expense';

export const filterExpensesByPeriod = (expenses: Expense[], period: FilterPeriod): Expense[] => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  switch (period) {
    case 'today':
      return expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= startOfDay;
      });
    
    case 'week':
      const startOfWeek = new Date(startOfDay);
      startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
      return expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= startOfWeek;
      });
    
    case 'month':
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      return expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= startOfMonth;
      });
    
    case 'year':
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      return expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= startOfYear;
      });
    
    default:
      return expenses;
  }
};

export const getPeriodLabel = (period: FilterPeriod): string => {
  switch (period) {
    case 'today': return 'Today';
    case 'week': return 'This Week';
    case 'month': return 'This Month';
    case 'year': return 'This Year';
    default: return 'All Time';
  }
};