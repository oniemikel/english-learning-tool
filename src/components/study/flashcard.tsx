'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
};

export function Flashcard({
  card,
  promptValue,
  answerValue,
  onGrade,
  promptLabel = 'Word',
  answerLabel = 'Translation',
}: FlashcardProps) {
  const [showAnswer, setShowAnswer] = useState(false);

  const handleGrade = (grade: 'again' | 'hard' | 'good' | 'easy') => {
    setShowAnswer(false);
    onGrade(grade);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{promptLabel}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-3xl font-semibold tracking-tight">{promptValue}</p>

        {showAnswer && (
          <div className="space-y-4 rounded-lg bg-accent p-4 text-accent-foreground">
            <p className="text-lg font-semibold">
              {answerLabel}: {answerValue}
            </p>
            {card.definition && <p className="text-sm">Definition: {card.definition}</p>}
            {card.example && <p className="text-sm">Example: "{card.example}"</p>}
          </div>
        )}

        {showAnswer ? (
          <GradeButtons onGrade={handleGrade} />
        ) : (
          <Button className="w-full" onClick={() => setShowAnswer(true)}>
            Show Answer
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
