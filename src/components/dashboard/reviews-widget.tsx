// src/components/dashboard/reviews-widget.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

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
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Study</CardTitle>
        <CardDescription>
          You have cards ready for review. Start a session to continue learning.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex items-center justify-between rounded-lg border bg-card p-4 md:flex-col md:items-start md:justify-start">
          <p className="text-sm font-medium text-muted-foreground">Overdue</p>
          <p className="text-3xl font-bold">{overdue}</p>
        </div>
        <div className="flex items-center justify-between rounded-lg border bg-card p-4 md:flex-col md:items-start md:justify-start">
          <p className="text-sm font-medium text-muted-foreground">Due Today</p>
          <p className="text-3xl font-bold">{dueToday}</p>
        </div>
        <div className="flex items-center justify-between rounded-lg border bg-card p-4 md:flex-col md:items-start md:justify-start">
          <p className="text-sm font-medium text-muted-foreground">Due Soon</p>
          <p className="text-3xl font-bold">{dueSoon}</p>
        </div>
      </CardContent>
      <div className="p-5 pt-0">
        <Link href="/study" className="w-full">
          <Button className="w-full" size="lg">
            Start Studying
          </Button>
        </Link>
      </div>
    </Card>
  );
}
