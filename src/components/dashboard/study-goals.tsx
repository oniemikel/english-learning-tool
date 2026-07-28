// src/components/dashboard/study-goals.tsx
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface StudyGoalsProps {
  goals: {
    day: string;
    progress: number;
  }[];
}

const StudyGoals = ({ goals }: StudyGoalsProps) => {
  const maxProgress = Math.max(...goals.map(g => g.progress), 1);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Weekly Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.map((goal, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between text-sm text-gray-500">
              <p>{goal.day}</p>
              <p className="font-medium text-gray-800">{goal.progress}</p>
            </div>
            <Progress value={(goal.progress / maxProgress) * 100} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default StudyGoals;
