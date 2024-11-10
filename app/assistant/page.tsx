import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import AIAssistant from "@/components/ai-assistant";

export default function AssistantPage() {
  return (
    <div className="container max-w-md mx-auto pb-20 pt-6">
      <h1 className="text-2xl font-bold mb-6">Financial Assistant</h1>
      <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
        <AIAssistant />
      </Suspense>
    </div>
  );
}