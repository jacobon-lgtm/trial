import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { ExpenseSummary } from './components/ExpenseSummary';
import { FilterControls } from './components/FilterControls';
import { ExcelUpload } from './components/ExcelUpload';
import { Expense, FilterPeriod } from './types/expense';
import { filterExpensesByPeriod, getPeriodLabel } from './utils/dateFilters';
import { Wallet, TrendingUp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';

// Custom hook for debounced localStorage operations
const useDebouncedLocalStorage = (key: string, value: any, delay: number = 1000) => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error('Failed to save to localStorage:', error);
      }
    }, delay);
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [key, value, delay]);
};

// Custom hook for safe localStorage operations
const useLocalStorage = (key: string, defaultValue: any) => {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        // Ensure dates are properly converted
        return Array.isArray(parsed) 
          ? parsed.map((expense: any) => ({
              ...expense,
              date: new Date(expense.date)
            }))
          : parsed;
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
    }
    return defaultValue;
  });
  
  return [value, setValue] as const;
};

const Index = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>('all');
  const [error, setError] = useState<string | null>(null);

  // Use custom hook for localStorage
  const [savedExpenses, setSavedExpenses] = useLocalStorage('expenses', []);
  
  // Load expenses from localStorage on component mount
  useEffect(() => {
    setExpenses(savedExpenses);
  }, [savedExpenses]);

  // Debounced localStorage save
  useDebouncedLocalStorage('expenses', expenses);

  // Memoized filtered expenses to prevent unnecessary recalculations
  const filteredExpenses = useMemo(() => 
    filterExpensesByPeriod(expenses, filterPeriod),
    [expenses, filterPeriod]
  );

  // Memoized expense count
  const expenseCount = useMemo(() => filteredExpenses.length, [filteredExpenses]);

  // Optimized expense handlers with error handling
  const handleAddExpense = useCallback((expenseData: Omit<Expense, 'id'>) => {
    try {
      const newExpense: Expense = {
        ...expenseData,
        id: crypto.randomUUID(),
      };
      setExpenses(prev => [newExpense, ...prev]);
      setError(null);
    } catch (error) {
      setError('Failed to add expense');
      console.error('Error adding expense:', error);
    }
  }, []);

  const handleUploadExpenses = useCallback((uploadedExpenses: Omit<Expense, 'id'>[]) => {
    try {
      const newExpenses: Expense[] = uploadedExpenses.map(expense => ({
        ...expense,
        id: crypto.randomUUID(),
      }));
      setExpenses(prev => [...newExpenses, ...prev]);
      setError(null);
    } catch (error) {
      setError('Failed to upload expenses');
      console.error('Error uploading expenses:', error);
    }
  }, []);

  // Memoized period label
  const periodLabel = useMemo(() => getPeriodLabel(filterPeriod), [filterPeriod]);

  // Error display component
  const ErrorDisplay = () => error ? (
    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
      <p className="text-red-800 text-sm">{error}</p>
    </div>
  ) : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Expense Tracker</h1>
              <p className="text-white/80">Keep track of your daily spending</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-white/90">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">Smart financial tracking made simple</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Error Display */}
        <ErrorDisplay />
        
        {/* Filter Controls */}
        <div className="mb-8">
          <FilterControls
            selectedPeriod={filterPeriod}
            onPeriodChange={setFilterPeriod}
            expenseCount={expenseCount}
          />
        </div>

        {/* Summary */}
        <ExpenseSummary expenses={filteredExpenses} />
        
        {/* Input Methods */}
        <Tabs defaultValue="manual" className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            <TabsTrigger value="upload">Excel Upload</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manual" className="mt-6">
            <ExpenseForm onAddExpense={handleAddExpense} />
          </TabsContent>
          
          <TabsContent value="upload" className="mt-6">
            <ExcelUpload onUploadExpenses={handleUploadExpenses} />
          </TabsContent>
        </Tabs>
        
        {/* Expenses List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-foreground">
              Expenses - {periodLabel}
            </h2>
          </div>
          <ExpenseList expenses={filteredExpenses} />
        </div>
      </div>
    </div>
  );
};

export default Index;