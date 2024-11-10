"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
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

type Expense = {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
};

const categories = [
  "Food",
  "Transport",
  "Entertainment",
  "Shopping",
  "Bills",
  "Other",
];

const mockExpenses: Expense[] = [
  {
    id: 1,
    description: "Grocery Shopping",
    amount: 120.50,
    category: "Food",
    date: "2024-03-15",
  },
  {
    id: 2,
    description: "Movie Tickets",
    amount: 30.00,
    category: "Entertainment",
    date: "2024-03-14",
  },
];

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [isOpen, setIsOpen] = useState(false);

  const handleAddExpense = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newExpense = {
      id: expenses.length + 1,
      description: formData.get("description") as string,
      amount: Number(formData.get("amount")),
      category: formData.get("category") as string,
      date: formData.get("date") as string,
    };
    setExpenses([newExpense, ...expenses]);
    setIsOpen(false);
  };

  const handleDeleteExpense = (id: number) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-2">Total Expenses</h2>
        <p className="text-3xl font-bold">${totalExpenses.toLocaleString()}</p>
      </Card>

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Recent Expenses</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" name="description" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select name="category" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" name="date" type="date" required />
              </div>
              <Button type="submit" className="w-full">
                Add Expense
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {expenses.map((expense) => (
          <Card key={expense.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{expense.description}</h3>
                <p className="text-sm text-muted-foreground">
                  {expense.category} • {new Date(expense.date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold">
                  ${expense.amount.toLocaleString()}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteExpense(expense.id)}
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}