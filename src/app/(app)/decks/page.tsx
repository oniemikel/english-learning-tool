'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageTitle } from '@/components/ui/page-title';
import { listDecks, deleteDeck } from '@/lib/data/decks';
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
import { ChevronLeft, ChevronRight, PlusSquare } from 'lucide-react';
import { AnimatedContainer } from '@/components/animated-container';

const PAGE_SIZE = 9;

type DeckListItem = Awaited<ReturnType<typeof listDecks>>[number];

type DecksQueryData =
  | {
      items: DeckListItem[];
      totalCount?: number;
      totalPages?: number;
      page?: number;
      pageSize?: number;
    }
  | DeckListItem[];

export default function DecksPage() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState<DeckListItem | null>(null);
  const [showStartNotice, setShowStartNotice] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (searchParams.get('notice') !== 'select-deck-to-study') {
      return;
    }

    setShowStartNotice(true);

    const timeoutId = window.setTimeout(() => {
      setShowStartNotice(false);
    }, 5000);

    return () => window.clearTimeout(timeoutId);
  }, [searchParams]);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchQuery]);

  const decksQuery = useQuery<DecksQueryData>({
    queryKey: ['decks', debouncedSearchQuery, page],
    queryFn: () =>
      listDecks({
        query: debouncedSearchQuery,
        page,
        pageSize: PAGE_SIZE,
      }),
  });

  const deckItems = Array.isArray(decksQuery.data)
    ? decksQuery.data
    : decksQuery.data?.items ?? [];
  const totalCount = Array.isArray(decksQuery.data)
    ? decksQuery.data.length
    : decksQuery.data?.totalCount ?? 0;
  const totalPages = Array.isArray(decksQuery.data)
    ? Math.max(1, Math.ceil(deckItems.length / PAGE_SIZE))
    : decksQuery.data?.totalPages ?? 1;

  const visibleDecks = Array.isArray(decksQuery.data)
    ? deckItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    : deckItems;

  const deleteMutation = useMutation({
    mutationFn: deleteDeck,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['decks'] });
      setIsDeleteDialogOpen(false);
      setSelectedDeck(null);
    },
  });

  const handleDeleteClick = (deck: DeckListItem) => {
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
      {showStartNotice ? (
        <div className="fixed right-4 top-4 z-50 w-full max-w-sm rounded-lg border bg-card p-4 shadow-lg">
          <p className="text-sm font-medium">
            Please select a deck to start studying.
          </p>
        </div>
      ) : null}

      <section>
        <PageTitle
          title="Decks"
          description="Create, search, and manage your word decks."
        />

        <AnimatedContainer>
          <div className="mb-6 flex items-center justify-between">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search decks by name..."
              className="max-w-sm"
            />
            {decksQuery.data ? (
              <p className="text-sm text-muted-foreground">
                Total:{" "}
                <span className="font-medium text-foreground">
                  {totalCount}
                </span>{" "}
                decks
              </p>
            ) : null}
            <div className="flex gap-2">
              <Link href="/csv-import">
                <Button variant="outline">Import from CSV</Button>
              </Link>
              <Link href="/decks/new">
                <Button>New Deck</Button>
              </Link>
            </div>
          </div>
        </AnimatedContainer>

        {totalPages > 1 ? (
          // <AnimatedContainer delay={0.1}>
          <div className="mt-4 flex items-center justify-between pb-5">
            <p className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page === 1 || decksQuery.isLoading}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPage((current) => Math.min(totalPages, current + 1))
                }
                disabled={page >= totalPages || decksQuery.isLoading}
              >
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : // </AnimatedContainer>
        null}

        {decksQuery.isLoading ? (
          <AnimatedContainer delay={0.05}>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-52" />
              ))}
            </div>
          </AnimatedContainer>
        ) : decksQuery.isError ? (
          <AnimatedContainer delay={0.05}>
            <div className="text-center text-red-500">
              Failed to load decks.
            </div>
          </AnimatedContainer>
        ) : !decksQuery.data || deckItems.length === 0 ? (
          <AnimatedContainer delay={0.05}>
            <div className="flex h-80 flex-col items-center justify-center rounded-lg border-2 border-dashed">
              <PlusSquare className="h-16 w-16 text-muted-foreground" />
              <h3 className="mt-4 text-xl font-semibold">No decks found</h3>
              {searchQuery ? (
                <p className="mt-2 text-sm text-muted-foreground">
                  Try a different search term.
                </p>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">
                  Get started by creating your first deck.
                </p>
              )}
              <Link href="/decks/new" className="mt-4">
                <Button>Create New Deck</Button>
              </Link>
            </div>
          </AnimatedContainer>
        ) : (
          <>
            <AnimatedContainer delay={0.05}>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {visibleDecks.map((deck) => (
                  <DeckCard
                    key={deck.id}
                    deck={deck}
                    onDelete={handleDeleteClick}
                  />
                ))}
              </div>
            </AnimatedContainer>
          </>
        )}
      </section>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              deck "{selectedDeck?.name}" and all of its words.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
