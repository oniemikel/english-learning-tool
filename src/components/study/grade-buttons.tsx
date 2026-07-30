'use client';

import { Button } from '@/components/ui/button';
import { type StudyFsrsRating } from '@/lib/study-rating';

type GradeButtonsProps = {
  onGrade: (grade: StudyFsrsRating) => void;
  disabled?: boolean;
};

export function GradeButtons({ onGrade, disabled = false }: GradeButtonsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      <Button variant="outline" className="flex-1" onClick={() => onGrade('again')} disabled={disabled}>
        Again
      </Button>
      <Button variant="outline" className="flex-1" onClick={() => onGrade('hard')} disabled={disabled}>
        Hard
      </Button>
      <Button variant="outline" className="flex-1" onClick={() => onGrade('good')} disabled={disabled}>
        Good
      </Button>
      <Button variant="outline" className="flex-1" onClick={() => onGrade('easy')} disabled={disabled}>
        Easy
      </Button>
    </div>
  );
}
