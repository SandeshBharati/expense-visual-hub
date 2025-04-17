
import { useTransactions } from "@/context/TransactionContext";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import BalanceCard from "@/components/BalanceCard";
import ExpensesPieChart from "@/components/ExpensesPieChart";
import MonthlyChart from "@/components/MonthlyChart";
import RecentTransactionsList from "@/components/RecentTransactionsList";
import { Button } from "@/components/ui/button";
import { Download, Plus } from "lucide-react";
import AddTransactionDialog from "@/components/AddTransactionDialog";

const Dashboard = () => {
  const {
    transactions,
    addTransaction,
    balance,
    expensesByCategory,
    incomesByCategory,
    monthlyData,
    exportToCSV,
    loading,
  } = useTransactions();

  const navigate = useNavigate();

  // Calculate total incomes and expenses
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={exportToCSV} 
            className="flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <AddTransactionDialog onAddTransaction={addTransaction} />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <BalanceCard
              balance={balance}
              totalIncome={totalIncome}
              totalExpense={totalExpense}
            />
            <RecentTransactionsList transactions={transactions.slice(0, 5)} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ExpensesPieChart expensesByCategory={expensesByCategory} />
            <MonthlyChart monthlyData={monthlyData} />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
