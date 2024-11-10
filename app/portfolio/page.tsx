import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import PortfolioManager from "@/components/portfolio-manager";

export default function PortfolioPage() {
  return (
    <div className="container max-w-md mx-auto pb-20 pt-6">
      <h1 className="text-2xl font-bold mb-6">Investment Portfolio</h1>
      <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
        <PortfolioManager />
      </Suspense>
    </div>
  );
}