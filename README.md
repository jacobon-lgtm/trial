# Expense Tracker

A modern, optimized React expense tracking application with performance improvements and error handling.

## 🚀 Features

- **Manual Expense Entry**: Add expenses with description, amount, category, date, and notes
- **CSV Upload**: Bulk import expenses from CSV files
- **Smart Filtering**: Filter expenses by time periods (Today, Week, Month, Year, All Time)
- **Real-time Summary**: View spending totals, counts, and category breakdowns
- **Local Storage**: Data persists between sessions
- **Responsive Design**: Works on desktop and mobile devices
- **Performance Optimized**: Debounced saves, memoized calculations, and efficient re-renders

## 🛠️ Performance Optimizations

- **Debounced localStorage**: Prevents excessive writes (1-second delay)
- **Memoized Calculations**: Filtered expenses and counts are cached
- **Callback Optimization**: Event handlers wrapped with useCallback
- **Custom Hooks**: Reusable localStorage operations with error handling
- **Error Boundaries**: Graceful error handling and user feedback

## 📦 Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## 🎯 Usage

### Adding Expenses
1. Use the "Manual Entry" tab to add individual expenses
2. Fill in the required fields (Description, Amount, Category, Date)
3. Add optional notes if needed
4. Click "Add Expense"

### Uploading CSV Files
1. Switch to the "Excel Upload" tab
2. Prepare a CSV file with columns: Description, Amount, Category, Date, Notes
3. Drag and drop the file or click "browse files"
4. The system will automatically parse and import valid expenses

### Filtering Expenses
- Use the filter buttons to view expenses by time period
- View real-time counts and summaries for each period
- Switch between different time views instantly

## 🏗️ Project Structure

```
src/
├── components/
│   ├── ExpenseForm.tsx      # Manual expense entry form
│   ├── ExpenseList.tsx      # Display list of expenses
│   ├── ExpenseSummary.tsx   # Spending statistics and totals
│   ├── FilterControls.tsx   # Time period filtering
│   ├── ExcelUpload.tsx      # CSV file upload and parsing
│   └── ui/
│       └── tabs.tsx         # Custom tabs component
├── types/
│   └── expense.ts           # TypeScript type definitions
├── utils/
│   └── dateFilters.ts       # Date filtering utilities
├── App.tsx                  # Main application component
├── Index.tsx                # Optimized expense tracker component
└── main.tsx                 # Application entry point
```

## 🔧 Technical Details

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **Styling**: Tailwind CSS for responsive design
- **Icons**: Lucide React for beautiful icons
- **State Management**: React hooks with custom localStorage hooks
- **Performance**: useMemo, useCallback, and debounced operations

## 🐛 Bug Fixes Applied

- **localStorage Error Handling**: Added try-catch blocks for all localStorage operations
- **Date Parsing Safety**: Improved date conversion with proper error handling
- **Memory Leak Prevention**: Proper cleanup of timeouts and effects
- **Error States**: Comprehensive error management and user feedback
- **Type Safety**: Better TypeScript integration and type checking

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🚀 Build for Production

```bash
npm run build
```

The optimized build will be created in the `dist/` directory.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.