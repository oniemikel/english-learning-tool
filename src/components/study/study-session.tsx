'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { getUserSettings } from '@/lib/data/settings';
import { submitStudyReview } from '@/lib/data/study';
import { type StudyReviewSubmission } from '@/lib/study-rating';
import { getEffectiveInputMethod, useStudyStore } from '@/stores/study-store';
import { Flashcard } from './flashcard';

type StudyCard = {
  id: string;
  cardId: string;
  deckId: string;
  word: string;
  translation: string;
  definition?: string;
  example?: string;
};

type StudySessionProps = {
  title: string;
  cards: StudyCard[];
  mode: 'en-ja' | 'ja-en' | 'listening' | 'pronunciation';
};

export function StudySession({ title, cards, mode }: StudySessionProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const solved = useStudyStore((state) => state.solved);
  const answer = useStudyStore((state) => state.answer);
  const start = useStudyStore((state) => state.start);
  const inputMethod = useStudyStore((state) => state.inputMethod);

  const settingsQuery = useQuery({
    queryKey: ['user-settings'],
    queryFn: getUserSettings,
  });

  const reviewMutation = useMutation({
    mutationFn: submitStudyReview,
  });

  const totalCards = cards.length;
  const progressRate = totalCards > 0 ? Math.min(100, Math.round((solved / totalCards) * 100)) : 0;

  useEffect(() => {
    start();
  }, [start]);

  const handleEndSession = () => {
    startTransition(() => router.push('/study/result'));
  };

  const handleReview = async (submission: StudyReviewSubmission) => {
    if (reviewMutation.isPending || isPending) {
      return;
    }

    const gradedCard = cards[currentIndex];
    try {
      setSubmitError(null);
      await reviewMutation.mutateAsync({
        cardId: gradedCard.cardId,
        rating: submission.rating,
        isCorrect: submission.isCorrect,
      });

      answer(submission.isCorrect, submission.rating);

      if (currentIndex < totalCards - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        handleEndSession();
      }
    } catch (error) {
      console.error('Failed to save review:', error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Failed to save this review. Please try again.',
      );
    }
  };

  const currentCard = cards[currentIndex];

  if (totalCards === 0) {
    return (
      <section className="mx-auto max-w-3xl text-center">
        <h1 className="text-2xl font-semibold">No cards to study in this session.</h1>
        <Button onClick={() => startTransition(() => router.push('/decks'))} className="mt-4" disabled={isPending}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {isPending ? 'Moving...' : 'Back to Decks'}
        </Button>
      </section>
    );
  }

  const promptValue = mode === 'ja-en' ? currentCard.translation : currentCard.word;
  const answerValue = mode === 'ja-en' ? currentCard.word : currentCard.translation;

  const promptLabel = mode === 'ja-en' ? 'Japanese' : 'English';
  const answerLabel = mode === 'ja-en' ? 'English' : 'Japanese';
  const effectiveInputMethod = getEffectiveInputMethod(mode, inputMethod);
  const directionLabel =
    mode === 'ja-en'
      ? 'Direction: JP -> EN'
      : mode === 'en-ja'
        ? 'Direction: EN -> JP'
        : `Mode: ${title}`;
  const methodLabel =
    effectiveInputMethod === 'TYPING' ? 'Input: Typing' : 'Input: Self-Evaluation';
  const assessmentLabel = 'Assessment: Correct/Incorrect + FSRS (Again/Hard/Good/Easy)';
  const useKeyboardRatingShortcuts = effectiveInputMethod === 'SELF_EVALUATION';
  const allowTypingCorrectnessOverride = settingsQuery.data?.allowTypingCorrectnessOverride ?? true;

  return (
    <section className="mx-auto max-w-3xl animate-[ui-fade-in_220ms_ease-out]">
      <div className="mb-5">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span className="rounded-full border px-2 py-1">{directionLabel}</span>
          <span className="rounded-full border px-2 py-1">{methodLabel}</span>
          <span className="rounded-full border px-2 py-1">{assessmentLabel}</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-primary transition-[width] duration-300 ease-out" style={{ width: `${progressRate}%` }} />
        </div>
        <div className="mt-2 text-sm text-muted-foreground">
          Card {currentIndex + 1} of {totalCards}
        </div>
      </div>

      <div key={currentCard.cardId} className="animate-[ui-slide-in-right_220ms_ease-out]">
        {submitError ? (
          <div className="mb-4 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-300">
            Could not save your answer. Try submitting again. Details: {submitError}
          </div>
        ) : null}
        <Flashcard
          card={currentCard}
          promptValue={promptValue}
          answerValue={answerValue}
          onSubmitReview={handleReview}
          promptLabel={promptLabel}
          answerLabel={answerLabel}
          inputMethod={effectiveInputMethod}
          enableKeyboardRatingShortcuts={useKeyboardRatingShortcuts}
          allowTypingCorrectnessOverride={allowTypingCorrectnessOverride}
          isSubmitting={reviewMutation.isPending || isPending}
        />
      </div>

      <div className="mt-4 flex justify-end">
        <Button variant="outline" onClick={handleEndSession} disabled={isPending || reviewMutation.isPending}>
          {isPending || reviewMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {isPending ? 'Ending session...' : reviewMutation.isPending ? 'Saving review...' : 'End Session'}
        </Button>
      </div>
    </section>
  );
}