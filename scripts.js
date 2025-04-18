// Constants for expense and income categories
const ExpenseCategoryLabels = {
  food: 'Food & Dining',
  bills: 'Bills & Utilities',
  travel: 'Travel',
  shopping: 'Shopping',
  entertainment: 'Entertainment',
  health: 'Health & Medical',
  education: 'Education',
  other: 'Other'
};

const IncomeCategoryLabels = {
  salary: 'Salary',
  freelance: 'Freelance',
  gifts: 'Gifts',
  investments: 'Investments',
  other: 'Other'
};

const ExpenseCategoryColors = {
  food: '#FF5252',
  bills: '#448AFF',
  travel: '#FFCA28',
  shopping: '#66BB6A',
  entertainment: '#AB47BC',
  health: '#EC407A',
  education: '#7E57C2',
  other: '#78909C'
};

const IncomeCategoryColors = {
  salary: '#4CAF50',
  freelance: '#8BC34A',
  gifts: '#CDDC39',
  investments: '#00BCD4',
  other: '#9E9E9E'
};

// Mock data for initial transactions
const mockTransactions = [
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

// State management
const state = {
  user: null,
  transactions: [],
  currentPage: 'dashboard'
};

// Helper functions
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getCategoryLabel(transaction) {
  if (transaction.type === 'expense') {
    return ExpenseCategoryLabels[transaction.category] || transaction.category;
  } else {
    return IncomeCategoryLabels[transaction.category] || transaction.category;
  }
}

function generateUniqueId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

// Transaction service
const transactionService = {
  getTransactions() {
    const storedTransactions = localStorage.getItem('transactions');
    if (storedTransactions) {
      return JSON.parse(storedTransactions);
    }
    
    // If no transactions in localStorage, save the mock data and return it
    localStorage.setItem('transactions', JSON.stringify(mockTransactions));
    return mockTransactions;
  },
  
  addTransaction(transaction) {
    const transactions = this.getTransactions();
    const newTransaction = {
      ...transaction,
      id: generateUniqueId(),
    };
    
    transactions.push(newTransaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    return newTransaction;
  },
  
  deleteTransaction(id) {
    const transactions = this.getTransactions();
    const updatedTransactions = transactions.filter(t => t.id !== id);
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
  },
  
  calculateBalance() {
    const transactions = this.getTransactions();
    return transactions.reduce((balance, transaction) => {
      if (transaction.type === 'income') {
        return balance + transaction.amount;
      } else {
        return balance - transaction.amount;
      }
    }, 0);
  },
  
  getExpensesByCategory() {
    const transactions = this.getTransactions();
    const expenses = transactions.filter(t => t.type === 'expense');
    
    return expenses.reduce((acc, expense) => {
      const { category, amount } = expense;
      acc[category] = (acc[category] || 0) + amount;
      return acc;
    }, {});
  },
  
  getIncomesByCategory() {
    const transactions = this.getTransactions();
    const incomes = transactions.filter(t => t.type === 'income');
    
    return incomes.reduce((acc, income) => {
      const { category, amount } = income;
      acc[category] = (acc[category] || 0) + amount;
      return acc;
    }, {});
  },
  
  getMonthlyTotals(year) {
    const transactions = this.getTransactions();
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
  },
  
  exportTransactionsAsCSV() {
    const transactions = this.getTransactions();
    const header = 'ID,Amount,Description,Category,Date,Type\n';
    
    const csvContent = transactions.map(t => {
      return `${t.id},${t.amount},"${t.description}",${t.category},${t.date},${t.type}`;
    }).join('\n');
    
    return header + csvContent;
  },
};

// Authentication service
const authService = {
  register(userData) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if email already exists
    if (users.find(user => user.email === userData.email)) {
      throw new Error('Email already registered');
    }
    
    const newUser = {
      ...userData,
      id: generateUniqueId(),
      isAuthenticated: true
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Set current user in session storage
    this.setCurrentUser(newUser);
    
    return newUser;
  },
  
  login(credentials) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === credentials.email);
    
    if (!user || user.password !== credentials.password) {
      throw new Error('Invalid email or password');
    }
    
    // Update user authentication status
    user.isAuthenticated = true;
    localStorage.setItem('users', JSON.stringify(users));
    
    // Set current user in session storage
    this.setCurrentUser(user);
    
    return user;
  },
  
  logout() {
    // Remove user from session storage
    sessionStorage.removeItem('currentUser');
  },
  
  getCurrentUser() {
    const userStr = sessionStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  },
  
  setCurrentUser(user) {
    sessionStorage.setItem('currentUser', JSON.stringify(user));
  },
  
  isAuthenticated() {
    const user = this.getCurrentUser();
    return !!user;
  }
};

