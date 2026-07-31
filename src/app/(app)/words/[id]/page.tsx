'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageTitle } from '@/components/ui/page-title';
import { getWordById } from '@/lib/data/words';
import { AnimatedContainer } from '@/components/animated-container';

export default function WordDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');

  useEffect(() => {
    if (mode === 'edit') {
      router.replace(`/words/${id}/edit`);
    }
  }, [id, mode, router]);

  const wordQuery = useQuery({ queryKey: ['word', id], queryFn: () => getWordById(id) });

  if (wordQuery.isLoading || !wordQuery.data) {
    return <div className="rounded-(--radius-card) border bg-(--card) p-6">読み込み中またはデータが見つかりません。</div>;
  }

  return (
    <section>
      <PageTitle
        title={wordQuery.data.word}
        description={wordQuery.data.translation}
        actions={
          <>
            <Link href={`/words/${id}/edit`}>
              <Button variant="outline">編集</Button>
            </Link>
            <Link href={`/study?wordId=${id}`}>
              <Button>この単語を学習</Button>
            </Link>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <AnimatedContainer>
          <Card>
            <CardHeader>
              <CardTitle>基本情報</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <p className="mb-1 text-(--muted-foreground)">デッキ:</p>
                <div className="flex flex-wrap gap-1.5">
                  {wordQuery.data.decks.map((deck) => (
                    <Link key={deck.id} href={`/decks/${deck.id}`}>
                      <Badge variant="outline">{deck.name}</Badge>
                    </Link>
                  ))}
                </div>
              </div>
              <p>
                <span className="text-(--muted-foreground)">品詞:</span> {wordQuery.data.partOfSpeech}
              </p>
              <p>
                <span className="text-(--muted-foreground)">発音:</span> {wordQuery.data.pronunciation}
              </p>
              <p>
                <span className="text-(--muted-foreground)">次回復習:</span> {wordQuery.data.nextReview}
              </p>
              <Badge>{wordQuery.data.state}</Badge>
            </CardContent>
          </Card>
        </AnimatedContainer>

        <AnimatedContainer delay={0.05}>
          <Card>
            <CardHeader>
              <CardTitle>意味・用法</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>{wordQuery.data.definition || '英英定義は未登録です。'}</p>
              <p className="rounded-(--radius-control) bg-(--muted) p-3">{wordQuery.data.example || '例文は未登録です。'}</p>
              <p className="text-xs text-(--muted-foreground)">語源: {wordQuery.data.etymology || '未登録'}</p>
            </CardContent>
          </Card>
        </AnimatedContainer>
      </div>
    </section>
  );
}
