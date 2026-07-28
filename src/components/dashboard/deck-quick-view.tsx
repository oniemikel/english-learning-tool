// src/components/dashboard/deck-quick-view.tsx
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Icons } from '../icons';

type DeckQuickViewProps = {
  decks: {
    id: string;
    title: string;
    wordCount: number;
  }[];
  className?: string;
};

export default function DeckQuickView({
  decks,
  className,
}: DeckQuickViewProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>All Decks</CardTitle>
        <Link href="/decks" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
          View All
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {decks.length > 0 ? (
          decks.map(deck => (
            <Link
              key={deck.id}
              href={`/decks/${deck.id}`}
              className="block rounded-lg border p-3 hover:bg-gray-50"
            >
              <div className="flex items-center justify-between">
                <p className="font-medium">{deck.title}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Icons.Words className="mr-2 h-4 w-4" />
                  {deck.wordCount} words
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 py-12 text-center">
            <h4 className="text-lg font-semibold">No decks yet</h4>
            <p className="mb-4 text-sm text-gray-500">
              Create your first deck to start studying.
            </p>
            <Link href="/decks/new" className={buttonVariants()}>
              <Icons.Plus className="mr-2 h-4 w-4" />
              Create Deck
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
