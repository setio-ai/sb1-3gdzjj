import Overview from '@/components/overview';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  return (
    <div className="container max-w-md mx-auto pb-20 pt-6">
      <h1 className="text-2xl font-bold mb-6">Welcome Back 👋</h1>
      <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
        <Overview />
      </Suspense>
    </div>
  );
}