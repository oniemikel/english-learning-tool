'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageTitle } from '@/components/ui/page-title';
import { getWordById, deleteWord } from '@/lib/data/words';
import { AnimatedContainer } from '@/components/animated-container';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function WordDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (mode === 'edit') {
      router.replace(`/words/${id}/edit`);
    }
  }, [id, mode, router]);

  const wordQuery = useQuery({
    queryKey: ['word', id],
    queryFn: () => getWordById(id),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteWord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['words'] });
      router.push('/words');
    },
  });

  const handleDeleteConfirm = () => {
    deleteMutation.mutate(id);
  };

  if (wordQuery.isLoading || !wordQuery.data) {
    return (
      <div className="rounded-(--radius-card) border bg-(--card) p-6">
        読み込み中またはデータが見つかりません。
      </div>
    );
  }

  return (
    <section>
      <PageTitle
        title={wordQuery.data.word}
        description={wordQuery.data.translation}
        actions={
          <>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="text-destructive hover:text-destructive"
            >
              削除
            </Button>
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
                <span className="text-(--muted-foreground)">品詞:</span>{' '}
                {wordQuery.data.partOfSpeech}
              </p>
              <p>
                <span className="text-(--muted-foreground)">発音:</span>{' '}
                {wordQuery.data.pronunciation}
              </p>
              <p>
                <span className="text-(--muted-foreground)">次回復習:</span>{' '}
                {wordQuery.data.nextReview}
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
              <p className="rounded-(--radius-control) bg-(--muted) p-3">
                {wordQuery.data.example || '例文は未登録です。'}
              </p>
              <p className="text-xs text-(--muted-foreground)">
                語源: {wordQuery.data.etymology || '未登録'}
              </p>
            </CardContent>
          </Card>
        </AnimatedContainer>
      </div>
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              word "{wordQuery.data.word}" and its associated study progress.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
