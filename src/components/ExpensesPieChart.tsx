
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { ExpenseCategoryLabels, ExpenseCategoryColors } from "@/types/models";

interface ExpenseChartData {
  name: string;
  value: number;
  color: string;
}

interface ExpensesPieChartProps {
  expensesByCategory: Record<string, number>;
}

const ExpensesPieChart = ({ expensesByCategory }: ExpensesPieChartProps) => {
  const prepareChartData = (): ExpenseChartData[] => {
    return Object.entries(expensesByCategory).map(([category, amount]) => ({
      name: ExpenseCategoryLabels[category as keyof typeof ExpenseCategoryLabels] || category,
      value: amount,
      color: ExpenseCategoryColors[category as keyof typeof ExpenseCategoryColors] || "#999",
    }));
  };

  const chartData = prepareChartData();

  // Calculate total expenses
  const totalExpenses = Object.values(expensesByCategory).reduce((sum, amount) => sum + amount, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card p-4 rounded shadow-lg border">
          <p className="font-semibold">{data.name}</p>
          <p className="text-sm">{formatCurrency(data.value)}</p>
          <p className="text-xs text-muted-foreground">
            {((data.value / totalExpenses) * 100).toFixed(1)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full h-[400px]">
      <CardHeader>
        <CardTitle className="text-xl">Expenses by Category</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={customTooltip} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px]">
            <p className="text-muted-foreground">No expense data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpensesPieChart;
