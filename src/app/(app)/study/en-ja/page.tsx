'use client';

import { useQuery } from '@tanstack/react-query';
import { StudySession } from '@/components/study/study-session';
import { useStudyStore } from '@/stores/study-store';
import { getStudySessionWords } from '@/lib/data/study';
import { Skeleton } from '@/components/ui/skeleton';

export default function StudyEnJaPage() {
  const { deckId, newLimit, reviewLimit } = useStudyStore();

  const wordsQuery = useQuery({
    queryKey: ['study-session-words', { deckId, newLimit, reviewLimit }],
    queryFn: () => getStudySessionWords({ deckId, newLimit, reviewLimit }),
    enabled: !!deckId,
  });

  if (wordsQuery.isLoading) {
    return (
      <section className="mx-auto max-w-3xl">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="mt-4 h-48 w-full" />
        <Skeleton className="mt-4 h-12 w-full" />
      </section>
    );
  }

  return (
    <StudySession
      title="English to Japanese"
      cards={wordsQuery.data ?? []}
      mode="en-ja"
    />
  );
}
