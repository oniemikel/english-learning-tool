// src/components/dashboard/recent-decks.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import DeckCard from './deck-card';

interface RecentDecksProps {
  decks: {
    id: string;
    title: string;
    wordCount: number;
  }[];
}

const RecentDecks = ({ decks }: RecentDecksProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Recent Decks</h3>
        <Button variant="link" asChild>
          <Link href="/decks">
            View all <Icons.ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>
      {decks.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {decks.map(deck => (
            <DeckCard
              key={deck.id}
              id={deck.id}
              title={deck.title}
              wordCount={deck.wordCount}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 py-12 text-center">
          <h4 className="text-lg font-semibold">No decks yet</h4>
          <p className="mb-4 text-sm text-gray-500">
            Create your first deck to start studying.
          </p>
          <Button asChild>
            <Link href="/decks/new">
              <Icons.Plus className="mr-2 h-4 w-4" />
              Create Deck
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default RecentDecks;
