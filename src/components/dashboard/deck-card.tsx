// src/components/dashboard/deck-card.tsx
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Icons } from '@/components/icons';

interface DeckCardProps {
  id: string;
  title: string;
  wordCount: number;
}

const DeckCard = ({ id, title, wordCount }: DeckCardProps) => {
  return (
    <Link href={`/decks/${id}`} className="block hover:bg-gray-50">
      <Card className="flex h-full flex-col">
        <CardHeader>
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="flex items-center text-sm text-gray-500">
            <Icons.Words className="mr-2 h-4 w-4" />
            {wordCount} words
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default DeckCard;
