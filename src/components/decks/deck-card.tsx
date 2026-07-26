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
import type { Deck } from '@/lib/mock-data';
import { Book, Check, MoreVertical, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

type DeckCardProps = {
  deck: Deck;
  onDelete: (deck: Deck) => void;
};

export function DeckCard({ deck, onDelete }: DeckCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="hover:underline">
          <Link href={`/decks/${deck.id}`}>{deck.name}</Link>
        </CardTitle>
        <CardDescription className="mt-1 line-clamp-2 h-10">{deck.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Book className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold">{deck.wordCount}</span>
            <span className="text-muted-foreground">Words</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold">{deck.dueCount}</span>
            <span className="text-muted-foreground">Due</span>
          </div>
          <div className="flex items-center gap-2">
            <Plus className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold">{deck.newCount}</span>
            <span className="text-muted-foreground">New</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link href={`/study?deck=${deck.id}`} className="w-full">
          <Button className="w-full">Study</Button>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="ml-2 h-9 w-9 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/decks/${deck.id}/edit`}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(deck)} className="text-red-500 focus:text-red-500">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
}
