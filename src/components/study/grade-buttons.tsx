'use client';

import { Button } from '@/components/ui/button';

type GradeButtonsProps = {
  onGrade: (grade: 'again' | 'hard' | 'good' | 'easy') => void;
};

export function GradeButtons({ onGrade }: GradeButtonsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      <Button variant="outline" className="flex-1" onClick={() => onGrade('again')}>
        Again
      </Button>
      <Button variant="outline" className="flex-1" onClick={() => onGrade('hard')}>
        Hard
      </Button>
      <Button variant="outline" className="flex-1" onClick={() => onGrade('good')}>
        Good
      </Button>
      <Button variant="outline" className="flex-1" onClick={() => onGrade('easy')}>
        Easy
      </Button>
    </div>
  );
}
