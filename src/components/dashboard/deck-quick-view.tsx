'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { listDecks } from '@/lib/mock-api';
import { cn } from '@/lib/utils';

type DeckQuickViewProps = {
  className?: string;
};

export function DeckQuickView({ className }: DeckQuickViewProps) {
  const decksQuery = useQuery({ queryKey: ['decks'], queryFn: () => listDecks({ limit: 5 }) });

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Recent Decks</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {decksQuery.isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between rounded-[var(--radius-control)] border p-3">
                <div className="w-full space-y-2">
                  <div className="h-5 w-3/5 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>
                  <div className="h-4 w-2/5 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>
                </div>
              </div>
            ))
          : decksQuery.data?.map((deck) => (
              <Link
                key={deck.id}
                href={`/decks/${deck.id}`}
                className="block rounded-[var(--radius-control)] border p-3 hover:bg-[var(--muted)]"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium">{deck.name}</p>
                  <Badge variant="outline">Due {deck.dueCount}</Badge>
                </div>
                <p className="text-xs text-[var(--muted-foreground)]">{deck.wordCount} words</p>
              </Link>
            ))}
      </CardContent>
    </Card>
  );
}
