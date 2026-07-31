"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import CircularProgress from "./circular-progress";

interface TodayProgressCardProps {
  newWords: number;
  reviews: number;
  target: number;
  className?: string;
}

const MiniStat = ({
  value,
  label,
}: {
  value: string | number;
  label: string;
}) => (
  <div className="flex flex-col items-center justify-center space-y-1 rounded-lg bg-muted/50 p-3">
    <p className="text-lg font-bold">{value}</p>
    <p className="text-xs text-muted-foreground">{label}</p>
  </div>
);

const TodayProgressCard = ({
  newWords,
  reviews,
  target,
  className,
}: TodayProgressCardProps) => {
  const [isInView, setIsInView] = useState(false);
  const rawProgress = target > 0 ? (reviews / target) * 100 : 0;
  // 画面内に入るまでは 0% にしておき、スクロールインした瞬間にプログレスメーターをアニメーション伸長させる
  const progress = isInView ? rawProgress : 0;
  const today = new Date();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      onViewportEnter={() => setIsInView(true)}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={className}
    >
      <Card className="flex flex-col justify-between">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">
                Today's Progress
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Daily learning activity
              </p>
            </div>
            <p className="font-mono text-sm text-muted-foreground">
              {today.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col justify-around space-y-6">
          <div className="flex w-full flex-col items-center gap-6">
            {/* 円チャート（画面イン時に 0 からターゲット値まで描画） */}
            <CircularProgress
              value={Math.round(progress)}
              color="#5b5bd6"
              size={200}
            />

            {/* テキスト・プログレスバー・ミニステータス群 */}
            <div className="w-full space-y-4">
              <div>
                <div className="mb-1 flex justify-center gap-4 text-sm">
                  <p className="text-muted-foreground">Reviews</p>
                  <p className="font-mono font-medium text-foreground">
                    {reviews} / {target}
                  </p>
                </div>
                <Progress value={progress} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <MiniStat value={reviews} label="Reviewed" />
                <MiniStat value={newWords} label="New" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TodayProgressCard;
