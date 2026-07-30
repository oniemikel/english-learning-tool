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
          <CardTitle className="text-lg font-semibold">
            Weekly Activity
          </CardTitle>
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
                // ホバー時の背景ハイライト（テーマに追従させる）
                cursor={{ fill: "hsl(var(--muted) / 0.5)" }}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  color: "hsl(var(--foreground))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
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
