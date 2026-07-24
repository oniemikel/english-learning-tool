'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PageTitle } from '@/components/ui/page-title';
import { listWords } from '@/lib/mock-api';
import { formatDate } from '@/lib/utils';

export default function WordsPage() {
  const [query, setQuery] = useState('');
  const wordsQuery = useQuery({ queryKey: ['words', query], queryFn: () => listWords(query) });

  return (
    <section>
      <PageTitle
        title="単語一覧"
        description="検索と状態表示で復習対象を整理します。"
        actions={
          <Link href="/words/new">
            <Button>単語を作成</Button>
          </Link>
        }
      />

      <div className="mb-5">
        <Input placeholder="英単語/日本語訳で検索" value={query} onChange={(event) => setQuery(event.target.value)} />
      </div>

      <div className="space-y-3">
        {wordsQuery.data?.map((word) => (
          <Link key={word.id} href={`/words/${word.id}`}>
            <Card className="hover:bg-[var(--muted)]">
              <CardContent className="flex flex-col gap-2 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold">{word.word}</p>
                  <p className="text-sm text-[var(--muted-foreground)]">{word.translation}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
                  <Badge>{word.partOfSpeech}</Badge>
                  <span>正答率 {word.accuracy}%</span>
                  <span>{formatDate(word.nextReview)}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
