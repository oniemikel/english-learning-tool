'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageTitle } from '@/components/ui/page-title';

export default function StudyPronunciationPage() {
  return (
    <section>
      <PageTitle title="Pronunciation Practice" />
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
    </section>
  );
}
