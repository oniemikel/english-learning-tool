'use client';

import { useTheme } from 'next-themes';
import HeatMap from '@uiw/react-heat-map';
import type { HeatMapValue } from '@uiw/react-heat-map';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type ActivityHeatmapProps = {
  data?: HeatMapValue[];
  isLoading?: boolean;
  className?: string;
};

export function ActivityHeatmap({ data, isLoading, className }: ActivityHeatmapProps) {
  const { theme } = useTheme();

  if (isLoading) {
    return (
      <Card className={cn(className)}>
        <CardHeader>
          <Skeleton className="h-6 w-3/5" />
          <Skeleton className="mt-2 h-4 w-4/5" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Activity</CardTitle>
        <CardDescription>Your study consistency over the last year.</CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <HeatMap
          value={data ?? []}
          width="100%"
          style={{ color: 'var(--foreground)' }}
          panelColors={{
            0: theme === 'dark' ? '#1d2821' : '#e9ece8',
            2: '#39d353',
            4: '#26a641',
            10: '#006d32',
            20: '#0e4429',
          }}
          startDate={new Date(new Date().setDate(new Date().getDate() - 365))}
        />
      </CardContent>
    </Card>
  );
}
