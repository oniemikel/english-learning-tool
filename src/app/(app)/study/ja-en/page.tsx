'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { StudySession } from '@/components/study/study-session';
import { useStudyStore } from '@/stores/study-store';
import { getStudySessionWords } from '@/lib/data/study';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { AnimatedContainer } from '@/components/animated-container';

const isInputMethodParam = (value: string | null): value is 'SELF_EVALUATION' | 'TYPING' => {
  return value === 'SELF_EVALUATION' || value === 'TYPING';
};

export default function StudyJaEnPage() {
  const searchParams = useSearchParams();
  const deckIdInStore = useStudyStore((state) => state.deckId);
  const newLimitInStore = useStudyStore((state) => state.newLimit);
  const reviewLimitInStore = useStudyStore((state) => state.reviewLimit);
  const orderInStore = useStudyStore((state) => state.order);
  const inputMethodInStore = useStudyStore((state) => state.inputMethod);
  const setDeckId = useStudyStore((state) => state.setDeckId);
  const setMode = useStudyStore((state) => state.setMode);
  const setInputMethod = useStudyStore((state) => state.setInputMethod);
  const setNewLimit = useStudyStore((state) => state.setNewLimit);
  const setReviewLimit = useStudyStore((state) => state.setReviewLimit);

  const deckIdFromQuery = searchParams.get('deckId') ?? searchParams.get('deck');
  const parsedNewLimit = Number.parseInt(searchParams.get('newLimit') ?? '', 10);
  const parsedReviewLimit = Number.parseInt(
    searchParams.get('reviewLimit') ?? '',
    10,
  );
  const inputMethodFromQuery = searchParams.get('inputMethod');

  const deckId = deckIdFromQuery ?? deckIdInStore;
  const newLimit = Number.isInteger(parsedNewLimit)
    ? Math.min(100, Math.max(0, parsedNewLimit))
    : newLimitInStore;
  const reviewLimit = Number.isInteger(parsedReviewLimit)
    ? Math.min(200, Math.max(0, parsedReviewLimit))
    : reviewLimitInStore;
  const inputMethod = isInputMethodParam(inputMethodFromQuery)
    ? inputMethodFromQuery
    : inputMethodInStore;
  const order = orderInStore;

  useEffect(() => {
    setMode('ja-en');
  }, [setMode]);

  useEffect(() => {
    setInputMethod(inputMethod);
  }, [inputMethod, setInputMethod]);

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
        <AnimatedContainer>
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="mt-4 h-48 w-full" />
          <Skeleton className="mt-4 h-12 w-full" />
        </AnimatedContainer>
      </section>
    );
  }

  if (wordsQuery.isError) {
    return (
      <section className="mx-auto max-w-3xl space-y-4 text-center">
        <AnimatedContainer>
          <h1 className="text-2xl font-semibold">Failed to load study cards.</h1>
          <p className="text-sm text-muted-foreground">
            Please check your network connection and try again.
          </p>
          <div>
            <Button onClick={() => wordsQuery.refetch()}>Retry</Button>
          </div>
        </AnimatedContainer>
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
