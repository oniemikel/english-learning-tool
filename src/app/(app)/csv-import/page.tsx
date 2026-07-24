'use client';

import { Upload } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageTitle } from '@/components/ui/page-title';

export default function CsvImportPage() {
  const params = useSearchParams();
  const deckId = params.get('deckId') ?? 'deck-1';
  const [fileName, setFileName] = useState('');

  return (
    <section>
      <PageTitle title="CSVインポート" description={`対象デッキ: ${deckId}`} />
      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <CardTitle>ファイル選択</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-[var(--radius-card)] border border-dashed border-[var(--border)] bg-[var(--muted)] p-10 text-center">
            <Upload className="mb-3 h-7 w-7" />
            <span className="text-sm font-medium">CSVファイルを選択</span>
            <span className="mt-1 text-xs text-[var(--muted-foreground)]">UTF-8 / 10MB以下</span>
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(event) => setFileName(event.target.files?.[0]?.name ?? '')}
            />
          </label>
          {fileName ? (
            <p className="text-sm text-[var(--muted-foreground)]">選択中: {fileName}</p>
          ) : (
            <p className="text-sm text-[var(--muted-foreground)]">ファイル未選択</p>
          )}
          <div className="flex justify-end gap-2">
            <Link href={`/decks/${deckId}`}>
              <Button variant="outline">キャンセル</Button>
            </Link>
            <Button disabled={!fileName}>インポート実行 (Mock)</Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
