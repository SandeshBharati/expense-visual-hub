
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface MonthlyChartProps {
  monthlyData: {
    expenses: number[];
    incomes: number[];
  };
}

const MonthlyChart = ({ monthlyData }: MonthlyChartProps) => {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const prepareChartData = () => {
    return months.map((month, index) => ({
      name: month,
      income: monthlyData.incomes[index],
      expense: monthlyData.expenses[index],
    }));
  };

  const chartData = prepareChartData();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-4 rounded shadow-lg border">
          <p className="font-semibold">{label}</p>
          <p className="text-sm text-green-600">
            Income: {formatCurrency(payload[0].value)}
          </p>
          <p className="text-sm text-red-600">
            Expense: {formatCurrency(payload[1].value)}
          </p>
          <p className="text-sm mt-1">
            Net: {formatCurrency(payload[0].value - payload[1].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full h-[400px]">
      <CardHeader>
        <CardTitle className="text-xl">Monthly Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip content={customTooltip} />
            <Legend />
            <Bar dataKey="income" name="Income" fill="#4ade80" />
            <Bar dataKey="expense" name="Expense" fill="#f87171" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default MonthlyChart;
