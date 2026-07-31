"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface WeeklyProgressProps {
  goals: {
    day: string;
    progress: number;
  }[];
  className?: string;
}

const WeeklyProgress = ({ goals, className }: WeeklyProgressProps) => {
  const [isInView, setIsInView] = useState(false);
  const maxProgress = Math.max(...goals.map((g) => g.progress), 1);

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
          <CardTitle className="text-lg font-semibold">
            Weekly Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {goals.map((goal, index) => {
            const rawProgress = (goal.progress / maxProgress) * 100;
            // 画面内に入るまでは 0% にしておき、スクロールインした瞬間に伸長させる
            const progressValue = isInView ? rawProgress : 0;

            return (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <p>{goal.day}</p>
                  <p className="font-medium text-foreground">{goal.progress}</p>
                </div>
                <Progress value={progressValue} />
              </div>
            );
          })}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WeeklyProgress;
