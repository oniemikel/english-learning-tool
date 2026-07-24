'use client';

import { LogIn } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export default function LoginPage() {
  const params = useSearchParams();
  const callbackUrl = params.get('callbackUrl') ?? '/dashboard';

  return (
    <main className="relative flex min-h-screen items-center justify-center p-6">
      <div className="absolute right-6 top-6">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-[460px]">
        <CardHeader>
          <CardTitle>英単語学習プラットフォーム</CardTitle>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            FSRSベースで最適な復習タイミングを提示し、英語運用力まで育てる学習環境。
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button className="w-full" onClick={() => signIn('google', { callbackUrl })}>
            <LogIn className="h-4 w-4" />
            Googleでログイン
          </Button>
          <Button className="w-full" variant="outline" onClick={() => (window.location.href = '/dashboard')}>
            デモデータで開始
          </Button>
          <p className="text-xs text-[var(--muted-foreground)]">
            認証設定が未完了の環境では「デモデータで開始」を利用してください。
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