// UI elements
const elements = {
  // Auth elements
  authContainer: document.getElementById('auth-container'),
  loginForm: document.getElementById('login-form'),
  registerForm: document.getElementById('register-form'),
  loginFormElement: document.getElementById('login-form-element'),
  registerFormElement: document.getElementById('register-form-element'),
  switchToRegisterBtn: document.getElementById('switch-to-register'),
  switchToLoginBtn: document.getElementById('switch-to-login'),
  
  // App elements
  appContainer: document.getElementById('app-container'),
  userInitial: document.getElementById('user-initial'),
  userName: document.getElementById('user-name'),
  userEmail: document.getElementById('user-email'),
  logoutBtn: document.getElementById('logout-btn'),
  
  // Navigation
  navItems: document.querySelectorAll('.nav-item'),
  
  // Pages
  pages: document.querySelectorAll('.page'),
  dashboardPage: document.getElementById('dashboard-page'),
  transactionsPage: document.getElementById('transactions-page'),
  
  // Dashboard elements
  balanceAmount: document.getElementById('balance-amount'),
  totalIncome: document.getElementById('total-income'),
  totalExpense: document.getElementById('total-expense'),
  monthlyChart: document.getElementById('monthly-chart'),
  expensesPieChart: document.getElementById('expenses-pie-chart'),
  recentTransactionsList: document.getElementById('recent-transactions-list'),
  
  // Transaction elements
  addTransactionBtn: document.getElementById('add-transaction-btn'),
  exportBtn: document.getElementById('export-btn'),
  transactionModal: document.getElementById('transaction-modal'),
  modalClose: document.querySelector('.modal-close'),
  tabBtns: document.querySelectorAll('.tab-btn'),
  expenseForm: document.getElementById('expense-form'),
  incomeForm: document.getElementById('income-form'),
  tabContents: document.querySelectorAll('.tab-content'),
  searchTransactions: document.getElementById('search-transactions'),
  filterType: document.getElementById('filter-type'),
  filterCategory: document.getElementById('filter-category'),
  transactionsTableBody: document.getElementById('transactions-table-body'),
  
  // Toast
  toastContainer: document.getElementById('toast-container')
};

// Chart instances
let monthlyChart = null;
let expensePieChart = null;

// Reports Page Functions
function initializeReportsPage() {
  updateExpensePieChart();
  updateIncomePieChart();
  updateMonthlyTrendChart();
  updateBalanceLineChart();
}

function updateExpensePieChart() {
  const expenseData = transactionService.getExpensesByCategory();
  const ctx = document.getElementById('expense-pie-chart').getContext('2d');
  
  const data = Object.entries(expenseData).map(([category, amount]) => ({
    label: ExpenseCategoryLabels[category] || category,
    value: amount,
    color: ExpenseCategoryColors[category] || '#999'
  }));

  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: data.map(d => d.label),
      datasets: [{
        data: data.map(d => d.value),
        backgroundColor: data.map(d => d.color)
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const value = context.raw;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = Math.round((value / total) * 100);
              return `${formatCurrency(value)} (${percentage}%)`;
            }
          }
        }
      }
    }
  });
}

function updateIncomePieChart() {
  const incomeData = transactionService.getIncomesByCategory();
  const ctx = document.getElementById('income-pie-chart').getContext('2d');
  
  const data = Object.entries(incomeData).map(([category, amount]) => ({
    label: IncomeCategoryLabels[category] || category,
    value: amount,
    color: IncomeCategoryColors[category] || '#999'
  }));

  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: data.map(d => d.label),
      datasets: [{
        data: data.map(d => d.value),
        backgroundColor: data.map(d => d.color)
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const value = context.raw;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = Math.round((value / total) * 100);
              return `${formatCurrency(value)} (${percentage}%)`;
            }
          }
        }
      }
    }
  });
}

