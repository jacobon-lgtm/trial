import React from 'react';
import { Expense } from '../types/expense';

interface ExpenseListProps {
  expenses: Expense[];
}

export const ExpenseList: React.FC<ExpenseListProps> = ({ expenses }) => {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">💰</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No expenses yet</h3>
        <p className="text-gray-500">Start tracking your expenses by adding your first one above.</p>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Food': 'bg-green-100 text-green-800',
      'Transport': 'bg-blue-100 text-blue-800',
      'Shopping': 'bg-purple-100 text-purple-800',
      'Entertainment': 'bg-yellow-100 text-yellow-800',
      'Bills': 'bg-red-100 text-red-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors['Other'];
  };

  return (
    <div className="space-y-3">
      {expenses.map((expense) => (
        <div
          key={expense.id}
          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-medium text-gray-900">{expense.description}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(expense.category)}`}>
                  {expense.category}
                </span>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{formatDate(expense.date)}</span>
                {expense.notes && (
                  <span className="italic">"{expense.notes}"</span>
                )}
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-lg font-semibold text-gray-900">
                {formatAmount(expense.amount)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};