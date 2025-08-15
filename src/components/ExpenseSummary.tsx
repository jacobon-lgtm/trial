import React, { useMemo } from 'react';
import { Expense } from '../types/expense';

interface ExpenseSummaryProps {
  expenses: Expense[];
}

export const ExpenseSummary: React.FC<ExpenseSummaryProps> = ({ expenses }) => {
  const summary = useMemo(() => {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const count = expenses.length;
    
    const byCategory = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);
    
    const topCategory = Object.entries(byCategory)
      .sort(([, a], [, b]) => b - a)[0];
    
    return { total, count, byCategory, topCategory };
  }, [expenses]);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (expenses.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <div className="text-center">
          <div className="text-gray-400 text-4xl mb-2">📊</div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No expenses to summarize</h3>
          <p className="text-gray-500">Add some expenses to see your spending summary</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Spending Summary</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {formatAmount(summary.total)}
          </div>
          <div className="text-sm text-gray-500">Total Spent</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {summary.count}
          </div>
          <div className="text-sm text-gray-500">Total Expenses</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600 mb-1">
            {summary.count > 0 ? formatAmount(summary.total / summary.count) : '$0.00'}
          </div>
          <div className="text-sm text-gray-500">Average per Expense</div>
        </div>
      </div>
      
      {summary.topCategory && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">Top Spending Category</div>
            <div className="text-lg font-medium text-gray-900">
              {summary.topCategory[0]} - {formatAmount(summary.topCategory[1])}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};