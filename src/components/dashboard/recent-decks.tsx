// src/components/dashboard/recent-decks.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DASHBOARD_DATA } from '@/lib/mock-data';
import { Icons } from '@/components/icons';
import DeckCard from './deck-card';

const RecentDecks = () => {
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
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {DASHBOARD_DATA.recentDecks.map((deck) => (
          <DeckCard key={deck.id} {...deck} />
        ))}
      </div>
    </div>
  );
};

export default RecentDecks;
