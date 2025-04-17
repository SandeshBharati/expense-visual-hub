
export interface User {
  name: string;
  email: string;
  isAuthenticated: boolean;
}

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  type: 'income' | 'expense';
}

export type ExpenseCategory = 
  | 'food' 
  | 'bills' 
  | 'travel' 
  | 'shopping' 
  | 'entertainment'
  | 'health'
  | 'education'
  | 'other';

export type IncomeCategory = 
  | 'salary'
  | 'freelance'
  | 'gifts'
  | 'investments'
  | 'other';

export const ExpenseCategoryLabels: Record<ExpenseCategory, string> = {
  food: 'Food & Dining',
  bills: 'Bills & Utilities',
  travel: 'Travel',
  shopping: 'Shopping',
  entertainment: 'Entertainment',
  health: 'Health & Medical',
  education: 'Education',
  other: 'Other'
};

export const IncomeCategoryLabels: Record<IncomeCategory, string> = {
  salary: 'Salary',
  freelance: 'Freelance',
  gifts: 'Gifts',
  investments: 'Investments',
  other: 'Other'
};

export const ExpenseCategoryColors: Record<ExpenseCategory, string> = {
  food: '#FF5252',
  bills: '#448AFF',
  travel: '#FFCA28',
  shopping: '#66BB6A',
  entertainment: '#AB47BC',
  health: '#EC407A',
  education: '#7E57C2',
  other: '#78909C'
};

export const IncomeCategoryColors: Record<IncomeCategory, string> = {
  salary: '#4CAF50',
  freelance: '#8BC34A',
  gifts: '#CDDC39',
  investments: '#00BCD4',
  other: '#9E9E9E'
};
