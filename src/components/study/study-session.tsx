'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useStudyStore } from '@/stores/study-store';
import { Flashcard } from './flashcard';

type StudyCard = {
  id: string;
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const { solved, start } = useStudyStore((state) => ({
    solved: state.solved,
    start: state.start,
  }));
  const totalCards = cards.length;
  const progressRate = totalCards > 0 ? Math.min(100, Math.round((solved / totalCards) * 100)) : 0;

  useEffect(() => {
    start();
  }, [start]);

  const handleEndSession = () => {
    router.push('/study/result');
  };

  const handleGrade = () => {
    if (currentIndex < totalCards - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleEndSession();
    }
  };

  const currentCard = cards[currentIndex];

  if (totalCards === 0) {
    return (
      <section className="mx-auto max-w-3xl text-center">
        <h1 className="text-2xl font-semibold">No cards to study in this session.</h1>
        <Button onClick={() => router.push('/decks')} className="mt-4">
          Back to Decks
        </Button>
      </section>
    );
  }

  const promptValue = mode === 'ja-en' ? currentCard.translation : currentCard.word;
  const answerValue = mode === 'ja-en' ? currentCard.word : currentCard.translation;

  const promptLabel = mode === 'ja-en' ? 'Japanese' : 'English';
  const answerLabel = mode === 'ja-en' ? 'English' : 'Japanese';

  return (
    <section className="mx-auto max-w-3xl">
      <div className="mb-5">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-primary transition-all" style={{ width: `${progressRate}%` }} />
        </div>
        <div className="mt-2 text-sm text-muted-foreground">
          Card {currentIndex + 1} of {totalCards}
        </div>
      </div>

      <Flashcard
        card={currentCard}
        promptValue={promptValue}
        answerValue={answerValue}
        onGrade={handleGrade}
        promptLabel={promptLabel}
        answerLabel={answerLabel}
      />

      <div className="mt-4 flex justify-end">
        <Button variant="outline" onClick={handleEndSession}>
          End Session
        </Button>
      </div>
    </section>
  );
}
