"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type WeakWordItem = {
  id: string;
  word: string;
  meaning: string;
  accuracy: number;
  deckName?: string;
  nextReview: string | null;
};

type WeakWordsCardProps = {
  words: WeakWordItem[];
  className?: string;
};

function getAccuracyBadgeClass(accuracy: number) {
  if (accuracy < 60) {
    // 赤：マイルドな赤 + 白文字
    return "bg-red-700 text-white border-transparent font-semibold";
  }
  if (accuracy < 80) {
    // 黄：マイルドなアンバー + 白文字
    return "bg-amber-700 text-white border-transparent font-semibold";
  }

  // 緑：マイルドなエメラルド + 白文字
  return "bg-emerald-700 text-white border-transparent font-semibold";
}

export default function WeakWordsCard({
  words,
  className,
}: WeakWordsCardProps) {
  // 表示数を最大5件に制限して縦伸びを防止
  const displayWords = words.slice(0, 5);

  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base font-semibold">Needs Review</CardTitle>
        <Link
          href="/words"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "h-8 text-xs text-muted-foreground",
          )}
        >
          View All
        </Link>
      </CardHeader>
      <CardContent className="space-y-2">
        {displayWords.length === 0 ? (
          <div className="rounded-lg border border-dashed py-8 text-center">
            <p className="text-sm font-medium">All caught up!</p>
            <p className="mt-1 text-xs text-muted-foreground">
              No words need urgent review.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {displayWords.map((word) => (
              <li
                key={word.id}
                className="flex items-center justify-between gap-3 rounded-lg border px-3 py-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Badge
                    variant="outline"
                    className={cn(
                      "shrink-0 text-[11px] px-1.5 py-0.5 w-12 justify-center font-mono tabular-nums",
                      getAccuracyBadgeClass(word.accuracy),
                    )}
                  >
                    {word.accuracy}%
                  </Badge>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium leading-none">
                      {word.word}
                    </p>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {word.meaning}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/words/${word.id}`}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "h-7 px-2.5 text-xs shrink-0",
                  )}
                >
                  View
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
