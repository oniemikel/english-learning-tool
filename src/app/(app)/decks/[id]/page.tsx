'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PageTitle } from '@/components/ui/page-title';
import { getDeckDetails } from '@/lib/data/decks';
import { listWords } from '@/lib/data/words';
import { StatCard } from '@/components/ui/stat-card';
import { Book, Check, Globe, Plus } from 'lucide-react';
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

export default function DeckDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const deckQuery = useQuery({
    queryKey: ['deck', id],
    queryFn: () => getDeckDetails(id),
    enabled: !!id,
  });

  const wordsQuery = useQuery({
    queryKey: ['words', { deckId: id }],
    queryFn: () => listWords({ deckId: id }),
    enabled: !!id,
  });

  const deck = deckQuery.data;

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

      <div className="mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} title={stat.title} value={stat.value} icon={stat.icon} />
        ))}
      </div>

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
                Array.from({ length: 5 }).map((_, i) => (
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
              ) : wordsQuery.data?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-48 text-center">
                    <p className="font-semibold">No words in this deck yet.</p>
                    <p className="text-muted-foreground">
                      Get started by adding your first word.
                    </p>
                    <Link href={`/words/new?deckId=${id}`} className="mt-4 inline-block">
                      <Button>Add a New Word</Button>
                    </Link>
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
                      <Badge variant="secondary">{word.partOfSpeech}</Badge>
                    </TableCell>
                    <TableCell>{formatDate(word.nextReview)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}
