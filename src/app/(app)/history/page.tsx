'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageTitle } from '@/components/ui/page-title';
import { getStudyHistory } from '@/lib/data/history';
import { formatDate } from '@/lib/utils';
import { AnimatedContainer } from '@/components/animated-container';

export default function HistoryPage() {
  const historyQuery = useQuery({ queryKey: ['history'], queryFn: () => getStudyHistory() });

  return (
    <section>
      <PageTitle title="学習履歴" description="日次の学習記録を確認します。" />
      <AnimatedContainer delay={0.05}>
        <Card>
          <CardHeader>
            <CardTitle>履歴一覧</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {historyQuery.data?.map((item) => (
              <div key={item.id} className="rounded-(--radius-control) border border-(--border) p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{item.deckName}</p>
                  <p className="text-xs text-(--muted-foreground)">{item.mode}</p>
                </div>
                <p className="mt-1 text-xs text-(--muted-foreground)">
                  {formatDate(item.createdAt)} / {item.solved}問 / 正答率{Math.round(item.accuracy)}% / {item.minutes}分
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </AnimatedContainer>
    </section>
  );
}
