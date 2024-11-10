"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LineChart, Line, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

type Investment = {
  id: number;
  name: string;
  type: string;
  quantity: number;
  pricePerUnit: number;
  amount: number;
  purchaseDate: string;
  currentValue: number;
  unit: string;
};

const investmentTypes = [
  "Stocks",
  "Bonds",
  "Crypto",
  "ETFs",
  "Mutual Funds",
  "Real Estate",
];

const mockPerformanceData = [
  { month: "Jan", value: 25000 },
  { month: "Feb", value: 28000 },
  { month: "Mar", value: 27500 },
  { month: "Apr", value: 29800 },
  { month: "May", value: 31200 },
  { month: "Jun", value: 28700 },
];

const mockInvestments: Investment[] = [
  {
    id: 1,
    name: "AAPL",
    type: "Stocks",
    quantity: 50,
    pricePerUnit: 200,
    amount: 10000,
    purchaseDate: "2024-01-15",
    currentValue: 12500,
    unit: "shares",
  },
  {
    id: 2,
    name: "Bitcoin",
    type: "Crypto",
    quantity: 0.5,
    pricePerUnit: 30000,
    amount: 15000,
    purchaseDate: "2024-02-01",
    currentValue: 16200,
    unit: "coins",
  },
];

const getDefaultUnit = (type: string) => {
  switch (type) {
    case "Stocks":
      return "shares";
    case "Crypto":
      return "coins";
    case "ETFs":
      return "units";
    case "Mutual Funds":
      return "units";
    case "Real Estate":
      return "properties";
    default:
      return "units";
  }
};

export default function PortfolioManager() {
  const [investments, setInvestments] = useState<Investment[]>(mockInvestments);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("");

  const handleAddInvestment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const quantity = Number(formData.get("quantity"));
    const pricePerUnit = Number(formData.get("pricePerUnit"));
    const amount = quantity * pricePerUnit;
    
    const newInvestment = {
      id: investments.length + 1,
      name: formData.get("name") as string,
      type: formData.get("type") as string,
      quantity,
      pricePerUnit,
      amount,
      purchaseDate: formData.get("purchaseDate") as string,
      currentValue: amount,
      unit: getDefaultUnit(formData.get("type") as string),
    };
    setInvestments([...investments, newInvestment]);
    setIsOpen(false);
  };

  const handleDeleteInvestment = (id: number) => {
    setInvestments(investments.filter((investment) => investment.id !== id));
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
  };

  const totalValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalReturn = totalValue - totalInvested;
  const returnPercentage = (totalReturn / totalInvested) * 100;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <h2 className="text-sm font-medium text-muted-foreground">Total Value</h2>
          <p className="text-2xl font-bold mt-1">${totalValue.toLocaleString()}</p>
        </Card>
        <Card className="p-4">
          <h2 className="text-sm font-medium text-muted-foreground">Total Return</h2>
          <div className="flex items-center gap-2 mt-1">
            {totalReturn >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <p className={`text-2xl font-bold ${totalReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {returnPercentage.toFixed(1)}%
            </p>
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <h2 className="text-sm font-medium mb-4">Portfolio Performance</h2>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockPerformanceData}>
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
                tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
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

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Your Investments</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Add Investment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Investment</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddInvestment} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Investment Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select name="type" required onValueChange={handleTypeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {investmentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">
                  Quantity ({selectedType ? `in ${getDefaultUnit(selectedType)}` : ''})
                </Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  step="any"
                  min="0"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pricePerUnit">Price per Unit ($)</Label>
                <Input
                  id="pricePerUnit"
                  name="pricePerUnit"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="purchaseDate">Purchase Date</Label>
                <Input id="purchaseDate" name="purchaseDate" type="date" required />
              </div>
              <Button type="submit" className="w-full">
                Add Investment
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {investments.map((investment) => {
          const returnAmount = investment.currentValue - investment.amount;
          const returnPercent = (returnAmount / investment.amount) * 100;
          
          return (
            <Card key={investment.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{investment.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {investment.type} • {investment.quantity} {investment.unit} • Purchased {new Date(investment.purchaseDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Price per unit: ${investment.pricePerUnit.toLocaleString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteInvestment(investment.id)}
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                </Button>
              </div>
              <div className="flex justify-between mt-2">
                <div>
                  <p className="text-sm text-muted-foreground">Current Value</p>
                  <p className="font-medium">${investment.currentValue.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Return</p>
                  <p className={`font-medium ${returnAmount >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {returnPercent >= 0 ? '+' : ''}{returnPercent.toFixed(1)}%
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}