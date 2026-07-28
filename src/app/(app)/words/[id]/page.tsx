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
import { getWordById, updateWord } from '@/lib/data/words';

const editSchema = z.object({
  word: z.string().trim().min(1).max(100),
  translation: z.string().trim().min(1).max(500),
  definition: z.string().max(2000),
  example: z.string().max(2000),
});

type EditValues = z.infer<typeof editSchema>;

export default function WordDetailPage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');
  const router = useRouter();
  const wordQuery = useQuery({ queryKey: ['word', id], queryFn: () => getWordById(id) });

  const form = useForm<EditValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      word: wordQuery.data?.word ?? '',
      translation: wordQuery.data?.translation ?? '',
      definition: wordQuery.data?.definition ?? '',
      example: wordQuery.data?.example ?? '',
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (values: EditValues) => updateWord({ id, ...values }),
    onSuccess: () => router.push(`/words/${id}`),
  });

  if (wordQuery.isLoading || !wordQuery.data) {
    return <div className="rounded-[var(--radius-card)] border bg-[var(--card)] p-6">読み込み中またはデータが見つかりません。</div>;
  }

  if (mode === 'edit') {
    return (
      <section>
        <PageTitle title="単語編集" description="例文や定義を更新します。" />
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>{wordQuery.data.word}</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit((values) => {
                saveMutation.mutate(values);
              })}
            >
              <label className="block space-y-1">
                <span className="text-sm">英単語</span>
                <Input {...form.register('word')} />
              </label>
              <label className="block space-y-1">
                <span className="text-sm">日本語訳</span>
                <Input {...form.register('translation')} />
              </label>
              <label className="block space-y-1">
                <span className="text-sm">英英定義</span>
                <Textarea rows={4} {...form.register('definition')} />
              </label>
              <label className="block space-y-1">
                <span className="text-sm">例文</span>
                <Textarea rows={4} {...form.register('example')} />
              </label>

              <div className="flex justify-end gap-2">
                <Link href={`/words/${id}`}>
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
        title={wordQuery.data.word}
        description={wordQuery.data.translation}
        actions={
          <>
            <Link href={`/words/${id}?mode=edit`}>
              <Button variant="outline">編集</Button>
            </Link>
            <Link href={`/study?wordId=${id}`}>
              <Button>この単語を学習</Button>
            </Link>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>基本情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="text-[var(--muted-foreground)]">品詞:</span> {wordQuery.data.partOfSpeech}
            </p>
            <p>
              <span className="text-[var(--muted-foreground)]">発音:</span> {wordQuery.data.pronunciation}
            </p>
            <p>
              <span className="text-[var(--muted-foreground)]">次回復習:</span> {wordQuery.data.nextReview}
            </p>
            <Badge>{wordQuery.data.state}</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>意味・用法</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>{wordQuery.data.definition || '英英定義は未登録です。'}</p>
            <p className="rounded-[var(--radius-control)] bg-[var(--muted)] p-3">{wordQuery.data.example || '例文は未登録です。'}</p>
            <p className="text-xs text-[var(--muted-foreground)]">語源: {wordQuery.data.etymology || '未登録'}</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
