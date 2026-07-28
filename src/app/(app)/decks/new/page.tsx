'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { PageTitle } from '@/components/ui/page-title';
import { createDeck } from '@/lib/data/decks';
import { DeckForm, DeckFormValues } from '@/components/decks/deck-form';

export default function DeckCreatePage() {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: createDeck,
    onSuccess: (deck) => {
      router.push(`/decks/${deck.id}`);
    },
  });

  const handleSubmit = (values: DeckFormValues) => {
    mutation.mutate(values);
  };

  return (
    <section>
      <PageTitle title="Create New Deck" description="Start a new collection of words to study." />
      <DeckForm
        onSubmit={handleSubmit}
        isSubmitting={mutation.isPending}
        onCancel={() => router.push('/decks')}
        submitButtonText="Create Deck"
      />
    </section>
  );
}
