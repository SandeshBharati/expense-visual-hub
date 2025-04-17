
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";

interface BalanceCardProps {
  balance: number;
  totalIncome: number;
  totalExpense: number;
}

const BalanceCard = ({ balance, totalIncome, totalExpense }: BalanceCardProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Available Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold mb-4">{formatCurrency(balance)}</div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
              <ArrowUp className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Income</p>
              <p className="font-semibold">{formatCurrency(totalIncome)}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-2">
              <ArrowDown className="h-4 w-4 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Expense</p>
              <p className="font-semibold">{formatCurrency(totalExpense)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BalanceCard;
