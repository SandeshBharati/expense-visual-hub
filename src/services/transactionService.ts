
import { Transaction } from '@/types/models';

// Mock data for transactions
const mockTransactions: Transaction[] = [
  {
    id: '1',
    amount: 2500,
    description: 'Monthly Salary',
    category: 'salary',
    date: '2023-04-01',
    type: 'income',
  },
  {
    id: '2',
    amount: 500,
    description: 'Freelance Project',
    category: 'freelance',
    date: '2023-04-05',
    type: 'income',
  },
  {
    id: '3',
    amount: 100,
    description: 'Grocery Shopping',
    category: 'food',
    date: '2023-04-06',
    type: 'expense',
  },
  {
    id: '4',
    amount: 80,
    description: 'Electricity Bill',
    category: 'bills',
    date: '2023-04-10',
    type: 'expense',
  },
  {
    id: '5',
    amount: 200,
    description: 'Weekend Trip',
    category: 'travel',
    date: '2023-04-15',
    type: 'expense',
  },
  {
    id: '6',
    amount: 150,
    description: 'New Clothes',
    category: 'shopping',
    date: '2023-04-18',
    type: 'expense',
  },
  {
    id: '7',
    amount: 70,
    description: 'Restaurant Dinner',
    category: 'food',
    date: '2023-04-20',
    type: 'expense',
  },
  {
    id: '8',
    amount: 50,
    description: 'Movie Night',
    category: 'entertainment',
    date: '2023-04-23',
    type: 'expense',
  },
  {
    id: '9',
    amount: 120,
    description: 'Medical Checkup',
    category: 'health',
    date: '2023-04-25',
    type: 'expense',
  },
  {
    id: '10',
    amount: 300,
    description: 'Online Course',
    category: 'education',
    date: '2023-04-28',
    type: 'expense',
  },
];

// Function to get transactions from localStorage or default to mock data
const getTransactions = (): Transaction[] => {
  const storedTransactions = localStorage.getItem('transactions');
  if (storedTransactions) {
    return JSON.parse(storedTransactions);
  }
  
  // If no transactions in localStorage, save the mock data and return it
  localStorage.setItem('transactions', JSON.stringify(mockTransactions));
  return mockTransactions;
};

// Add a new transaction
const addTransaction = (transaction: Omit<Transaction, 'id'>): Transaction => {
  const transactions = getTransactions();
  const newTransaction = {
    ...transaction,
    id: Date.now().toString(), // Generate a simple ID
  };
  
  transactions.push(newTransaction);
  localStorage.setItem('transactions', JSON.stringify(transactions));
  
  return newTransaction;
};

// Delete a transaction
const deleteTransaction = (id: string): void => {
  const transactions = getTransactions();
  const updatedTransactions = transactions.filter(t => t.id !== id);
  localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
};

// Get transaction by ID
const getTransactionById = (id: string): Transaction | undefined => {
  const transactions = getTransactions();
  return transactions.find(t => t.id === id);
};

// Update a transaction
const updateTransaction = (id: string, updatedData: Partial<Transaction>): Transaction | null => {
  const transactions = getTransactions();
  const index = transactions.findIndex(t => t.id === id);
  
  if (index === -1) {
    return null;
  }
  
  const updatedTransaction = { ...transactions[index], ...updatedData };
  transactions[index] = updatedTransaction;
  localStorage.setItem('transactions', JSON.stringify(transactions));
  
  return updatedTransaction;
};

// Calculate balance
const calculateBalance = (): number => {
  const transactions = getTransactions();
  return transactions.reduce((balance, transaction) => {
    if (transaction.type === 'income') {
      return balance + transaction.amount;
    } else {
      return balance - transaction.amount;
    }
  }, 0);
};

// Get expenses grouped by category
const getExpensesByCategory = (): Record<string, number> => {
  const transactions = getTransactions();
  const expenses = transactions.filter(t => t.type === 'expense');
  
  return expenses.reduce((acc, expense) => {
    const { category, amount } = expense;
    acc[category] = (acc[category] || 0) + amount;
    return acc;
  }, {} as Record<string, number>);
};

// Get incomes grouped by category
const getIncomesByCategory = (): Record<string, number> => {
  const transactions = getTransactions();
  const incomes = transactions.filter(t => t.type === 'income');
  
  return incomes.reduce((acc, income) => {
    const { category, amount } = income;
    acc[category] = (acc[category] || 0) + amount;
    return acc;
  }, {} as Record<string, number>);
};

// Get monthly expense and income totals
const getMonthlyTotals = (year: number): {
  expenses: number[];
  incomes: number[];
} => {
  const transactions = getTransactions();
  const result = {
    expenses: Array(12).fill(0),
    incomes: Array(12).fill(0)
  };
  
  transactions.forEach(transaction => {
    const date = new Date(transaction.date);
    if (date.getFullYear() === year) {
      const month = date.getMonth();
      if (transaction.type === 'expense') {
        result.expenses[month] += transaction.amount;
      } else {
        result.incomes[month] += transaction.amount;
      }
    }
  });
  
  return result;
};

// Export transaction data as CSV
const exportTransactionsAsCSV = (): string => {
  const transactions = getTransactions();
  const header = 'ID,Amount,Description,Category,Date,Type\n';
  
  const csvContent = transactions.map(t => {
    return `${t.id},${t.amount},"${t.description}",${t.category},${t.date},${t.type}`;
  }).join('\n');
  
  return header + csvContent;
};

export const transactionService = {
  getTransactions,
  addTransaction,
  deleteTransaction,
  getTransactionById,
  updateTransaction,
  calculateBalance,
  getExpensesByCategory,
  getIncomesByCategory,
  getMonthlyTotals,
  exportTransactionsAsCSV,
};
