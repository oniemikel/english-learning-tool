'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStudyStore } from '@/stores/study-store';

type StudySessionProps = {
  title: string;
  promptLabel: string;
  promptValue: string;
  answerValue: string;
  withInput?: boolean;
};

export function StudySession({ title, promptLabel, promptValue, answerValue, withInput = false }: StudySessionProps) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [input, setInput] = useState('');
  const store = useStudyStore();
  const progressRate = Math.min(100, Math.round((store.solved / 20) * 100));

  return (
    <section className="mx-auto max-w-3xl">
      <div className="mb-5">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--muted)]">
          <div className="h-full bg-[var(--primary)] transition-all" style={{ width: `${progressRate}%` }} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{promptLabel}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-3xl font-semibold tracking-tight">{promptValue}</p>

          {withInput ? (
            <input
              className="h-11 w-full rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--card)] px-3"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="英語で回答"
            />
          ) : null}

          {showAnswer ? (
            <div className="rounded-[var(--radius-control)] bg-[var(--accent)] p-4 text-[var(--accent-foreground)]">
              正解: {answerValue}
            </div>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-2">
            <Button variant="outline" onClick={() => setShowAnswer((prev) => !prev)}>
              {showAnswer ? '答えを隠す' : '答えを見る'}
            </Button>

            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={() => store.answer(false)}>
                Again
              </Button>
              <Button variant="secondary" onClick={() => store.answer(false)}>
                Hard
              </Button>
              <Button onClick={() => store.answer(true)}>Good</Button>
              <Button onClick={() => store.answer(true)}>Easy</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 flex justify-end">
        <Link href="/study/result">
          <Button variant="outline">学習を終了</Button>
        </Link>
      </div>
    </section>
  );
}
