'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { WordForm, type WordFormValues } from '@/components/words/word-form';
import { Button } from '@/components/ui/button';
import { PageTitle } from '@/components/ui/page-title';
import { listDecks } from '@/lib/data/decks';
import { getWordById, updateWord } from '@/lib/data/words';

export default function WordEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [isPendingNavigation, startNavigation] = useTransition();
  const wordQuery = useQuery({ queryKey: ['word', id], queryFn: () => getWordById(id) });
  const decksQuery = useQuery({ queryKey: ['decks'], queryFn: () => listDecks({}) });

  const saveMutation = useMutation({
    mutationFn: async (values: WordFormValues) => updateWord({ id, ...values }),
    onSuccess: () => startNavigation(() => router.push(`/words/${id}`)),
  });

  if (wordQuery.isLoading || decksQuery.isLoading || !wordQuery.data) {
    return <div className="rounded-(--radius-card) border bg-(--card) p-6">Loading... (maybe not found)</div>;
  }

  if (!decksQuery.data || decksQuery.data.length === 0) {
    return (
      <section>
        <PageTitle title="単語編集" description="編集にはデッキが必要です。" />
        <div className="text-center">
          <p>You need to create a deck first.</p>
          <Link href="/decks/new">
            <Button className="mt-4">Create Deck</Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section>
      <PageTitle title="単語編集" description="例文や定義を更新します。" />
      <WordForm
        title={wordQuery.data.word}
        deckOptions={decksQuery.data}
        initialData={{
          word: wordQuery.data.word,
          translation: wordQuery.data.translation,
          partOfSpeech: wordQuery.data.partOfSpeech ?? 'OTHER',
          deckIds: wordQuery.data.deckIds,
          definition: wordQuery.data.definition,
          example: wordQuery.data.example,
        }}
        onSubmit={(values) => saveMutation.mutate(values)}
        onCancel={() => startNavigation(() => router.push(`/words/${id}`))}
        isSubmitting={saveMutation.isPending || isPendingNavigation}
        submitButtonText="保存"
        cancelPending={isPendingNavigation}
      />
    </section>
  );
}
