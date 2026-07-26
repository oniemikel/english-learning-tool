'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageTitle } from '@/components/ui/page-title';
import { listWords } from '@/lib/mock-api';
import { formatDate } from '@/lib/utils';
import { useDebounce } from '@/hooks/use-debounce';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';

export default function WordsPage() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const router = useRouter();

  const wordsQuery = useQuery({
    queryKey: ['words', debouncedQuery],
    queryFn: () => listWords({ query: debouncedQuery }),
  });

  return (
    <section>
      <PageTitle
        title="All Words"
        description="Search and manage all words across your decks."
        actions={
          <Link href="/words/new">
            <Button>Add Word</Button>
          </Link>
        }
      />

      <div className="mb-5">
        <Input
          placeholder="Search by word or translation..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="max-w-sm"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Word</TableHead>
            <TableHead>Translation</TableHead>
            <TableHead>Deck</TableHead>
            <TableHead>Part of Speech</TableHead>
            <TableHead>Accuracy</TableHead>
            <TableHead>Next Review</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {wordsQuery.isLoading ? (
            Array.from({ length: 10 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-5 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-12" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-32" />
                </TableCell>
              </TableRow>
            ))
          ) : wordsQuery.isError ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                Could not load words.
              </TableCell>
            </TableRow>
          ) : wordsQuery.data?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-48 text-center">
                <p className="font-semibold">No words found.</p>
                {query ? (
                  <p className="text-muted-foreground">Try a different search term.</p>
                ) : (
                  <p className="text-muted-foreground">Get started by creating your first word.</p>
                )}
              </TableCell>
            </TableRow>
          ) : (
            wordsQuery.data?.map((word) => (
              <TableRow
                key={word.id}
                onClick={() => router.push(`/words/${word.id}`)}
                className="cursor-pointer"
              >
                <TableCell className="font-medium">{word.word}</TableCell>
                <TableCell>{word.translation}</TableCell>
                <TableCell>
                  <Link
                    href={`/decks/${word.deckId}`}
                    className="hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {word.deckName}
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{word.partOfSpeech}</Badge>
                </TableCell>
                <TableCell>{word.accuracy}%</TableCell>
                <TableCell>{formatDate(word.nextReview)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </section>
  );
}
