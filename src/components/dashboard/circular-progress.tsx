// src/components/dashboard/circular-progress.tsx
'use client';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface CircularProgressProps {
  value: number;
  color: string;
}

const CircularProgress = ({ value, color }: CircularProgressProps) => {
  const data = [
    { name: 'Progress', value: value },
    { name: 'Remaining', value: 100 - value },
  ];

  return (
    <div className="relative h-24 w-24">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            dataKey="value"
            innerRadius="70%"
            outerRadius="100%"
            startAngle={90}
            endAngle={450}
            stroke="none"
          >
            <Cell fill={color} />
            <Cell fill="#e8e8ee" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold">{value}%</span>
        <span className="text-xs text-gray-500">done</span>
      </div>
    </div>
  );
};

export default CircularProgress;
