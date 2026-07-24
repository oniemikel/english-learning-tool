'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PageTitle } from '@/components/ui/page-title';
import { Textarea } from '@/components/ui/textarea';
import { createDeck } from '@/lib/mock-api';

const formSchema = z.object({
  name: z.string().trim().min(1, 'デッキ名は必須です').max(100),
  description: z.string().max(1000),
  isPublic: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export default function DeckCreatePage() {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', description: '', isPublic: false },
  });

  const mutation = useMutation({
    mutationFn: createDeck,
    onSuccess: (deck) => {
      router.push(`/decks/${deck.id}`);
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    mutation.mutate(values);
  });

  return (
    <section>
      <PageTitle title="デッキ作成" description="最初の単語登録につながるシンプルな作成フォーム。" />
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>デッキ情報</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <label className="block space-y-1">
              <span className="text-sm">デッキ名</span>
              <Input {...form.register('name')} placeholder="例: TOEIC 600" />
              <p className="text-xs text-[var(--destructive)]">{form.formState.errors.name?.message}</p>
            </label>

            <label className="block space-y-1">
              <span className="text-sm">説明</span>
              <Textarea {...form.register('description')} rows={5} placeholder="このデッキで学ぶ内容" />
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...form.register('isPublic')} className="h-4 w-4" />
              公開デッキとして共有する
            </label>

            <div className="flex justify-end gap-2">
              <Link href="/decks">
                <Button type="button" variant="outline">
                  キャンセル
                </Button>
              </Link>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? '作成中...' : '作成'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
