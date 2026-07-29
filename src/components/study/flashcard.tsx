'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { isEnglishAnswerMatch } from '@/lib/english-answer-match';
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
  onGrade: (grade: 'again' | 'hard' | 'good' | 'easy') => void;
  promptLabel?: string;
  answerLabel?: string;
  inputMethod?: StudyInputMethod;
  enableKeyboardRatingShortcuts?: boolean;
};

export function Flashcard({
  card,
  promptValue,
  answerValue,
  onGrade,
  promptLabel = 'Word',
  answerLabel = 'Translation',
  inputMethod = 'SELF_EVALUATION',
  enableKeyboardRatingShortcuts = false,
}: FlashcardProps) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [isTypingSubmitted, setIsTypingSubmitted] = useState(false);
  const [isTypingMatch, setIsTypingMatch] = useState(false);

  const isTypingMode = inputMethod === 'TYPING';

  useEffect(() => {
    setShowAnswer(false);
    setTypedAnswer('');
    setIsTypingSubmitted(false);
    setIsTypingMatch(false);
  }, [answerValue, promptValue]);

  useEffect(() => {
    if (!enableKeyboardRatingShortcuts || isTypingMode) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) {
        return;
      }

      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      if (event.code === 'Space') {
        event.preventDefault();
        if (!showAnswer) {
          setShowAnswer(true);
        }
        return;
      }

      if (!showAnswer) {
        return;
      }

      const keyToGrade: Record<string, 'again' | 'hard' | 'good' | 'easy'> = {
        Digit1: 'again',
        Digit2: 'hard',
        Digit3: 'good',
        Digit4: 'easy',
      };

      const grade = keyToGrade[event.code];
      if (grade) {
        event.preventDefault();
        setShowAnswer(false);
        setTypedAnswer('');
        setIsTypingSubmitted(false);
        setIsTypingMatch(false);
        onGrade(grade);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enableKeyboardRatingShortcuts, isTypingMode, onGrade, showAnswer]);

  const handleGrade = (grade: 'again' | 'hard' | 'good' | 'easy') => {
    setShowAnswer(false);
    setTypedAnswer('');
    setIsTypingSubmitted(false);
    setIsTypingMatch(false);
    onGrade(grade);
  };

  const handleTypingSubmit = () => {
    const isMatch = isEnglishAnswerMatch(answerValue, typedAnswer);
    setIsTypingMatch(isMatch);
    setIsTypingSubmitted(true);
    setShowAnswer(true);
  };

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
                />
                <Button className="w-full" onClick={handleTypingSubmit} disabled={!typedAnswer.trim()}>
                  Check Answer
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

        {showAnswer ? (
          <GradeButtons onGrade={handleGrade} />
        ) : !isTypingMode ? (
          <Button className="w-full" onClick={() => setShowAnswer(true)}>
            Show Answer
          </Button>
        ) : null}

        {enableKeyboardRatingShortcuts ? (
          <p className="text-xs text-muted-foreground">Keyboard: Space to reveal, 1-4 to rate.</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
