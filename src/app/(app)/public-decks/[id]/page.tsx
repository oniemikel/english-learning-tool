'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PageTitle } from '@/components/ui/page-title';
import { getDeckById, listWords } from '@/lib/mock-api';

const schema = z.object({
  name: z.string().trim().min(1).max(100),
});

type CloneFormValues = z.infer<typeof schema>;

export default function PublicDeckDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const deckQuery = useQuery({ queryKey: ['public-deck', id], queryFn: () => getDeckById(id) });
  const wordsQuery = useQuery({ queryKey: ['words'], queryFn: () => listWords() });

  const form = useForm<CloneFormValues>({
    resolver: zodResolver(schema),
    values: { name: deckQuery.data?.name ?? '' },
  });

  const cloneMutation = useMutation({
    mutationFn: async (values: CloneFormValues) => values,
    onSuccess: () => router.push('/decks/deck-1'),
  });

  if (deckQuery.isLoading || !deckQuery.data) {
    return <div className="rounded-[var(--radius-card)] border bg-[var(--card)] p-6">読み込み中またはデータが見つかりません。</div>;
  }

  return (
    <section>
      <PageTitle title={deckQuery.data.name} description={deckQuery.data.description} />
      <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>単語サンプル</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {wordsQuery.data
              ?.filter((word) => word.deckId === id)
              .slice(0, 8)
              .map((word) => (
                <div key={word.id} className="rounded-[var(--radius-control)] border border-[var(--border)] p-3 text-sm">
                  {word.word} - {word.translation}
                </div>
              ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>このデッキを複製</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={form.handleSubmit((values) => cloneMutation.mutate(values))}>
              <label className="block space-y-1">
                <span className="text-sm">複製後デッキ名</span>
                <Input {...form.register('name')} />
              </label>
              <div className="flex justify-end gap-2">
                <Link href="/public-decks">
                  <Button type="button" variant="outline">
                    戻る
                  </Button>
                </Link>
                <Button type="submit">複製する</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
