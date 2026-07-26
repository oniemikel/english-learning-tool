'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageTitle } from '@/components/ui/page-title';
import { listHistory } from '@/lib/mock-api';
import { formatDate } from '@/lib/utils';

export default function HistoryPage() {
  const historyQuery = useQuery({ queryKey: ['history'], queryFn: () => listHistory() });

  return (
    <section>
      <PageTitle title="学習履歴" description="日次の学習記録を確認します。" />
      <Card>
        <CardHeader>
          <CardTitle>履歴一覧</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {historyQuery.data?.map((item) => (
            <div key={item.id} className="rounded-[var(--radius-control)] border border-[var(--border)] p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium">{item.deckName}</p>
                <p className="text-xs text-[var(--muted-foreground)]">{item.mode}</p>
              </div>
              <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                {formatDate(item.createdAt)} / {item.solved}問 / 正答率{item.accuracy}% / {item.minutes}分
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
