'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { PageTitle } from '@/components/ui/page-title';
import { getDeckById, updateDeck } from '@/lib/data/decks';
import { DeckForm, DeckFormValues } from '@/components/decks/deck-form';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditDeckPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const deckQuery = useQuery({
    queryKey: ['deck', id],
    queryFn: () => getDeckById(id),
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: (values: DeckFormValues) => updateDeck({ ...values, id }),
    onSuccess: () => {
      router.push(`/decks/${id}`);
    },
  });

  const handleSubmit = (values: DeckFormValues) => {
    mutation.mutate(values);
  };

  if (deckQuery.isLoading || !deckQuery.data) {
    return (
      <section>
        <PageTitle title="Edit Deck" />
        <div className="mx-auto max-w-2xl">
          <Skeleton className="h-96 w-full" />
        </div>
      </section>
    );
  }

  return (
    <section>
      <PageTitle title="Edit Deck" description="Update the deck's name, description, and settings." />
      <DeckForm
        initialData={deckQuery.data}
        onSubmit={handleSubmit}
        isSubmitting={mutation.isPending}
        onCancel={() => router.push(`/decks/${id}`)}
      />
    </section>
  );
}
