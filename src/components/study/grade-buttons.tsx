'use client';

import { Button } from '@/components/ui/button';
import { useStudyStore } from '@/stores/study-store';

type GradeButtonsProps = {
  onGrade: (grade: 'again' | 'hard' | 'good' | 'easy') => void;
};

export function GradeButtons({ onGrade }: GradeButtonsProps) {
  const { answer } = useStudyStore();

  const handleGrade = (grade: 'again' | 'hard' | 'good' | 'easy', isCorrect: boolean) => {
    answer(isCorrect);
    onGrade(grade);
  };

  return (
    <div className="flex flex-wrap justify-center gap-3">
      <Button variant="outline" className="flex-1" onClick={() => handleGrade('again', false)}>
        Again
      </Button>
      <Button variant="outline" className="flex-1" onClick={() => handleGrade('hard', true)}>
        Hard
      </Button>
      <Button variant="outline" className="flex-1" onClick={() => handleGrade('good', true)}>
        Good
      </Button>
      <Button variant="outline" className="flex-1" onClick={() => handleGrade('easy', true)}>
        Easy
      </Button>
    </div>
  );
}