function updateMonthlyTrendChart() {
  const monthlyData = transactionService.getMonthlyTotals(new Date().getFullYear());
  const ctx = document.getElementById('monthly-trend-chart').getContext('2d');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Income',
          data: monthlyData.incomes,
          backgroundColor: '#4ade80',
        },
        {
          label: 'Expenses',
          data: monthlyData.expenses,
          backgroundColor: '#f87171',
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: value => formatCurrency(value)
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: context => `${context.dataset.label}: ${formatCurrency(context.raw)}`
          }
        }
      }
    }
  });
}

function updateBalanceLineChart() {
  const monthlyData = transactionService.getMonthlyTotals(new Date().getFullYear());
  const ctx = document.getElementById('balance-line-chart').getContext('2d');

  const balanceData = monthlyData.incomes.map((income, index) => 
    income - monthlyData.expenses[index]
  );

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        label: 'Net Balance',
        data: balanceData,
        borderColor: '#9b87f5',
        tension: 0.1,
        fill: true
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          ticks: {
            callback: value => formatCurrency(value)
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: context => `Balance: ${formatCurrency(context.raw)}`
          }
        }
      }
    }
  });
}

// Categories Page Functions
function initializeCategoriesPage() {
  renderExpenseCategories();
  renderIncomeCategories();
  setupCategoryTabs();
}

function renderExpenseCategories() {
  const container = document.getElementById('expense-categories-grid');
  container.innerHTML = '';

  Object.entries(ExpenseCategoryLabels).forEach(([id, label]) => {
    const card = document.createElement('div');
    card.className = 'category-card';
    card.innerHTML = `
      <div class="category-icon" style="background-color: ${ExpenseCategoryColors[id]}">
        ${label.charAt(0)}
      </div>
      <span>${label}</span>
    `;
    container.appendChild(card);
  });
}

function renderIncomeCategories() {
  const container = document.getElementById('income-categories-grid');
  container.innerHTML = '';

  Object.entries(IncomeCategoryLabels).forEach(([id, label]) => {
    const card = document.createElement('div');
    card.className = 'category-card';
    card.innerHTML = `
      <div class="category-icon" style="background-color: ${IncomeCategoryColors[id]}">
        ${label.charAt(0)}
      </div>
      <span>${label}</span>
    `;
    container.appendChild(card);
  });
}

function setupCategoryTabs() {
  const tabBtns = document.querySelectorAll('.categories-tabs .tab-btn');
  const tabContents = document.querySelectorAll('.categories-tabs .tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      
      // Update active states
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === tab) {
          content.classList.add('active');
        }
      });
    });
  });
}

// Settings Page Functions
function initializeSettingsPage() {
  setupProfileForm();
  setupPreferences();
  setupDangerZone();
}

function setupProfileForm() {
  const form = document.getElementById('profile-form');
  const nameInput = document.getElementById('settings-name');
  const emailInput = document.getElementById('settings-email');
  
  // Load current user data
  const user = authService.getCurrentUser();
  if (user) {
    nameInput.value = user.name;
    emailInput.value = user.email;
  }
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const updatedUser = {
      ...user,
      name: nameInput.value,
      email: emailInput.value
    };
    
    // Update user in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      localStorage.setItem('users', JSON.stringify(users));
      authService.setCurrentUser(updatedUser);
      showToast('Profile updated successfully', 'success');
    }
  });
}

function setupPreferences() {
  const notificationsToggle = document.getElementById('email-notifications');
  const currencySelect = document.getElementById('currency-select');
  
  // Load saved preferences
  const preferences = JSON.parse(localStorage.getItem('preferences') || '{"notifications":true,"currency":"USD"}');
  notificationsToggle.checked = preferences.notifications;
  currencySelect.value = preferences.currency;
  
  // Save preferences on change
  notificationsToggle.addEventListener('change', () => {
    preferences.notifications = notificationsToggle.checked;
    localStorage.setItem('preferences', JSON.stringify(preferences));
    showToast('Preferences updated', 'success');
  });
  
  currencySelect.addEventListener('change', () => {
    preferences.currency = currencySelect.value;
    localStorage.setItem('preferences', JSON.stringify(preferences));
    showToast('Currency preference updated', 'success');
  });
}

