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
  <div className="flex flex-col items-center justify-center space-y-1 rounded-lg bg-gray-100/50 p-3">
    <p className="text-lg font-bold">{value}</p>
    <p className="text-xs text-gray-500">{label}</p>
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
            <p className="text-sm text-gray-500">Daily learning activity</p>
          </div>
          <p className="text-sm font-mono text-gray-500">
            {today.toLocaleDateString('en-US', { weekday: 'long' })}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-6">
          <CircularProgress value={Math.round(progress)} color="#5b5bd6" />
          <div className="flex-1 space-y-4">
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <p className="text-gray-500">Reviews</p>
                <p className="font-mono font-medium text-gray-800">
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
