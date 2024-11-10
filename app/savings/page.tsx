import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import SavingsTracker from "@/components/savings-tracker";

export default function SavingsPage() {
  return (
    <div className="container max-w-md mx-auto pb-20 pt-6">
      <h1 className="text-2xl font-bold mb-6">Savings Goals</h1>
      <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
        <SavingsTracker />
      </Suspense>
    </div>
  );
}