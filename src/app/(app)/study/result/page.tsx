'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageTitle } from '@/components/ui/page-title';
import { useStudyStore } from '@/stores/study-store';

export default function StudyResultPage() {
  const store = useStudyStore();
  const accuracy = store.solved === 0 ? 0 : Math.round((store.correct / store.solved) * 100);

  return (
    <section>
      <PageTitle title="学習結果" description="今回のセッション結果を確認します。" />
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-5 text-center">
            <p className="text-xs text-[var(--muted-foreground)]">回答数</p>
            <p className="mt-2 text-2xl font-semibold">{store.solved}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 text-center">
            <p className="text-xs text-[var(--muted-foreground)]">正答数</p>
            <p className="mt-2 text-2xl font-semibold">{store.correct}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 text-center">
            <p className="text-xs text-[var(--muted-foreground)]">正答率</p>
            <p className="mt-2 text-2xl font-semibold">{accuracy}%</p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-6 flex flex-wrap justify-end gap-2">
        <Link href="/study">
          <Button variant="outline">同じ設定で再開</Button>
        </Link>
        <Link href="/history">
          <Button variant="secondary">履歴を見る</Button>
        </Link>
        <Link href="/dashboard">
          <Button>ダッシュボードへ</Button>
        </Link>
      </div>
    </section>
  );
}
