'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { signOut } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageTitle } from '@/components/ui/page-title';
import { Select } from '@/components/ui/select';

const settingsSchema = z.object({
  newLimit: z.number().min(0).max(200),
  reviewLimit: z.number().min(0).max(500),
  order: z.enum(['DUE_ASC', 'RANDOM', 'CREATED_DESC']),
  theme: z.enum(['light', 'dark', 'system']),
});

type SettingsValues = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const form = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      newLimit: 20,
      reviewLimit: 100,
      order: 'DUE_ASC',
      theme: 'system',
    },
  });

  return (
    <section>
      <PageTitle title="設定" description="学習上限と表示設定を管理します。" />

      <form
        className="space-y-5"
        onSubmit={form.handleSubmit((values) => {
          console.log(values);
        })}
      >
        <Card>
          <CardHeader>
            <CardTitle>学習設定</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1">
              <span className="text-sm">新規上限</span>
              <input type="number" className="h-10 w-full rounded-[var(--radius-control)] border px-3" {...form.register('newLimit', { valueAsNumber: true })} />
            </label>
            <label className="space-y-1">
              <span className="text-sm">レビュー上限</span>
              <input
                type="number"
                className="h-10 w-full rounded-[var(--radius-control)] border px-3"
                {...form.register('reviewLimit', { valueAsNumber: true })}
              />
            </label>
            <label className="space-y-1 sm:col-span-2">
              <span className="text-sm">学習順序</span>
              <Select {...form.register('order')}>
                <option value="DUE_ASC">DUE_ASC</option>
                <option value="RANDOM">RANDOM</option>
                <option value="CREATED_DESC">CREATED_DESC</option>
              </Select>
            </label>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>表示設定</CardTitle>
          </CardHeader>
          <CardContent>
            <label className="block space-y-1">
              <span className="text-sm">テーマ</span>
              <Select {...form.register('theme')}>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </Select>
            </label>
          </CardContent>
        </Card>

        <div className="flex flex-wrap justify-end gap-2">
          <Button type="submit">保存 (Mock)</Button>
          <Button type="button" variant="outline" onClick={() => signOut({ callbackUrl: '/' })}>
            サインアウト
          </Button>
        </div>
      </form>
    </section>
  );
}
