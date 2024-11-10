import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import ExpenseTracker from "@/components/expense-tracker";

export default function ExpensesPage() {
  return (
    <div className="container max-w-md mx-auto pb-20 pt-6">
      <h1 className="text-2xl font-bold mb-6">Expenses</h1>
      <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
        <ExpenseTracker />
      </Suspense>
    </div>
  );
}