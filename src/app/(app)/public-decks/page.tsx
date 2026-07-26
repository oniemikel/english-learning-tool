'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PageTitle } from '@/components/ui/page-title';
import { listDecks } from '@/lib/mock-api';

export default function PublicDecksPage() {
  const [query, setQuery] = useState('');
  const decksQuery = useQuery({ queryKey: ['public-decks', query], queryFn: () => listDecks({ query }) });
  const publicDecks = decksQuery.data?.filter((deck) => deck.isPublic) ?? [];

  return (
    <section>
      <PageTitle title="公開デッキ一覧" description="公開されているデッキを閲覧・複製できます。" />
      <div className="mb-5">
        <Input placeholder="公開デッキを検索" value={query} onChange={(event) => setQuery(event.target.value)} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {publicDecks.map((deck) => (
          <Link key={deck.id} href={`/public-decks/${deck.id}`}>
            <Card className="h-full hover:-translate-y-0.5 transition">
              <CardContent className="space-y-3 pt-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{deck.name}</h3>
                  <Badge>公開</Badge>
                </div>
                <p className="text-sm text-[var(--muted-foreground)]">{deck.description}</p>
                <p className="text-xs text-[var(--muted-foreground)]">{deck.wordCount}語</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
