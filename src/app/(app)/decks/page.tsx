'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageTitle } from '@/components/ui/page-title';
import { listDecks } from '@/lib/mock-api';
import { useDebounce } from '@/hooks/use-debounce';
import { DeckCard } from '@/components/decks/deck-card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { Deck } from '@/lib/mock-data';
import { PlusSquare } from 'lucide-react';

// Mock delete function
const deleteDeck = async (id: string) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log(`Deleted deck with id: ${id}`);
  return { id };
};

export default function DecksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const queryClient = useQueryClient();

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const decksQuery = useQuery({
    queryKey: ['decks', debouncedSearchQuery],
    queryFn: () => listDecks({ query: debouncedSearchQuery }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDeck,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['decks'] });
      setIsDeleteDialogOpen(false);
      setSelectedDeck(null);
    },
  });

  const handleDeleteClick = (deck: Deck) => {
    setSelectedDeck(deck);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedDeck) {
      deleteMutation.mutate(selectedDeck.id);
    }
  };

  return (
    <>
      <section>
        <PageTitle title="Decks" description="Create, search, and manage your word decks." />

        <div className="mb-6 flex items-center justify-between">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search decks by name..."
            className="max-w-sm"
          />
          <div className="flex gap-2">
            <Link href="/csv-import">
              <Button variant="outline">Import from CSV</Button>
            </Link>
            <Link href="/decks/new">
              <Button>New Deck</Button>
            </Link>
          </div>
        </div>

        {decksQuery.isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-52" />
            ))}
          </div>
        ) : decksQuery.isError ? (
          <div className="text-center text-red-500">Failed to load decks.</div>
        ) : !decksQuery.data || decksQuery.data.length === 0 ? (
          <div className="flex h-80 flex-col items-center justify-center rounded-lg border-2 border-dashed">
            <PlusSquare className="h-16 w-16 text-muted-foreground" />
            <h3 className="mt-4 text-xl font-semibold">No decks found</h3>
            <p className="mt-2 text-sm text-muted-foreground">Get started by creating your first deck.</p>
            <Link href="/decks/new" className="mt-4">
              <Button>Create New Deck</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {decksQuery.data.map((deck) => (
              <DeckCard key={deck.id} deck={deck} onDelete={handleDeleteClick} />
            ))}
          </div>
        )}
      </section>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the deck "{selectedDeck?.name}" and all of its
              words.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
