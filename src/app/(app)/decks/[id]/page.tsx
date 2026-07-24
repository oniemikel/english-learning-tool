'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PageTitle } from '@/components/ui/page-title';
import { Textarea } from '@/components/ui/textarea';
import { getDeckById, listWords } from '@/lib/mock-api';

const editSchema = z.object({
  name: z.string().trim().min(1).max(100),
  description: z.string().max(1000),
  isPublic: z.boolean(),
});

type EditValues = z.infer<typeof editSchema>;

export default function DeckDetailPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');
  const router = useRouter();
  const id = params.id;
  const deckQuery = useQuery({ queryKey: ['deck', id], queryFn: () => getDeckById(id) });
  const wordsQuery = useQuery({ queryKey: ['words'], queryFn: () => listWords() });

  const form = useForm<EditValues>({
    resolver: zodResolver(editSchema),
    values: {
      name: deckQuery.data?.name ?? '',
      description: deckQuery.data?.description ?? '',
      isPublic: deckQuery.data?.isPublic ?? false,
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (values: EditValues) => values,
    onSuccess: () => router.push(`/decks/${id}`),
  });

  if (deckQuery.isLoading || !deckQuery.data) {
    return <div className="rounded-[var(--radius-card)] border bg-[var(--card)] p-6">読み込み中またはデータが見つかりません。</div>;
  }

  if (mode === 'edit') {
    return (
      <section>
        <PageTitle title="デッキ編集" description="公開設定や説明文を更新します。" />
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>{deckQuery.data.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit((values) => {
                saveMutation.mutate(values);
              })}
            >
              <label className="block space-y-1">
                <span className="text-sm">デッキ名</span>
                <Input {...form.register('name')} />
              </label>
              <label className="block space-y-1">
                <span className="text-sm">説明</span>
                <Textarea {...form.register('description')} rows={5} />
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" {...form.register('isPublic')} className="h-4 w-4" />
                公開する
              </label>
              <div className="flex justify-end gap-2">
                <Link href={`/decks/${id}`}>
                  <Button type="button" variant="outline">
                    キャンセル
                  </Button>
                </Link>
                <Button type="submit">保存</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section>
      <PageTitle
        title={deckQuery.data.name}
        description={deckQuery.data.description}
        actions={
          <>
            <Link href={`/decks/${id}?mode=edit`}>
              <Button variant="outline">編集</Button>
            </Link>
            <Link href={`/csv-import?deckId=${id}`}>
              <Button variant="secondary">CSVインポート</Button>
            </Link>
            <Link href={`/study?deckId=${id}`}>
              <Button>このデッキを学習</Button>
            </Link>
          </>
        }
      />

      <div className="mb-5 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-5 text-center">
            <p className="text-xs text-[var(--muted-foreground)]">単語数</p>
            <p className="mt-2 text-2xl font-semibold">{deckQuery.data.wordCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 text-center">
            <p className="text-xs text-[var(--muted-foreground)]">Due</p>
            <p className="mt-2 text-2xl font-semibold">{deckQuery.data.dueCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 text-center">
            <p className="text-xs text-[var(--muted-foreground)]">公開状態</p>
            <p className="mt-2 text-2xl font-semibold">{deckQuery.data.isPublic ? '公開' : '非公開'}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>単語プレビュー</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {wordsQuery.data
            ?.filter((word) => word.deckId === id)
            .slice(0, 6)
            .map((word) => (
              <Link
                key={word.id}
                href={`/words/${word.id}`}
                className="flex items-center justify-between rounded-[var(--radius-control)] border border-[var(--border)] px-3 py-2 hover:bg-[var(--muted)]"
              >
                <div>
                  <p className="font-medium">{word.word}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">{word.translation}</p>
                </div>
                <Badge>{word.partOfSpeech}</Badge>
              </Link>
            ))}
        </CardContent>
      </Card>
    </section>
  );
}
