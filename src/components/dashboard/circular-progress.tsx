"use client";

import { PieChart, Pie, ResponsiveContainer } from "recharts";

interface CircularProgressProps {
  value: number;
  color: string;
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

const BASE_DURATION_PER_LAP = 1500;
const EASE_POWER = 3.2;

const easeTime = (progress: number) =>
  1 - Math.pow(1 - clamp01(progress), 1 / EASE_POWER);

const CircularProgress = ({ value, color }: CircularProgressProps) => {
  const totalLaps = Math.max(1, Math.ceil(value / 100));
  const totalDuration = (value / 100) * BASE_DURATION_PER_LAP;

  const lapLayers = Array.from({ length: totalLaps }, (_, lapIndex) => {
    const lapStart = lapIndex * 100;

    const lapValue = Math.max(0, Math.min(100, value - lapStart));

    const startTime = easeTime(lapStart / value) * totalDuration;

    const endTime = easeTime((lapStart + lapValue) / value) * totalDuration;

    return {
      id: lapIndex,

      data: [
        {
          name: "Progress",
          value: lapValue,
          fill: color,
        },
        {
          name: "Remaining",
          value: 100 - lapValue,
          fill: lapIndex === 0 ? "hsl(var(--muted))" : "transparent",
        },
      ],

      animationBegin: startTime,
      animationDuration: endTime - startTime,

      style: {
        filter: `saturate(${Math.min(
          180,
          100 + lapIndex * 20,
        )}%) brightness(${Math.min(
          125,
          100 + lapIndex * 8,
        )}%) hue-rotate(${lapIndex * 10}deg)`,
      },
    };
  });

  return (
    <div className="relative h-24 w-24">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          {lapLayers.map((layer) => (
            <Pie
              key={layer.id}
              data={layer.data}
              cx="50%"
              cy="50%"
              dataKey="value"
              innerRadius="70%"
              outerRadius="100%"
              startAngle={450}
              endAngle={90}
              stroke="none"
              isAnimationActive
              animationBegin={layer.animationBegin}
              animationDuration={layer.animationDuration}
              animationEasing="linear"
              style={layer.style}
            />
          ))}
        </PieChart>
      </ResponsiveContainer>

      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-xl font-bold">{Math.round(value)}%</span>

        <span className="text-xs text-muted-foreground">
          {totalLaps > 1
            ? `${totalLaps}${["st", "nd", "rd"][totalLaps - 1] ?? "th"} lap`
            : "done"}
        </span>
      </div>
    </div>
  );
};

export default CircularProgress;
