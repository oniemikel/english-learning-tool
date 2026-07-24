'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageTitle } from '@/components/ui/page-title';
import { getStatistics } from '@/lib/mock-api';

type Range = '7d' | '30d' | '90d';

export default function StatisticsPage() {
  const [range, setRange] = useState<Range>('7d');
  const statisticsQuery = useQuery({ queryKey: ['statistics', range], queryFn: () => getStatistics(range) });
  const data = statisticsQuery.data;

  return (
    <section>
      <PageTitle title="統計" description="学習成果をダッシュボード形式で可視化します。" />

      <div className="mb-5 flex gap-2">
        <Button variant={range === '7d' ? 'primary' : 'outline'} onClick={() => setRange('7d')}>
          7日
        </Button>
        <Button variant={range === '30d' ? 'primary' : 'outline'} onClick={() => setRange('30d')}>
          30日
        </Button>
        <Button variant={range === '90d' ? 'primary' : 'outline'} onClick={() => setRange('90d')}>
          90日
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="pt-5 text-center">
            <p className="text-xs text-[var(--muted-foreground)]">総レビュー</p>
            <p className="mt-2 text-2xl font-semibold">{data?.totalReviews ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 text-center">
            <p className="text-xs text-[var(--muted-foreground)]">学習時間(分)</p>
            <p className="mt-2 text-2xl font-semibold">{data?.totalStudyMinutes ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 text-center">
            <p className="text-xs text-[var(--muted-foreground)]">正答率</p>
            <p className="mt-2 text-2xl font-semibold">{data?.accuracy ?? 0}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 text-center">
            <p className="text-xs text-[var(--muted-foreground)]">継続日数</p>
            <p className="mt-2 text-2xl font-semibold">{data?.streak ?? 0}日</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-5">
        <CardHeader>
          <CardTitle>日次推移</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {data?.trend.map((point) => (
              <div key={point.label} className="rounded-[var(--radius-control)] bg-[var(--muted)] p-3 text-center">
                <p className="text-xs text-[var(--muted-foreground)]">{point.label}</p>
                <p className="mt-1 text-lg font-semibold">{point.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
