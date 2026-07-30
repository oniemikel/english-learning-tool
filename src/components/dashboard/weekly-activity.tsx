// src/components/dashboard/weekly-activity.tsx
'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

interface WeeklyActivityProps {
  labels: string[];
  series: number[][];
}

const WeeklyActivity = ({ labels, series }: WeeklyActivityProps) => {
  const data = labels.map((label, i) => ({
    name: label,
    reviews: series[0][i],
  }));

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle className="text-lg font-semibold">Weekly Activity</CardTitle>
          <CardDescription>Reviews per day</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis
                dataKey="name"
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
              <Bar dataKey="reviews" fill="#5b5bd6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyActivity;
