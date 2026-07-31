'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageTitle } from '@/components/ui/page-title';
import { useStudyStore } from '@/stores/study-store';
import { AnimatedContainer } from '@/components/animated-container';

export default function StudyPronunciationPage() {
  const deckId = useStudyStore((state) => state.deckId);

  return (
    <section>
      <PageTitle title="Pronunciation Practice" />
      <AnimatedContainer delay={0.05}>
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
      </AnimatedContainer>
      <AnimatedContainer delay={0.1}>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link href={deckId ? `/decks/${deckId}` : '/decks'}>
            <Button variant="outline">Back to Deck</Button>
          </Link>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </AnimatedContainer>
    </section>
  );
}
