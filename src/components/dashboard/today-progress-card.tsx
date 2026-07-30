// src/components/dashboard/today-progress-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import CircularProgress from './circular-progress';

interface TodayProgressCardProps {
  newWords: number;
  reviews: number;
  target: number;
}

const MiniStat = ({ value, label }: { value: string | number; label: string }) => (
  <div className="flex flex-col items-center justify-center space-y-1 rounded-lg bg-muted/50 p-3">
    <p className="text-lg font-bold">{value}</p>
    <p className="text-xs text-muted-foreground">{label}</p>
  </div>
);

const TodayProgressCard = ({
  newWords,
  reviews,
  target,
}: TodayProgressCardProps) => {
  const progress = target > 0 ? (reviews / target) * 100 : 0;
  const today = new Date();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">
              Today's Progress
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Daily learning activity
            </p>
          </div>
          <p className="text-sm font-mono text-muted-foreground">
            {today.toLocaleDateString("en-US", { weekday: "long" })}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center gap-6 w-full">
          {/* 円チャート（上に配置） */}
          <CircularProgress value={Math.round(progress)} color="#5b5bd6" size={200} />

          {/* テキスト・プログレスバー・ミニステータス群 */}
          <div className="w-full space-y-4">
            <div>
              <div className="mb-1 flex justify-center gap-4 text-sm">
                <p className="text-muted-foreground">Reviews</p>
                <p className="font-mono font-medium text-foreground">
                  {reviews} / {target}
                </p>
              </div>
              <Progress value={progress} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <MiniStat value={reviews} label="Reviewed" />
              <MiniStat value={newWords} label="New" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodayProgressCard;
