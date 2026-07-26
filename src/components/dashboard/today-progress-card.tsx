// src/components/dashboard/today-progress-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { DASHBOARD_DATA } from '@/lib/mock-data';
import CircularProgress from './circular-progress';

const MiniStat = ({ value, label }: { value: string | number; label: string }) => (
  <div className="flex flex-col items-center justify-center space-y-1 rounded-lg bg-gray-100/50 p-3">
    <p className="text-lg font-bold">{value}</p>
    <p className="text-xs text-gray-500">{label}</p>
  </div>
);


const TodayProgressCard = () => {
    const { todayProgress } = DASHBOARD_DATA;
    const progress = (todayProgress.wordsLearned / todayProgress.totalWords) * 100;

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg font-semibold">Today's Progress</CardTitle>
                        <p className="text-sm text-gray-500">Daily learning activity</p>
                    </div>
                    <p className="text-sm font-mono text-gray-500">Sunday</p>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                    <CircularProgress value={Math.round(progress)} color="#5b5bd6" />
                    <div className="flex-1 space-y-4">
                        <div>
                            <div className="mb-1 flex justify-between text-sm">
                                <p className="text-gray-500">Words learned</p>
                                <p className="font-mono font-medium text-gray-800">{todayProgress.wordsLearned} / {todayProgress.totalWords}</p>
                            </div>
                            <Progress value={progress} />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <MiniStat value={todayProgress.reviewed} label="Reviewed" />
                            <MiniStat value={`${todayProgress.correct}%`} label="Correct" />
                            <MiniStat value={todayProgress.new} label="New" />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default TodayProgressCard;
