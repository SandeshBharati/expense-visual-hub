
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction } from '@/types/models';
import { transactionService } from '@/services/transactionService';
import { toast } from 'sonner';

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  updateTransaction: (id: string, updatedData: Partial<Transaction>) => void;
  balance: number;
  expensesByCategory: Record<string, number>;
  incomesByCategory: Record<string, number>;
  monthlyData: {
    expenses: number[];
    incomes: number[];
  };
  exportToCSV: () => void;
  loading: boolean;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState(0);
  const [expensesByCategory, setExpensesByCategory] = useState<Record<string, number>>({});
  const [incomesByCategory, setIncomesByCategory] = useState<Record<string, number>>({});
  const [monthlyData, setMonthlyData] = useState<{ expenses: number[], incomes: number[] }>({
    expenses: Array(12).fill(0),
    incomes: Array(12).fill(0)
  });
  const [loading, setLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = () => {
    setLoading(true);
    try {
      // Get transactions from service
      const fetchedTransactions = transactionService.getTransactions();
      setTransactions(fetchedTransactions);
      
      // Calculate balance
      const calculatedBalance = transactionService.calculateBalance();
      setBalance(calculatedBalance);
      
      // Get expense and income data by category
      setExpensesByCategory(transactionService.getExpensesByCategory());
      setIncomesByCategory(transactionService.getIncomesByCategory());
      
      // Get monthly data
      const currentYear = new Date().getFullYear();
      setMonthlyData(transactionService.getMonthlyTotals(currentYear));
    } catch (error) {
      console.error('Error loading transactions:', error);
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = (transaction: Omit<Transaction, 'id'>) => {
    try {
      const newTransaction = transactionService.addTransaction(transaction);
      
      // Update state with new transaction
      setTransactions(prev => [...prev, newTransaction]);
      
      // Recalculate balance
      if (transaction.type === 'income') {
        setBalance(prev => prev + transaction.amount);
      } else {
        setBalance(prev => prev - transaction.amount);
      }
      
      // Update category data
      if (transaction.type === 'expense') {
        setExpensesByCategory(prev => ({
          ...prev,
          [transaction.category]: (prev[transaction.category] || 0) + transaction.amount
        }));
      } else {
        setIncomesByCategory(prev => ({
          ...prev,
          [transaction.category]: (prev[transaction.category] || 0) + transaction.amount
        }));
      }
      
      // Update monthly data
      const date = new Date(transaction.date);
      const month = date.getMonth();
      
      setMonthlyData(prev => {
        const updatedData = { ...prev };
        if (transaction.type === 'expense') {
          updatedData.expenses[month] += transaction.amount;
        } else {
          updatedData.incomes[month] += transaction.amount;
        }
        return updatedData;
      });
      
      toast.success('Transaction added successfully');
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast.error('Failed to add transaction');
    }
  };

  const handleDeleteTransaction = (id: string) => {
    try {
      // Find transaction before deleting
      const transaction = transactions.find(t => t.id === id);
      if (!transaction) return;
      
      // Delete transaction
      transactionService.deleteTransaction(id);
      
      // Update state
      setTransactions(prev => prev.filter(t => t.id !== id));
      
      // Update balance
      if (transaction.type === 'income') {
        setBalance(prev => prev - transaction.amount);
      } else {
        setBalance(prev => prev + transaction.amount);
      }
      
      // Update category data
      if (transaction.type === 'expense') {
        setExpensesByCategory(prev => {
          const updated = { ...prev };
          updated[transaction.category] -= transaction.amount;
          if (updated[transaction.category] <= 0) {
            delete updated[transaction.category];
          }
          return updated;
        });
      } else {
        setIncomesByCategory(prev => {
          const updated = { ...prev };
          updated[transaction.category] -= transaction.amount;
          if (updated[transaction.category] <= 0) {
            delete updated[transaction.category];
          }
          return updated;
        });
      }
      
      // Update monthly data
      const date = new Date(transaction.date);
      const month = date.getMonth();
      
      setMonthlyData(prev => {
        const updatedData = { ...prev };
        if (transaction.type === 'expense') {
          updatedData.expenses[month] -= transaction.amount;
        } else {
          updatedData.incomes[month] -= transaction.amount;
        }
        return updatedData;
      });
      
      toast.success('Transaction deleted successfully');
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('Failed to delete transaction');
    }
  };

  const handleUpdateTransaction = (id: string, updatedData: Partial<Transaction>) => {
    try {
      // Update the transaction
      const result = transactionService.updateTransaction(id, updatedData);
      if (!result) {
        toast.error('Transaction not found');
        return;
      }
      
      // Reload all data as the calculations can be complex with updates
      loadTransactions();
      
      toast.success('Transaction updated successfully');
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast.error('Failed to update transaction');
    }
  };

  const handleExportToCSV = () => {
    try {
      const csvContent = transactionService.exportTransactionsAsCSV();
      
      // Create a blob from the CSV content
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      
      // Create a download link
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `expense-tracker-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      // Append link to the document, trigger click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Transactions exported successfully');
    } catch (error) {
      console.error('Error exporting transactions:', error);
      toast.error('Failed to export transactions');
    }
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction: handleAddTransaction,
        deleteTransaction: handleDeleteTransaction,
        updateTransaction: handleUpdateTransaction,
        balance,
        expensesByCategory,
        incomesByCategory,
        monthlyData,
        exportToCSV: handleExportToCSV,
        loading,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};
