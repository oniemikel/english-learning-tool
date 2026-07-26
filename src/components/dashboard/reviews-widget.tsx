'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getDashboardSummary } from '@/lib/mock-api';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type ReviewsWidgetProps = {
  className?: string;
};

export function ReviewsWidget({ className }: ReviewsWidgetProps) {
  const summaryQuery = useQuery({ queryKey: ['dashboard-summary'], queryFn: getDashboardSummary });

  const { data, isLoading } = summaryQuery;

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Study</CardTitle>
        <CardDescription>You have cards ready for review. Start a session to continue learning.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex items-center justify-between rounded-lg border bg-card p-4 md:flex-col md:items-start md:justify-start">
          {isLoading ? (
            <>
              <Skeleton className="h-4 w-16" />
              <Skeleton className="mt-2 h-8 w-12" />
            </>
          ) : (
            <>
              <p className="text-sm font-medium text-muted-foreground">New</p>
              <p className="text-3xl font-bold">{data?.newCount ?? 0}</p>
            </>
          )}
        </div>
        <div className="flex items-center justify-between rounded-lg border bg-card p-4 md:flex-col md:items-start md:justify-start">
          {isLoading ? (
            <>
              <Skeleton className="h-4 w-16" />
              <Skeleton className="mt-2 h-8 w-12" />
            </>
          ) : (
            <>
              <p className="text-sm font-medium text-muted-foreground">Review</p>
              <p className="text-3xl font-bold">{data?.dueCount ?? 0}</p>
            </>
          )}
        </div>
        <div className="flex items-center justify-between rounded-lg border bg-card p-4 md:flex-col md:items-start md:justify-start">
          {isLoading ? (
            <>
              <Skeleton className="h-4 w-16" />
              <Skeleton className="mt-2 h-8 w-12" />
            </>
          ) : (
            <>
              <p className="text-sm font-medium text-muted-foreground">Total Due</p>
              <p className="text-3xl font-bold">{(data?.newCount ?? 0) + (data?.dueCount ?? 0)}</p>
            </>
          )}
        </div>
      </CardContent>
      <div className="p-5 pt-0">
        <Link href="/study" className="w-full">
          <Button className="w-full" size="lg">
            Start Studying
          </Button>
        </Link>
      </div>
    </Card>
  );
}
