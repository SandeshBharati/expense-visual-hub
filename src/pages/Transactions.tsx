
import { useTransactions } from "@/context/TransactionContext";
import DashboardLayout from "@/components/DashboardLayout";
import TransactionTable from "@/components/TransactionTable";
import AddTransactionDialog from "@/components/AddTransactionDialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const Transactions = () => {
  const { transactions, addTransaction, deleteTransaction, exportToCSV, loading } = useTransactions();

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Transactions</h1>
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
        <TransactionTable
          transactions={transactions}
          onDeleteTransaction={deleteTransaction}
        />
      )}
    </DashboardLayout>
  );
};

export default Transactions;
