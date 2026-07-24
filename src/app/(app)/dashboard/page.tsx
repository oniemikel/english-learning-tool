'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { PageTitle } from '@/components/ui/page-title';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getDashboardSummary, listDecks, listHistory } from '@/lib/mock-api';
import { formatDate } from '@/lib/utils';

export default function DashboardPage() {
  const summaryQuery = useQuery({ queryKey: ['dashboard-summary'], queryFn: getDashboardSummary });
  const decksQuery = useQuery({ queryKey: ['decks'], queryFn: () => listDecks() });
  const historyQuery = useQuery({ queryKey: ['history'], queryFn: listHistory });

  return (
    <section>
      <PageTitle
        title="ダッシュボード"
        description="今日の学習状況と次の復習をまとめて確認します。"
        actions={
          <>
            <Link href="/study">
              <Button>学習を始める</Button>
            </Link>
            <Link href="/statistics">
              <Button variant="outline">統計を見る</Button>
            </Link>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryQuery.isLoading
          ? Array.from({ length: 4 }).map((_, idx) => <Skeleton key={idx} className="h-28" />)
          : [
              ['Dueカード', summaryQuery.data?.dueCount ?? 0],
              ['新規カード', summaryQuery.data?.newCount ?? 0],
              ['今日の学習', summaryQuery.data?.learnedToday ?? 0],
              ['継続日数', `${summaryQuery.data?.streakDays ?? 0}日`],
            ].map(([label, value]) => (
              <Card key={label}>
                <CardContent className="pt-5">
                  <p className="text-xs text-[var(--muted-foreground)]">{label}</p>
                  <p className="mt-2 text-2xl font-semibold">{value}</p>
                </CardContent>
              </Card>
            ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>デッキ概要</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {decksQuery.data?.map((deck) => (
              <Link
                key={deck.id}
                href={`/decks/${deck.id}`}
                className="flex items-center justify-between rounded-[var(--radius-control)] border border-[var(--border)] p-3 hover:bg-[var(--muted)]"
              >
                <div>
                  <p className="font-medium">{deck.name}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">{deck.wordCount}語</p>
                </div>
                <Badge>Due {deck.dueCount}</Badge>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>最近の履歴</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {historyQuery.data?.map((history) => (
              <div key={history.id} className="rounded-[var(--radius-control)] border border-[var(--border)] p-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{history.deckName}</p>
                  <Badge>{history.mode}</Badge>
                </div>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                  {history.solved}問 / 正答率 {history.accuracy}% / {formatDate(history.createdAt)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
