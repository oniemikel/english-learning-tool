import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function AppRouteLoading() {
  return (
    <section className="mx-auto w-full max-w-7xl rounded-(--radius) border border-(--border) bg-(--card) p-5 animate-in fade-in-0 duration-200">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="space-y-2">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-72 max-w-[75vw]" />
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-(--border) bg-(--card) px-3 py-1.5 text-xs text-(--muted-foreground)">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Loading
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-28 rounded-(--radius)" />
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Skeleton className="h-80 rounded-(--radius)" />
        <div className="space-y-6">
          <Skeleton className="h-36 rounded-(--radius)" />
          <Skeleton className="h-36 rounded-(--radius)" />
        </div>
      </div>
    </section>
  );
}

export function RootPageLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-(--background) p-6">
      <div className="w-full max-w-md rounded-(--radius) border border-(--border) bg-(--card) p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2 text-sm font-medium text-(--foreground)">
          <Loader2 className="h-4 w-4 animate-spin" />
          Preparing page...
        </div>
        <div className="space-y-3">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </main>
  );
}