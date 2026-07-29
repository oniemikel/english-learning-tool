'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { StudySession } from '@/components/study/study-session';
import { useStudyStore } from '@/stores/study-store';
import { getStudySessionWords } from '@/lib/data/study';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

export default function StudyEnJaPage() {
  const searchParams = useSearchParams();
  const deckIdInStore = useStudyStore((state) => state.deckId);
  const newLimitInStore = useStudyStore((state) => state.newLimit);
  const reviewLimitInStore = useStudyStore((state) => state.reviewLimit);
  const orderInStore = useStudyStore((state) => state.order);
  const setDeckId = useStudyStore((state) => state.setDeckId);
  const setNewLimit = useStudyStore((state) => state.setNewLimit);
  const setReviewLimit = useStudyStore((state) => state.setReviewLimit);

  const deckIdFromQuery = searchParams.get('deckId') ?? searchParams.get('deck');
  const parsedNewLimit = Number.parseInt(searchParams.get('newLimit') ?? '', 10);
  const parsedReviewLimit = Number.parseInt(
    searchParams.get('reviewLimit') ?? '',
    10,
  );

  const deckId = deckIdFromQuery ?? deckIdInStore;
  const newLimit = Number.isInteger(parsedNewLimit)
    ? Math.min(100, Math.max(0, parsedNewLimit))
    : newLimitInStore;
  const reviewLimit = Number.isInteger(parsedReviewLimit)
    ? Math.min(200, Math.max(0, parsedReviewLimit))
    : reviewLimitInStore;
  const order = orderInStore;

  useEffect(() => {
    if (deckIdFromQuery && deckIdFromQuery !== deckIdInStore) {
      setDeckId(deckIdFromQuery);
    }
  }, [deckIdFromQuery, deckIdInStore, setDeckId]);

  useEffect(() => {
    if (Number.isInteger(parsedNewLimit) && parsedNewLimit !== newLimitInStore) {
      setNewLimit(Math.min(100, Math.max(0, parsedNewLimit)));
    }
  }, [parsedNewLimit, newLimitInStore, setNewLimit]);

  useEffect(() => {
    if (
      Number.isInteger(parsedReviewLimit) &&
      parsedReviewLimit !== reviewLimitInStore
    ) {
      setReviewLimit(Math.min(200, Math.max(0, parsedReviewLimit)));
    }
  }, [parsedReviewLimit, reviewLimitInStore, setReviewLimit]);

  const wordsQuery = useQuery({
    queryKey: ['study-session-words', { deckId, newLimit, reviewLimit, order }],
    queryFn: () => getStudySessionWords({ deckId, newLimit, reviewLimit, order }),
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

  if (wordsQuery.isError) {
    return (
      <section className="mx-auto max-w-3xl space-y-4 text-center">
        <h1 className="text-2xl font-semibold">Failed to load study cards.</h1>
        <p className="text-sm text-muted-foreground">
          Please check your network connection and try again.
        </p>
        <div>
          <Button onClick={() => wordsQuery.refetch()}>Retry</Button>
        </div>
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
