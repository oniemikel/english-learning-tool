'use client';

import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

type StatCardProps = {
  title: string;
  value: ReactNode;
  icon?: ReactNode;
  isLoading?: boolean;
};

export function StatCard({ title, value, icon, isLoading }: StatCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex-row items-center justify-between pb-2">
          <Skeleton className="h-4 w-3/5" />
          {icon ? <Skeleton className="h-5 w-5" /> : null}
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-4/5" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
