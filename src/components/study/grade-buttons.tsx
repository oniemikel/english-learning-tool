'use client';

import { Button } from '@/components/ui/button';

type Grade = 'AGAIN' | 'HARD' | 'GOOD' | 'EASY';

const grades: { label: string; value: Grade; color: string }[] = [
  { label: 'Again', value: 'AGAIN', color: 'bg-red-500 hover:bg-red-600' },
  { label: 'Hard', value: 'HARD', color: 'bg-orange-500 hover:bg-orange-600' },
  { label: 'Good', value: 'GOOD', color: 'bg-green-500 hover:bg-green-600' },
  { label: 'Easy', value: 'EASY', color: 'bg-blue-500 hover:bg-blue-600' },
];

type GradeButtonsProps = {
  onGrade: (grade: Grade) => void;
  isSubmitting?: boolean;
};

export function GradeButtons({ onGrade, isSubmitting }: GradeButtonsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {grades.map(({ label, value, color }) => (
        <Button
          key={value}
          onClick={() => onGrade(value)}
          disabled={isSubmitting}
          className={`${color} text-white font-bold py-3 text-base`}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
