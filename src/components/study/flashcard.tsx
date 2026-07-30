'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { isEnglishAnswerMatch } from '@/lib/english-answer-match';
import {
  type StudyFsrsRating,
  type StudyReviewSubmission,
  toCorrectnessStatus,
} from '@/lib/study-rating';
import { cn } from '@/lib/utils';
import { type StudyInputMethod } from '@/stores/study-store';
import { GradeButtons } from './grade-buttons';

type StudyCard = {
  definition?: string;
  example?: string;
};

type FlashcardProps = {
  card: StudyCard;
  promptValue: string;
  answerValue: string;
  onSubmitReview: (submission: StudyReviewSubmission) => void;
  promptLabel?: string;
  answerLabel?: string;
  inputMethod?: StudyInputMethod;
  enableKeyboardRatingShortcuts?: boolean;
  allowTypingCorrectnessOverride?: boolean;
  isSubmitting?: boolean;
};

export function Flashcard({
  card,
  promptValue,
  answerValue,
  onSubmitReview,
  promptLabel = 'Word',
  answerLabel = 'Translation',
  inputMethod = 'SELF_EVALUATION',
  enableKeyboardRatingShortcuts = false,
  allowTypingCorrectnessOverride = true,
  isSubmitting = false,
}: FlashcardProps) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [isTypingSubmitted, setIsTypingSubmitted] = useState(false);
  const [isTypingMatch, setIsTypingMatch] = useState(false);
  const [selectedCorrectness, setSelectedCorrectness] = useState<boolean | null>(null);

  const isTypingMode = inputMethod === 'TYPING';

  useEffect(() => {
    setShowAnswer(false);
    setTypedAnswer('');
    setIsTypingSubmitted(false);
    setIsTypingMatch(false);
    setSelectedCorrectness(null);
  }, [answerValue, promptValue]);

  useEffect(() => {
    if (!enableKeyboardRatingShortcuts || isTypingMode) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (isSubmitting) {
        return;
      }

      if (event.defaultPrevented) {
        return;
      }

      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      if (event.code === 'Space') {
        if (!showAnswer) {
          event.preventDefault();
          setShowAnswer(true);
          return;
        }
      }

      if (!showAnswer) {
        return;
      }

      if (selectedCorrectness === null) {
        if (event.code === 'Digit1' || event.code === 'Space') {
          event.preventDefault();
          if (!isTypingMode || allowTypingCorrectnessOverride) {
            setSelectedCorrectness(false);
          }
          return;
        }

        if (event.code === 'Digit2' || event.code === 'Enter' || event.code === 'NumpadEnter') {
          event.preventDefault();
          if (!isTypingMode || allowTypingCorrectnessOverride) {
            setSelectedCorrectness(true);
          }
        }

        return;
      }

      const keyToGrade: Record<string, StudyFsrsRating> = {
        Digit1: 'again',
        Digit2: 'hard',
        Digit3: 'good',
        Digit4: 'easy',
      };

      const rating = keyToGrade[event.code];
      if (rating) {
        event.preventDefault();
        setShowAnswer(false);
        setTypedAnswer('');
        setIsTypingSubmitted(false);
        setIsTypingMatch(false);
        setSelectedCorrectness(null);
        onSubmitReview({
          isCorrect: selectedCorrectness,
          rating,
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [allowTypingCorrectnessOverride, enableKeyboardRatingShortcuts, isSubmitting, isTypingMode, onSubmitReview, selectedCorrectness, showAnswer]);

  const handleGrade = (rating: StudyFsrsRating) => {
    if (selectedCorrectness === null || isSubmitting) {
      return;
    }

    setShowAnswer(false);
    setTypedAnswer('');
    setIsTypingSubmitted(false);
    setIsTypingMatch(false);
    setSelectedCorrectness(null);
    onSubmitReview({
      isCorrect: selectedCorrectness,
      rating,
    });
  };

  const handleTypingSubmit = () => {
    if (isSubmitting) {
      return;
    }

    const isMatch = isEnglishAnswerMatch(answerValue, typedAnswer);
    setIsTypingMatch(isMatch);
    setIsTypingSubmitted(true);
    setSelectedCorrectness(isMatch);
    setShowAnswer(true);
  };

  const canOverrideTypingCorrectness = isTypingMode && allowTypingCorrectnessOverride;
  const showCorrectnessSelector = showAnswer && (!isTypingMode || isTypingSubmitted);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{promptLabel}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-3xl font-semibold tracking-tight">{promptValue}</p>

        {showAnswer && (
          <div
            className={cn(
              'space-y-4 rounded-lg bg-accent p-4 text-accent-foreground shadow-sm',
              'animate-[ui-flip-in_240ms_cubic-bezier(0.22,1,0.36,1)]',
            )}
          >
            <p className="text-lg font-semibold">
              {answerLabel}: {answerValue}
            </p>
            {card.definition && <p className="text-sm">Definition: {card.definition}</p>}
            {card.example && <p className="text-sm">Example: "{card.example}"</p>}
          </div>
        )}

        {isTypingMode ? (
          <div className="space-y-3">
            {!isTypingSubmitted ? (
              <>
                <Input
                  value={typedAnswer}
                  onChange={(event) => setTypedAnswer(event.target.value)}
                  placeholder="Type your English answer"
                  autoComplete="off"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  disabled={isSubmitting}
                />
                <Button className="w-full" onClick={handleTypingSubmit} disabled={isSubmitting || !typedAnswer.trim()}>
                  {isSubmitting ? 'Saving review...' : 'Check Answer'}
                </Button>
              </>
            ) : (
              <div
                className={cn(
                  'rounded-md border px-3 py-2 text-sm',
                  isTypingMatch
                    ? 'border-green-500/40 bg-green-500/10 text-green-700 dark:text-green-300'
                    : 'border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-300',
                )}
              >
                {isTypingMatch ? 'Correct match' : 'Not a match'}
              </div>
            )}
          </div>
        ) : null}

        {showCorrectnessSelector ? (
          <div className="space-y-3">
            <div className="space-y-1">
              <p className="text-sm font-medium">Correctness Status (required)</p>
              {isTypingMode ? (
                <p className="text-xs text-muted-foreground">
                  {canOverrideTypingCorrectness
                    ? 'Auto-checked from your typing result. You can override it if needed.'
                    : `Auto-checked from your typing result (${toCorrectnessStatus(Boolean(selectedCorrectness))}).`}
                </p>
              ) : null}
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                variant={selectedCorrectness === false ? 'destructive' : 'outline'}
                className={cn('flex-1', selectedCorrectness === false ? '' : 'border-red-300 text-red-700 hover:bg-red-50')}
                onClick={() => setSelectedCorrectness(false)}
                disabled={isSubmitting || (isTypingMode && !canOverrideTypingCorrectness)}
              >
                Incorrect
              </Button>
              <Button
                variant={selectedCorrectness === true ? 'default' : 'outline'}
                className={cn(
                  'flex-1',
                  selectedCorrectness === true
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'border-green-300 text-green-700 hover:bg-green-50',
                )}
                onClick={() => setSelectedCorrectness(true)}
                disabled={isSubmitting || (isTypingMode && !canOverrideTypingCorrectness)}
              >
                Correct
              </Button>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">FSRS Retention / Difficulty Rating</p>
              <GradeButtons onGrade={handleGrade} disabled={isSubmitting || selectedCorrectness === null} />
              {selectedCorrectness === null ? (
                <p className="text-xs text-muted-foreground">Select Correct or Incorrect first.</p>
              ) : null}
            </div>
          </div>
        ) : !isTypingMode ? (
          <Button className="w-full" onClick={() => setShowAnswer(true)} disabled={isSubmitting}>
            Show Answer
          </Button>
        ) : null}

        {enableKeyboardRatingShortcuts ? (
          <p className="text-xs text-muted-foreground">
            Keyboard: Space to reveal, 1/Space = Incorrect, 2/Enter = Correct, then 1-4 = Again/Hard/Good/Easy.
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
