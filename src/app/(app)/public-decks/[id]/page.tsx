'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PageTitle } from '@/components/ui/page-title';
import { clonePublicDeck, getPublicDeckById } from '@/lib/data/decks';
import { listPublicWords } from '@/lib/data/words';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

const schema = z.object({
  name: z.string().trim().min(1).max(100),
});

type CloneFormValues = z.infer<typeof schema>;

export default function PublicDeckDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const deckQuery = useQuery({
    queryKey: ['public-deck', id],
    queryFn: () => getPublicDeckById(id),
    enabled: !!id,
  });

  const wordsQuery = useQuery({
    queryKey: ['words', { deckId: id }],
    queryFn: () => listPublicWords({ deckId: id, limit: 10 }),
    enabled: !!id,
  });

  const deck = deckQuery.data;

  const form = useForm<CloneFormValues>({
    resolver: zodResolver(schema),
    values: { name: deck?.name ? `${deck.name} (Copy)` : '' },
  });

  const cloneMutation = useMutation({
    mutationFn: (values: CloneFormValues) =>
      clonePublicDeck({
        sourceDeckId: id,
        name: values.name,
      }),
    onSuccess: (data) => {
      router.push(`/decks/${data.id}`);
    },
  });

  if (deckQuery.isLoading || !deck) {
    return (
      <div className="p-6">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="mt-2 h-6 w-3/4" />
        <div className="mt-6 grid gap-5 lg:grid-cols-[1.3fr_1fr]">
          <Skeleton className="h-96" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  return (
    <section>
      <PageTitle title={deck.name} description={deck.description} />
      <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Word Samples</CardTitle>
            <CardDescription>Here are some examples of words from this deck.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Word</TableHead>
                  <TableHead>Translation</TableHead>
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
                    </TableRow>
                  ))
                ) : wordsQuery.isError ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center">
                      Could not load words.
                    </TableCell>
                  </TableRow>
                ) : (
                  wordsQuery.data?.map((word) => (
                    <TableRow key={word.id}>
                      <TableCell className="font-medium">{word.word}</TableCell>
                      <TableCell>{word.translation}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Clone This Deck</CardTitle>
            <CardDescription>
              Create a copy of this deck in your own collection to start studying.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={form.handleSubmit((values) => cloneMutation.mutate(values))}>
              <div className="space-y-1">
                <label htmlFor="name" className="text-sm font-medium">
                  New Deck Name
                </label>
                <Input id="name" {...form.register('name')} />
              </div>
              <div className="flex justify-end gap-2">
                <Link href="/public-decks">
                  <Button type="button" variant="outline">
                    Back
                  </Button>
                </Link>
                <Button type="submit" disabled={cloneMutation.isPending}>
                  {cloneMutation.isPending ? 'Cloning...' : 'Clone Deck'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
