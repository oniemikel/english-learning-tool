'use client';

import { useQuery } from '@tanstack/react-query';
import { StudySession } from '@/components/study/study-session';
import { useStudyStore } from '@/stores/study-store';
import { listWords } from '@/lib/mock-api';
import { Skeleton } from '@/components/ui/skeleton';

export default function StudyJaEnPage() {
  const { deckId, newLimit, reviewLimit } = useStudyStore();

  const wordsQuery = useQuery({
    queryKey: ['study-session-words', { deckId, newLimit, reviewLimit }],
    // TODO: In a real app, the API would return a mix of new and due words
    // based on the limits. For mock, we'll just use the deckId and limit.
    queryFn: () => listWords({ deckId, limit: newLimit + reviewLimit }),
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
      title="Japanese to English"
      cards={wordsQuery.data ?? []}
      mode="ja-en"
    />
  );
}
