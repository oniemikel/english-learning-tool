'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PageTitle } from '@/components/ui/page-title';
import { listDecks } from '@/lib/mock-api';
import { formatDate } from '@/lib/utils';

export default function DecksPage() {
  const [query, setQuery] = useState('');
  const decksQuery = useQuery({ queryKey: ['decks', query], queryFn: () => listDecks(query) });

  return (
    <section>
      <PageTitle
        title="デッキ一覧"
        description="検索とカード表示で学習対象を素早く切り替えます。"
        actions={
          <Link href="/decks/new">
            <Button>デッキを作成</Button>
          </Link>
        }
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-[1fr_160px]">
        <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="デッキ名で検索" />
        <Button variant="secondary">並び替え: 更新日</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {decksQuery.data?.map((deck) => (
          <Link key={deck.id} href={`/decks/${deck.id}`}>
            <Card className="h-full hover:-translate-y-0.5 transition">
              <CardContent className="space-y-3 pt-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold">{deck.name}</h3>
                  <Badge>{deck.isPublic ? '公開' : '非公開'}</Badge>
                </div>
                <p className="text-sm text-[var(--muted-foreground)]">{deck.description}</p>
                <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
                  <span>{deck.wordCount}語</span>
                  <span>Due {deck.dueCount}</span>
                  <span>{formatDate(deck.updatedAt)}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
