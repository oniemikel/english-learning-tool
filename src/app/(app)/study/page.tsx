'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageTitle } from '@/components/ui/page-title';
import { Select } from '@/components/ui/select';
import { useStudyStore } from '@/stores/study-store';

const schema = z.object({
  mode: z.enum(['en-ja', 'ja-en', 'listening', 'pronunciation']),
});

type StudyStartValues = z.infer<typeof schema>;

const modePathMap: Record<StudyStartValues['mode'], string> = {
  'en-ja': '/study/en-ja',
  'ja-en': '/study/ja-en',
  listening: '/study/listening',
  pronunciation: '/study/pronunciation',
};

export default function StudyStartPage() {
  const searchParams = useSearchParams();
  const store = useStudyStore();
  const deckId = searchParams.get('deckId') ?? store.deckId;

  const form = useForm<StudyStartValues>({
    resolver: zodResolver(schema),
    defaultValues: { mode: store.mode },
  });

  const mode = form.watch('mode');
  store.setDeckId(deckId);
  store.setMode(mode);

  return (
    <section>
      <PageTitle title="学習開始" description="デッキとモードを選んで集中セッションを始めます。" />
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>セッション設定</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-[var(--radius-control)] bg-[var(--muted)] p-3 text-sm">
            対象デッキID: <span className="font-medium">{deckId}</span>
          </div>

          <label className="block space-y-1">
            <span className="text-sm">学習モード</span>
            <Select {...form.register('mode')}>
              <option value="en-ja">英→日学習</option>
              <option value="ja-en">日→英学習</option>
              <option value="listening">リスニング学習</option>
              <option value="pronunciation">発音学習</option>
            </Select>
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[var(--radius-control)] border border-[var(--border)] p-3 text-sm">新規上限: 20</div>
            <div className="rounded-[var(--radius-control)] border border-[var(--border)] p-3 text-sm">レビュー上限: 100</div>
          </div>

          <div className="flex justify-end">
            <Link href={modePathMap[mode]}>
              <Button>学習を開始</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
