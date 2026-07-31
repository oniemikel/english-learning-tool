"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Rectangle,
} from "recharts";

interface WeeklyActivityProps {
  labels: string[];
  series: number[][];
  className?: string;
}

const WeeklyActivity = ({ labels, series, className }: WeeklyActivityProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      setIsMounted(true);
    });
    return () => cancelAnimationFrame(timer);
  }, []);

  const data = labels.map((label, i) => ({
    name: label,
    reviews: isMounted ? (series[0]?.[i] ?? 0) : 0,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      onViewportEnter={() => setIsInView(true)}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={className}
    >
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
                  // 背景のグレーハイライトを非表示にする
                  cursor={false}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    color: "hsl(var(--foreground))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Bar
                  dataKey="reviews"
                  fill="#5b5bd6"
                  radius={[4, 4, 0, 0]}
                  // --- ホバー時の強調設定（activeBar） ---
                  activeBar={
                    <Rectangle
                      fill="#3b3bd0" // ホバー時に濃い/鮮やかなパープルに強調
                      opacity={1}
                    />
                  }
                  opacity={0.85}
                  // 画面内に入ってからアニメーションを開始させる
                  isAnimationActive={isInView}
                  animationBegin={0}
                  animationDuration={800}
                  animationEasing="ease-out"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WeeklyActivity;
