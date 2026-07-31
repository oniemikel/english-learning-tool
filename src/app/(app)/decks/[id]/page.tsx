'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { PageTitle } from '@/components/ui/page-title';
import { getDeckDetails } from '@/lib/data/decks';
import { listWords } from '@/lib/data/words';
import { StatCard } from '@/components/ui/stat-card';
import { Book, Check, Globe, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useDebounce } from '@/hooks/use-debounce';
import { AnimatedContainer } from '@/components/animated-container';

const PAGE_SIZE = 10;

export default function DeckDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pendingWordId, setPendingWordId] = useState<string | null>(null);
  const [isNavigating, startNavigation] = useTransition();
  const debouncedQuery = useDebounce(query, 300);
  const id = params.id;

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery]);

  const deckQuery = useQuery({
    queryKey: ['deck', id],
    queryFn: () => getDeckDetails(id),
    enabled: !!id,
  });

  const wordsQuery = useQuery({
    queryKey: ['words', { deckId: id, query: debouncedQuery, page }],
    queryFn: () =>
      listWords({
        deckId: id,
        query: debouncedQuery,
        page,
        pageSize: PAGE_SIZE,
      }),
    enabled: !!id,
  });

  const deck = deckQuery.data;
  const totalPages = wordsQuery.data?.totalPages ?? 1;
  const totalCount = wordsQuery.data?.totalCount ?? 0;

  if (deckQuery.isLoading) {
    return (
      <div className="p-6">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="mt-2 h-6 w-3/4" />
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <div className="mt-6">
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (deckQuery.isError || !deck) {
    return <div className="p-6 text-center">Deck not found.</div>;
  }

  const stats = [
    {
      title: 'Words',
      value: deck.wordCount,
      icon: <Book className="h-5 w-5 text-muted-foreground" />,
    },
    {
      title: 'Due',
      value: deck.dueCount,
      icon: <Check className="h-5 w-5 text-muted-foreground" />,
    },
    {
      title: 'New',
      value: deck.newCount,
      icon: <Plus className="h-5 w-5 text-muted-foreground" />,
    },
    {
      title: 'Status',
      value: deck.isPublic ? 'Public' : 'Private',
      icon: <Globe className="h-5 w-5 text-muted-foreground" />,
    },
  ];

  return (
    <section>
      <PageTitle
        title={deck.name}
        description={deck.description}
        actions={
          <div className="flex items-center gap-2">
            <Link href={`/decks/${id}/edit`}>
              <Button variant="outline">Edit</Button>
            </Link>
            <Link href={`/words/new?deckId=${id}`}>
              <Button variant="outline">Add Word</Button>
            </Link>
            <Link href={`/study?deckId=${id}`}>
              <Button>Study Deck</Button>
            </Link>
          </div>
        }
      />

      <AnimatedContainer>
        <div className="mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.title} title={stat.title} value={stat.value} icon={stat.icon} />
          ))}
        </div>
      </AnimatedContainer>

      <AnimatedContainer delay={0.05}>
        <div className="mb-5 flex items-center justify-between gap-4">
          <Input
            placeholder="Search by word or translation..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="max-w-sm"
          />
          {wordsQuery.data ? (
            <p className="text-sm text-muted-foreground">
              Total: <span className="font-medium text-foreground">{totalCount}</span> words
            </p>
          ) : null}
        </div>
      </AnimatedContainer>

      <AnimatedContainer delay={0.1}>
        <Card>
          <CardHeader>
            <CardTitle>Words in this Deck</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Word</TableHead>
                  <TableHead>Translation</TableHead>
                  <TableHead>Part of Speech</TableHead>
                  <TableHead>Last Reviewed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
              {wordsQuery.isLoading ? (
                Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-5 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-32" />
                    </TableCell>
                  </TableRow>
                ))
              ) : wordsQuery.isError ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Could not load words.
                  </TableCell>
                </TableRow>
              ) : wordsQuery.data?.items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-48 text-center">
                    <p className="font-semibold">No words in this deck yet.</p>
                    {query ? (
                      <p className="text-muted-foreground">Try a different search term.</p>
                    ) : (
                      <p className="text-muted-foreground">
                        Get started by adding your first word.
                      </p>
                    )}
                    <Link href={`/words/new?deckId=${id}`} className="mt-4 inline-block">
                      <Button>Add a New Word</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ) : (
                wordsQuery.data?.items.map((word) => (
                  <TableRow
                    key={word.id}
                    onClick={() => {
                      setPendingWordId(word.id);
                      startNavigation(() => router.push(`/words/${word.id}`));
                    }}
                    className="cursor-pointer"
                  >
                    <TableCell className="font-medium">
                      <span className="inline-flex items-center gap-2">
                        {word.word}
                        {isNavigating && pendingWordId === word.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                      </span>
                    </TableCell>
                    <TableCell>{word.translation}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{word.partOfSpeech}</Badge>
                    </TableCell>
                    <TableCell>{formatDate(word.nextReview)}</TableCell>
                  </TableRow>
                ))
              )}
              </TableBody>
            </Table>

            {totalPages > 1 ? (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    disabled={page === 1 || wordsQuery.isLoading}
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
                    disabled={page >= totalPages || wordsQuery.isLoading}
                  >
                    Next
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </AnimatedContainer>
      {isNavigating ? (
        <p className="mt-3 text-xs text-muted-foreground">Opening word details...</p>
      ) : null}
    </section>
  );
}
