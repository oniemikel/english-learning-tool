'use client';

import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type FlashcardProps = {
  front: ReactNode;
  back: ReactNode;
  isFlipped: boolean;
};

export function Flashcard({ front, back, isFlipped }: FlashcardProps) {
  return (
    <div className="w-full max-w-2xl [perspective:1000px]">
      <div
        className={cn('relative h-96 w-full transition-transform duration-700 [transform-style:preserve-3d]', {
          '[transform:rotateY(180deg)]': isFlipped,
        })}
      >
        {/* Front of the card */}
        <Card
          className={cn(
            'absolute flex h-full w-full flex-col items-center justify-center [backface-visibility:hidden]',
          )}
        >
          <CardContent className="flex h-full w-full flex-col items-center justify-center p-6 text-center">
            {front}
          </CardContent>
        </Card>

        {/* Back of the card */}
        <Card
          className={cn(
            'absolute flex h-full w-full flex-col items-center justify-center [backface-visibility:hidden] [transform:rotateY(180deg)]',
          )}
        >
          <CardContent className="flex h-full w-full flex-col items-center justify-center p-6 text-center">
            {back}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
