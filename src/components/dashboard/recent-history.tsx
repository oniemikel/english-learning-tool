'use client';

import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { listHistory } from '@/lib/mock-api';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

type RecentHistoryProps = {
  className?: string;
};

export function RecentHistory({ className }: RecentHistoryProps) {
  const historyQuery = useQuery({ queryKey: ['history'], queryFn: () => listHistory({ limit: 5 }) });

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Recent History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {historyQuery.isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2 rounded-[var(--radius-control)] border p-3">
                <div className="flex items-center justify-between">
                  <div className="h-5 w-2/5 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>
                  <div className="h-5 w-1/5 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>
                </div>
                <div className="h-4 w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>
              </div>
            ))
          : historyQuery.data?.map((history) => (
              <div key={history.id} className="rounded-[var(--radius-control)] border p-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{history.deckName}</p>
                  <Badge variant="secondary">{history.mode}</Badge>
                </div>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                  {history.solved} cards / Accuracy {history.accuracy}% / {formatDate(history.createdAt)}
                </p>
              </div>
            ))}
      </CardContent>
    </Card>
  );
}
