// src/components/dashboard/deck-card.tsx
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Icons } from '@/components/icons';

interface DeckCardProps {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  tag: string;
  mastered: number;
  total: number;
  due: number;
}

const DeckCard = ({
  id,
  emoji,
  title,
  subtitle,
  tag,
  mastered,
  total,
  due,
}: DeckCardProps) => {
  const progress = total > 0 ? (mastered / total) * 100 : 0;
  const isMastered = mastered === total;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <span className="text-3xl">{emoji}</span>
            <div>
              <CardTitle className="text-base font-semibold">{title}</CardTitle>
              <p className="text-sm text-gray-500">{subtitle}</p>
            </div>
          </div>
          <Badge variant="secondary">{tag}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-2">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <p>{mastered}/{total} mastered</p>
          <p className="font-semibold text-gray-800">{Math.round(progress)}%</p>
        </div>
        <Progress value={progress} className={isMastered ? '[&>div]:bg-green-500' : ''} />
      </CardContent>
      <CardFooter>
        {due > 0 ? (
          <p className="text-sm font-semibold text-amber-600">{due} cards due</p>
        ) : (
          <div className="flex items-center gap-2 text-sm font-medium text-green-600">
            <Icons.Check className="h-4 w-4" />
            <span>All caught up!</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default DeckCard;