function setupDangerZone() {
  const clearDataBtn = document.getElementById('clear-data');
  
  clearDataBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all your data? This cannot be undone.')) {
      localStorage.removeItem('transactions');
      showToast('All data has been cleared', 'success');
      
      // Reload the page after a brief delay
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  });
}

// Update event listeners to initialize new pages
function setupEventListeners() {
  // Auth forms
  elements.switchToRegisterBtn.addEventListener('click', () => {
    elements.loginForm.classList.add('hidden');
    elements.registerForm.classList.remove('hidden');
  });
  
  elements.switchToLoginBtn.addEventListener('click', () => {
    elements.registerForm.classList.add('hidden');
    elements.loginForm.classList.remove('hidden');
  });
  
  elements.loginFormElement.addEventListener('submit', handleLogin);
  elements.registerFormElement.addEventListener('submit', handleRegister);
  
  // Navigation
  elements.navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const page = item.getAttribute('data-page');
      navigateToPage(page);
      
      // Initialize specific page functionality
      if (page === 'reports') {
        initializeReportsPage();
      } else if (page === 'categories') {
        initializeCategoriesPage();
      } else if (page === 'settings') {
        initializeSettingsPage();
      }
    });
  });
  
  // Logout
  elements.logoutBtn.addEventListener('click', handleLogout);
  
  // Transaction modal
  elements.addTransactionBtn.addEventListener('click', () => {
    elements.transactionModal.classList.add('active');
  });
  
  elements.modalClose.addEventListener('click', () => {
    elements.transactionModal.classList.remove('active');
  });
  
  // Close modal when clicking outside
  elements.transactionModal.addEventListener('click', (e) => {
    if (e.target === elements.transactionModal) {
      elements.transactionModal.classList.remove('active');
    }
  });
  
  // Transaction tabs
  elements.tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');
      
      // Update active tab button
      elements.tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Show active tab content
      elements.tabContents.forEach(content => {
        content.classList.remove('active');
      });
      document.getElementById(`${tab}-tab`).classList.add('active');
    });
  });
  
  // Transaction forms
  elements.expenseForm.addEventListener('submit', handleAddExpense);
  elements.incomeForm.addEventListener('submit', handleAddIncome);
  
  // Export button
  elements.exportBtn.addEventListener('click', handleExportCSV);
  
  // Filters
  elements.searchTransactions.addEventListener('input', renderTransactionsTable);
  elements.filterType.addEventListener('change', renderTransactionsTable);
  elements.filterCategory.addEventListener('change', renderTransactionsTable);
}

