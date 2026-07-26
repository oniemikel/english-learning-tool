'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import type { Deck } from '@/lib/mock-data';
import { MoreVertical } from 'lucide-react';
import { Button } from '../ui/button';

type DeckCardProps = {
  deck: Deck;
  onDelete: (deckId: string) => void;
};

export function DeckCard({ deck, onDelete }: DeckCardProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between">
        <div>
          <CardTitle className="hover:underline">
            <Link href={`/decks/${deck.id}`}>{deck.name}</Link>
          </CardTitle>
          <CardDescription className="mt-1 line-clamp-2">{deck.description}</CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <Link href={`/decks/${deck.id}/edit`}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(deck.id)} className="text-red-500">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{deck.wordCount} words</span>
          <span>Updated {new Date(deck.updatedAt).toLocaleDateString()}</span>
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Progress</span>
            <span className="text-xs font-semibold">{Math.round(deck.progress * 100)}%</span>
          </div>
          <Progress value={deck.progress * 100} />
        </div>
      </CardFooter>
    </Card>
  );
}
