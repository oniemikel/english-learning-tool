// src/components/dashboard/recent-history.tsx
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn, formatDate } from '@/lib/utils';
import { ReviewRating } from '@prisma/client';

type RecentHistoryProps = {
  history: {
    word: string;
    rating: ReviewRating;
    reviewedAt: Date;
  }[];
  className?: string;
};

export default function RecentHistory({
  history,
  className,
}: RecentHistoryProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Recent History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {history.length > 0 ? (
          history.map((item, index) => (
            <div key={index} className="rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <p className="font-medium">{item.word}</p>
                <Badge variant="secondary">{item.rating}</Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatDate(item.reviewedAt)}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-sm text-muted-foreground">No history yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
