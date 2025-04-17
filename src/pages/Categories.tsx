
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExpenseCategoryLabels, IncomeCategoryLabels } from "@/types/models";

const Categories = () => {
  const [activeTab, setActiveTab] = useState<"expense" | "income">("expense");

  const expenseCategories = Object.entries(ExpenseCategoryLabels).map(([id, label]) => ({ id, label }));
  const incomeCategories = Object.entries(IncomeCategoryLabels).map(([id, label]) => ({ id, label }));

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Categories</h1>
        <p className="text-muted-foreground mt-2">
          View and manage your transaction categories
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs 
            value={activeTab} 
            onValueChange={(value) => setActiveTab(value as "expense" | "income")}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="expense">Expense Categories</TabsTrigger>
              <TabsTrigger value="income">Income Categories</TabsTrigger>
            </TabsList>
            
            <TabsContent value="expense" className="mt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {expenseCategories.map((category) => (
                  <div
                    key={category.id}
                    className="p-4 rounded-lg border bg-card flex items-center"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 expense-category-${category.id}`}
                    >
                      <span className="text-white font-semibold">
                        {category.label.charAt(0)}
                      </span>
                    </div>
                    <span>{category.label}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="income" className="mt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {incomeCategories.map((category) => (
                  <div
                    key={category.id}
                    className="p-4 rounded-lg border bg-card flex items-center"
                  >
                    <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center mr-3">
                      <span className="font-semibold">
                        {category.label.charAt(0)}
                      </span>
                    </div>
                    <span>{category.label}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Categories;
