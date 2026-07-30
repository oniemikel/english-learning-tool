'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageTitle } from '@/components/ui/page-title';
import { useStudyStore } from '@/stores/study-store';

export default function StudyListeningPage() {
  const deckId = useStudyStore((state) => state.deckId);

  return (
    <section>
      <PageTitle title="Listening Practice" />
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle className="text-center">Feature Not Implemented</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            This study mode is currently under development. Please check back later!
          </p>
        </CardContent>
      </Card>
      <div className="mt-6 flex flex-wrap justify-end gap-2">
        <Link href={deckId ? `/decks/${deckId}` : '/decks'}>
          <Button variant="outline">Back to Deck</Button>
        </Link>
        <Link href="/dashboard">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    </section>
  );
}
