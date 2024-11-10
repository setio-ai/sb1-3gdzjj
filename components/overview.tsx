"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { DollarSign, TrendingUp, CreditCard } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockData = {
  savings: 12500,
  expenses: 2300,
  portfolio: 45000,
  monthlyData: [
    { month: "Jan", value: 54000 },
    { month: "Feb", value: 55200 },
    { month: "Mar", value: 56800 },
    { month: "Apr", value: 57500 },
    { month: "May", value: 57000 },
    { month: "Jun", value: 59800 },
  ],
  goals: [
    {
      id: 1,
      name: "Emergency Fund",
      current: 12500,
      target: 25000,
      deadline: "2024-12-31",
    },
    {
      id: 2,
      name: "New Car",
      current: 5000,
      target: 35000,
      deadline: "2025-06-30",
    },
  ]
};

export default function Overview() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium">Savings</span>
          </div>
          <p className="text-2xl font-bold mt-2">${mockData.savings.toLocaleString()}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-red-500" />
            <span className="text-sm font-medium">Expenses</span>
          </div>
          <p className="text-2xl font-bold mt-2">${mockData.expenses.toLocaleString()}</p>
        </Card>
      </div>

      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-medium">Portfolio Value</span>
        </div>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockData.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month"
                axisLine={false}
                tickLine={false}
                padding={{ left: 0, right: 0 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
                padding={{ top: 10, bottom: 10 }}
              />
              <Tooltip 
                formatter={(value) => [`$${Number(value).toLocaleString()}`, "Value"]}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-4">
        <Tabs defaultValue="all">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium">Savings Goals</h3>
            <TabsList className="grid w-[160px] grid-cols-2">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="next">Next Up</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all" className="space-y-4">
            {mockData.goals.map((goal) => (
              <div key={goal.id} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{goal.name}</span>
                  <span className="text-muted-foreground">
                    Due {new Date(goal.deadline).toLocaleDateString()}
                  </span>
                </div>
                <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                <div className="flex justify-between text-sm">
                  <span>${goal.current.toLocaleString()}</span>
                  <span className="text-muted-foreground">
                    ${goal.target.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="next">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{mockData.goals[0].name}</span>
                <span className="text-muted-foreground">
                  Due {new Date(mockData.goals[0].deadline).toLocaleDateString()}
                </span>
              </div>
              <Progress 
                value={(mockData.goals[0].current / mockData.goals[0].target) * 100} 
                className="h-2" 
              />
              <div className="flex justify-between text-sm">
                <span>${mockData.goals[0].current.toLocaleString()}</span>
                <span className="text-muted-foreground">
                  ${mockData.goals[0].target.toLocaleString()}
                </span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}