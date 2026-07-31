import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ReviewsWidgetProps = {
  dueToday: number;
  dueSoon: number;
  overdue: number;
  className?: string;
};

export default function ReviewsWidget({
  dueToday,
  dueSoon,
  overdue,
  className,
}: ReviewsWidgetProps) {
  return (
    <Card className={cn("flex flex-col h-full", className)}>
      {/* 1. ヘッダー：上部に固定 */}
      <CardHeader>
        <CardTitle>Study</CardTitle>
        <CardDescription>
          You have cards ready for review. Start a session to continue learning.
        </CardDescription>
      </CardHeader>

      {/* 2. コンテンツ：flex-1 でカードの余った縦スペースをすべて占有 */}
      <CardContent className="flex flex-1 flex-col justify-center">
        <div className="grid w-full grid-cols-3 gap-3">
          {/* Overdue */}
          <div className="flex flex-col items-center justify-center h-full rounded-lg border bg-card p-5 text-center">
            <p className="whitespace-nowrap text-xs font-medium text-muted-foreground sm:text-sm">
              Overdue
            </p>
            <p className="mt-1 text-2xl font-bold sm:text-3xl">{overdue}</p>
          </div>

          {/* Due Today */}
          <div className="flex flex-col items-center justify-center h-full rounded-lg border bg-card p-5 text-center">
            <p className="whitespace-nowrap text-xs font-medium text-muted-foreground sm:text-sm">
              Due Today
            </p>
            <p className="mt-1 text-2xl font-bold sm:text-3xl">{dueToday}</p>
          </div>

          {/* Due Soon */}
          <div className="flex flex-col items-center justify-center h-full rounded-lg border bg-card p-5 text-center">
            <p className="whitespace-nowrap text-xs font-medium text-muted-foreground sm:text-sm">
              Due Soon
            </p>
            <p className="mt-1 text-2xl font-bold sm:text-3xl">{dueSoon}</p>
          </div>
        </div>
      </CardContent>

      {/* 3. フッター：下部に固定 */}
      <CardFooter className="pt-0">
        <Link href="/study/quick-start" className="w-full">
          <Button className="w-full" size="lg">
            Start Studying
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