// Auth handlers
function handleLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  
  try {
    const user = authService.login({ email, password });
    state.user = user;
    initializeApp();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

function handleRegister(e) {
  e.preventDefault();
  
  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const confirmPassword = document.getElementById('register-confirm-password').value;
  
  if (password !== confirmPassword) {
    showToast('Passwords do not match', 'error');
    return;
  }
  
  try {
    const user = authService.register({ name, email, password });
    state.user = user;
    initializeApp();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

function handleLogout() {
  authService.logout();
  state.user = null;
  
  // Show auth container and hide app container
  elements.authContainer.classList.remove('hidden');
  elements.appContainer.classList.add('hidden');
}

// Transaction handlers
function handleAddExpense(e) {
  e.preventDefault();
  
  const amount = parseFloat(document.getElementById('expense-amount').value);
  const description = document.getElementById('expense-description').value;
  const category = document.getElementById('expense-category').value;
  const date = document.getElementById('expense-date').value;
  
  if (!amount || !description || !category || !date) {
    showToast('Please fill in all fields', 'error');
    return;
  }
  
  const transaction = transactionService.addTransaction({
    amount,
    description,
    category,
    date,
    type: 'expense'
  });
  
  state.transactions = transactionService.getTransactions();
  
  // Close modal and reset form
  elements.transactionModal.classList.remove('active');
  elements.expenseForm.reset();
  
  // Update UI
  updateDashboard();
  renderTransactionsTable();
  
  showToast('Expense added successfully', 'success');
}

function handleAddIncome(e) {
  e.preventDefault();
  
  const amount = parseFloat(document.getElementById('income-amount').value);
  const description = document.getElementById('income-description').value;
  const category = document.getElementById('income-category').value;
  const date = document.getElementById('income-date').value;
  
  if (!amount || !description || !category || !date) {
    showToast('Please fill in all fields', 'error');
    return;
  }
  
  const transaction = transactionService.addTransaction({
    amount,
    description,
    category,
    date,
    type: 'income'
  });
  
  state.transactions = transactionService.getTransactions();
  
  // Close modal and reset form
  elements.transactionModal.classList.remove('active');
  elements.incomeForm.reset();
  
  // Update UI
  updateDashboard();
  renderTransactionsTable();
  
  showToast('Income added successfully', 'success');
}

function handleDeleteTransaction(id) {
  if (confirm('Are you sure you want to delete this transaction?')) {
    transactionService.deleteTransaction(id);
    state.transactions = transactionService.getTransactions();
    
    // Update UI
    updateDashboard();
    renderTransactionsTable();
    
    showToast('Transaction deleted successfully', 'success');
  }
}

function handleExportCSV() {
  const csv = transactionService.exportTransactionsAsCSV();
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Navigation
function navigateToPage(page) {
  state.currentPage = page;
  
  // Update active nav item
  elements.navItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('data-page') === page) {
      item.classList.add('active');
    }
  });
  
  // Show active page
  elements.pages.forEach(p => {
    p.classList.add('hidden');
  });
  
  document.getElementById(`${page}-page`).classList.remove('hidden');
  
  // Update UI for the page
  if (page === 'transactions') {
    renderTransactionsTable();
  }
}

// UI updates
function updateUserInfo() {
  if (state.user) {
    elements.userInitial.textContent = state.user.name.charAt(0);
    elements.userName.textContent = state.user.name;
    elements.userEmail.textContent = state.user.email;
  }
}

function updateDashboard() {
  // Update balance information
  const balance = transactionService.calculateBalance();
  const totalIncome = state.transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = state.transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  elements.balanceAmount.textContent = formatCurrency(balance);
  elements.totalIncome.textContent = formatCurrency(totalIncome);
  elements.totalExpense.textContent = formatCurrency(totalExpense);
  
  // Update charts
  updateMonthlyChart();
  updateExpensesPieChart();
  
  // Update recent transactions
  renderRecentTransactions();
}

function renderRecentTransactions() {
  // Get the most recent 5 transactions
  const recentTransactions = [...state.transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  elements.recentTransactionsList.innerHTML = '';
  
  if (recentTransactions.length > 0) {
    recentTransactions.forEach(transaction => {
      const item = document.createElement('div');
      item.className = 'transaction-item';
      
      item.innerHTML = `
        <div class="transaction-details">
          <div class="transaction-icon ${transaction.type === 'income' ? 'income-icon' : 'expense-icon'}">
            ${transaction.type === 'income' ? '+' : '-'}
          </div>
          <div class="transaction-info">
            <div class="transaction-description">${transaction.description}</div>
            <div class="transaction-meta">
              ${formatDate(transaction.date)} • ${getCategoryLabel(transaction)}
            </div>
          </div>
        </div>
        <div class="transaction-amount ${transaction.type === 'income' ? 'income' : 'expense'}">
          ${transaction.type === 'income' ? '+' : '-'}${formatCurrency(transaction.amount)}
        </div>
      `;
      
      elements.recentTransactionsList.appendChild(item);
    });
  } else {
    elements.recentTransactionsList.innerHTML = `
      <div class="text-center py-6 text-muted-foreground">
        No recent transactions
      </div>
    `;
  }
}

function renderTransactionsTable() {
  const searchTerm = elements.searchTransactions.value.toLowerCase();
  const filterType = elements.filterType.value;
  const filterCategory = elements.filterCategory.value;
  
  // Filter transactions
  const filteredTransactions = state.transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description
        .toLowerCase()
        .includes(searchTerm) ||
      getCategoryLabel(transaction)
        .toLowerCase()
        .includes(searchTerm);
    
    const matchesType =
      filterType === 'all' || transaction.type === filterType;
    
    const matchesCategory =
      filterCategory === '' || transaction.category === filterCategory;
    
    return matchesSearch && matchesType && matchesCategory;
  });
  
  elements.transactionsTableBody.innerHTML = '';
  
  if (filteredTransactions.length > 0) {
    filteredTransactions.forEach(transaction => {
      const row = document.createElement('tr');
      
      row.innerHTML = `
        <td>${formatDate(transaction.date)}</td>
        <td class="font-medium">${transaction.description}</td>
        <td>${getCategoryLabel(transaction)}</td>
        <td>
          <span class="transaction-type ${transaction.type}">
            ${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
          </span>
        </td>
        <td class="text-right transaction-amount ${transaction.type}">
          ${transaction.type === 'income' ? '+' : '-'}${formatCurrency(transaction.amount)}
        </td>
        <td>
          <button class="btn btn-outline delete-transaction" data-id="${transaction.id}">Delete</button>
        </td>
      `;
      
      elements.transactionsTableBody.appendChild(row);
    });
    
    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-transaction').forEach(btn => {
      btn.addEventListener('click', () => {
        handleDeleteTransaction(btn.getAttribute('data-id'));
      });
    });
  } else {
    elements.transactionsTableBody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center py-6">
          No transactions found
        </td>
      </tr>
    `;
  }
}

function updateMonthlyChart() {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  const monthlyData = transactionService.getMonthlyTotals(new Date().getFullYear());
  
  const chartData = months.map((month, index) => ({
    month: month,
    income: monthlyData.incomes[index],
    expense: monthlyData.expenses[index],
  }));
  
  if (monthlyChart) {
    monthlyChart.destroy();
  }
  
  const ctx = elements.monthlyChart.getContext('2d');
  monthlyChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: chartData.map(d => d.month),
      datasets: [
        {
          label: 'Income',
          data: chartData.map(d => d.income),
          backgroundColor: '#4ade80',
          borderColor: '#4ade80',
          borderWidth: 1
        },
        {
          label: 'Expense',
          data: chartData.map(d => d.expense),
          backgroundColor: '#f87171',
          borderColor: '#f87171',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return '$' + value;
            }
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              return context.dataset.label + ': $' + context.raw;
            }
          }
        }
      }
    }
  });
}

function updateExpensesPieChart() {
  const expensesByCategory = transactionService.getExpensesByCategory();
  
  const chartData = Object.entries(expensesByCategory).map(([category, amount]) => ({
    category: ExpenseCategoryLabels[category] || category,
    amount: amount,
    color: ExpenseCategoryColors[category] || '#999'
  }));
  
  if (expensePieChart) {
    expensePieChart.destroy();
  }
  
  if (chartData.length === 0) {
    elements.expensesPieChart.parentElement.innerHTML = `
      <div class="flex items-center justify-center h-full">
        <p>No expense data available</p>
      </div>
    `;
    return;
  }
  
  const ctx = elements.expensesPieChart.getContext('2d');
  expensePieChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: chartData.map(d => d.category),
      datasets: [{
        data: chartData.map(d => d.amount),
        backgroundColor: chartData.map(d => d.color),
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.raw;
              const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
              const percentage = Math.round((value / total) * 100);
              return `${label}: ${formatCurrency(value)} (${percentage}%)`;
            }
          }
        }
      }
    }
  });
}

// Toast notifications
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  
  elements.toastContainer.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Initialize application
function initializeApp() {
  // Check if user is authenticated
  const user = authService.getCurrentUser();
  
  if (user) {
    state.user = user;
    
    // Load transactions
    state.transactions = transactionService.getTransactions();
    
    // Update user info
    updateUserInfo();
    
    // Update dashboard
    updateDashboard();
    
    // Populate category filter
    populateCategoryFilter();
    
    // Hide auth container and show app container
    elements.authContainer.classList.add('hidden');
    elements.appContainer.classList.remove('hidden');
    
    // Set default page
    navigateToPage('dashboard');
  }
}

function populateCategoryFilter() {
  const select = elements.filterCategory;
  const allCategories = [...new Set(state.transactions.map(t => t.category))].sort();
  
  select.innerHTML = '<option value="">All Categories</option>';
  
  allCategories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    select.appendChild(option);
  });
}

// Set dates to today for forms
function setDefaultDates() {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('expense-date').value = today;
  document.getElementById('income-date').value = today;
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  setupEventListeners();
  setDefaultDates();
  initializeApp();
});
