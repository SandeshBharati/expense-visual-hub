
import { useTransactions } from "@/context/TransactionContext";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  LineChart,
  Line,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { ExpenseCategoryLabels, IncomeCategoryLabels, ExpenseCategoryColors, IncomeCategoryColors } from "@/types/models";

const Reports = () => {
  const { expensesByCategory, incomesByCategory, monthlyData, transactions, loading } = useTransactions();

  // Prepare data for expense pie chart
  const expenseChartData = Object.entries(expensesByCategory).map(([category, amount]) => ({
    name: ExpenseCategoryLabels[category as keyof typeof ExpenseCategoryLabels] || category,
    value: amount,
    color: ExpenseCategoryColors[category as keyof typeof ExpenseCategoryColors] || "#999",
  }));

  // Prepare data for income pie chart
  const incomeChartData = Object.entries(incomesByCategory).map(([category, amount]) => ({
    name: IncomeCategoryLabels[category as keyof typeof IncomeCategoryLabels] || category,
    value: amount,
    color: IncomeCategoryColors[category as keyof typeof IncomeCategoryColors] || "#999",
  }));

  // Prepare data for monthly comparison chart
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const monthlyChartData = months.map((month, index) => ({
    name: month,
    income: monthlyData.incomes[index],
    expense: monthlyData.expenses[index],
    balance: monthlyData.incomes[index] - monthlyData.expenses[index],
  }));

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Custom tooltip for charts
  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-4 rounded shadow-lg border">
          {payload.map((entry: any, index: number) => (
            <p
              key={`tooltip-${index}`}
              className="text-sm"
              style={{ color: entry.color }}
            >
              {`${entry.name}: ${formatCurrency(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Financial Reports</h1>
        <p className="text-muted-foreground mt-2">
          Visualize your financial data to gain insights
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Expense Breakdown */}
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-xl">Expense Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                {expenseChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expenseChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => 
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {expenseChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={customTooltip} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">No expense data available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Income Breakdown */}
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-xl">Income Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                {incomeChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={incomeChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => 
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {incomeChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={customTooltip} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">No income data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Monthly Trends */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-xl">Monthly Financial Trends</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyChartData}>
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
          
          {/* Balance Trend */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-xl">Balance Trend</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={formatCurrency} />
                  <Tooltip content={customTooltip} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="balance"
                    name="Net Balance"
                    stroke="#9b87f5"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Reports;
