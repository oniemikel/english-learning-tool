// src/components/dashboard/weekly-activity.tsx
'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { DASHBOARD_DATA } from '@/lib/mock-data';
import { Icons } from '../icons';

const WeeklyActivity = () => {
  const { weeklyActivity } = DASHBOARD_DATA;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Weekly Activity</CardTitle>
            <CardDescription>Words learned per day</CardDescription>
          </div>
          <ToggleGroup type="single" defaultValue="words" size="sm">
            <ToggleGroupItem value="words" aria-label="Toggle words">
              Words
            </ToggleGroupItem>
            <ToggleGroupItem value="minutes" aria-label="Toggle minutes">
              Minutes
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end gap-2">
            <p className="text-3xl font-bold">{weeklyActivity.totalWords}</p>
            <p className="text-gray-500">words this week</p>
        </div>
        <div className="flex items-center text-sm text-green-600">
            <Icons.Progress className="h-4 w-4 mr-1"/>
            <span>{weeklyActivity.change} vs last week</span>
        </div>
        <div className="h-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyActivity.data}>
              <XAxis
                dataKey="day"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e5e5',
                  borderRadius: '0.5rem',
                }}
              />
              <Bar dataKey="words" fill="#5b5bd6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyActivity;
