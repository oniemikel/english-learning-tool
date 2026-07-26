// src/components/dashboard/study-goals.tsx
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { DASHBOARD_DATA } from '@/lib/mock-data';
import { Icons } from '@/components/icons';

const Goal = ({
  title,
  current,
  goal,
  color,
}: {
  title: string;
  current: number;
  goal: number;
  color: string;
}) => {
  const progress = goal > 0 ? (current / goal) * 100 : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm text-gray-500">
        <p>{title}</p>
        <p className="font-medium text-gray-800">
          {current}/{goal}
        </p>
      </div>
      <Progress value={progress} style={{ backgroundColor: color }} />
    </div>
  );
};

const StudyGoals = () => {
  const { studyGoals } = DASHBOARD_DATA;
  const onTrackCount = [
    studyGoals.dailyWords,
    studyGoals.weeklyStreak,
    studyGoals.deckMastery,
  ].filter(g => g.current >= g.goal).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Study Goals</CardTitle>
          <Icons.MoreHorizontal className="h-5 w-5 text-gray-500" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Goal
          title="Daily words"
          current={studyGoals.dailyWords.current}
          goal={studyGoals.dailyWords.goal}
          color="#5b5bd6"
        />
        <Goal
          title="Weekly streak"
          current={studyGoals.weeklyStreak.current}
          goal={studyGoals.weeklyStreak.goal}
          color="#16a34a"
        />
        <Goal
          title="Deck mastery"
          current={studyGoals.deckMastery.current}
          goal={studyGoals.deckMastery.goal}
          color="#d97706"
        />
      </CardContent>
      <CardFooter className="border-t pt-4">
        <div className="flex items-center text-sm font-medium">
          <Icons.Star className="mr-2 h-4 w-4 text-yellow-500" />
          <p>
            <span className="font-semibold text-gray-800">{onTrackCount} of 3</span>
            <span className="text-gray-500"> goals on track</span>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default StudyGoals;
