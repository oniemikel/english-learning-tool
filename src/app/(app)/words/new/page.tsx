'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PageTitle } from '@/components/ui/page-title';
import { Select } from '@/components/ui/select';
import { createWord } from '@/lib/data/words';
import { listDecks } from '@/lib/data/decks';

const schema = z.object({
  word: z.string().trim().min(1, '英単語は必須です').max(100),
  translation: z.string().trim().min(1, '日本語訳は必須です').max(500),
  partOfSpeech: z.string().min(1),
  deckId: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

export default function WordCreatePage() {
  const router = useRouter();
  const params = useSearchParams();
  const decksQuery = useQuery({ queryKey: ['decks'], queryFn: () => listDecks({}) });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      word: '',
      translation: '',
      partOfSpeech: 'OTHER',
      deckId: '',
    },
  });

  useEffect(() => {
    if (decksQuery.data) {
      form.reset({
        word: '',
        translation: '',
        partOfSpeech: 'OTHER',
        deckId: params.get('deckId') || decksQuery.data?.[0]?.id || '',
      });
    }
  }, [decksQuery.data, form, params]);


  const mutation = useMutation({
    mutationFn: createWord,
    onSuccess: (word) => router.push(`/words/${word.id}`),
  });

  if (decksQuery.isLoading) {
    return (
      <section>
        <PageTitle title="単語作成" description="必要最低限の入力で素早く単語を追加します。" />
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>単語情報</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-96 w-full" />
          </CardContent>
        </Card>
      </section>
    );
  }

  if (!decksQuery.data || decksQuery.data.length === 0) {
    return (
      <section>
        <PageTitle title="単語作成" description="必要最低限の入力で素早く単語を追加します。" />
        <div className="text-center">
          <p>You need to create a deck first.</p>
          <Link href="/decks/new">
            <Button className="mt-4">Create Deck</Button>
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section>
      <PageTitle title="単語作成" description="必要最低限の入力で素早く単語を追加します。" />
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>単語情報</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
            <label className="block space-y-1">
              <span className="text-sm">英単語</span>
              <Input {...form.register('word')} />
              <p className="text-xs text-[var(--destructive)]">{form.formState.errors.word?.message}</p>
            </label>

            <label className="block space-y-1">
              <span className="text-sm">日本語訳</span>
              <Input {...form.register('translation')} />
              <p className="text-xs text-[var(--destructive)]">{form.formState.errors.translation?.message}</p>
            </label>

            <label className="block space-y-1">
              <span className="text-sm">品詞</span>
              <Select {...form.register('partOfSpeech')}>
                <option value="NOUN">NOUN</option>
                <option value="VERB">VERB</option>
                <option value="ADJECTIVE">ADJECTIVE</option>
                <option value="ADVERB">ADVERB</option>
                <option value="OTHER">OTHER</option>
              </Select>
            </label>

            <label className="block space-y-1">
              <span className="text-sm">デッキ</span>
              <Select {...form.register('deckId')}>
                {decksQuery.data?.map((deck) => (
                  <option key={deck.id} value={deck.id}>
                    {deck.name}
                  </option>
                ))}
              </Select>
            </label>

            <div className="flex justify-end gap-2">
              <Link href="/words">
                <Button type="button" variant="outline">
                  キャンセル
                </Button>
              </Link>
              <Button type="submit">作成</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
