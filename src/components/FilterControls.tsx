import React from 'react';
import { FilterPeriod } from '../types/expense';

interface FilterControlsProps {
  selectedPeriod: FilterPeriod;
  onPeriodChange: (period: FilterPeriod) => void;
  expenseCount: number;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  selectedPeriod,
  onPeriodChange,
  expenseCount
}) => {
  const periods: { value: FilterPeriod; label: string }[] = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' }
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Filter Expenses</h3>
          <p className="text-sm text-gray-500">
            Showing {expenseCount} expense{expenseCount !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {periods.map((period) => (
            <button
              key={period.value}
              onClick={() => onPeriodChange(period.value)}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                selectedPeriod === period.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};