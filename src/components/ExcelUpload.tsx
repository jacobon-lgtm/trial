import React, { useState } from 'react';
import { Expense } from '../types/expense';

interface ExcelUploadProps {
  onUploadExpenses: (expenses: Omit<Expense, 'id'>[]) => void;
}

export const ExcelUpload: React.FC<ExcelUploadProps> = ({ onUploadExpenses }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setErrorMessage('Please upload a CSV file');
      setUploadStatus('error');
      return;
    }

    setUploadStatus('uploading');
    setErrorMessage('');

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string;
        const expenses = parseCSV(csv);
        
        if (expenses.length === 0) {
          setErrorMessage('No valid expenses found in the CSV file');
          setUploadStatus('error');
          return;
        }

        onUploadExpenses(expenses);
        setUploadStatus('success');
        
        // Reset status after 3 seconds
        setTimeout(() => setUploadStatus('idle'), 3000);
      } catch (error) {
        setErrorMessage('Failed to parse CSV file');
        setUploadStatus('error');
      }
    };

    reader.onerror = () => {
      setErrorMessage('Failed to read file');
      setUploadStatus('error');
    };

    reader.readAsText(file);
  };

  const parseCSV = (csv: string): Omit<Expense, 'id'>[] => {
    const lines = csv.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const expenses: Omit<Expense, 'id'>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.length < 4) continue;

      try {
        const expense: Omit<Expense, 'id'> = {
          description: values[0] || 'Unknown',
          amount: parseFloat(values[1]) || 0,
          category: values[2] || 'Other',
          date: new Date(values[3]) || new Date(),
          notes: values[4] || undefined
        };

        if (expense.amount > 0 && expense.description) {
          expenses.push(expense);
        }
      } catch (error) {
        console.warn('Skipping invalid row:', values);
      }
    }

    return expenses;
  };

  const getStatusMessage = () => {
    switch (uploadStatus) {
      case 'uploading':
        return 'Processing file...';
      case 'success':
        return 'Expenses uploaded successfully!';
      case 'error':
        return errorMessage;
      default:
        return '';
    }
  };

  const getStatusColor = () => {
    switch (uploadStatus) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'uploading':
        return 'text-blue-600';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Expenses from CSV</h3>
        <p className="text-sm text-gray-500 mb-4">
          Upload a CSV file with columns: Description, Amount, Category, Date, Notes (optional)
        </p>
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="text-gray-400 text-4xl mb-4">📁</div>
        <p className="text-gray-600 mb-2">
          Drag and drop your CSV file here, or{' '}
          <label className="text-blue-600 hover:text-blue-700 cursor-pointer">
            browse files
            <input
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        </p>
        <p className="text-sm text-gray-500">
          Supports CSV files with expense data
        </p>
      </div>

      {uploadStatus !== 'idle' && (
        <div className={`text-center p-3 rounded-md ${getStatusColor()}`}>
          {getStatusMessage()}
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">CSV Format Example:</h4>
        <div className="text-sm text-gray-600 font-mono bg-white p-3 rounded border">
          Description,Amount,Category,Date,Notes<br/>
          Coffee,4.50,Food,2024-01-15,Morning coffee<br/>
          Bus fare,2.75,Transport,2024-01-15,Work commute
        </div>
      </div>
    </div>
  );
};