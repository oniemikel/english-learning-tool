"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StudyHeatmapProps = {
  data: { date: string; count: number }[];
  className?: string;
  /**
   * 1日の学習上限・目標数（デフォルト: 15）
   */
  maxCount?: number;
  /**
   * 単一の基準カラー (デフォルト: GitHub風のグリーン #2ea44f)
   * RGB形式（例: "46, 164, 79"）で指定
   */
  brandColorRgb?: string;
};

type GridCell = {
  key: string;
  date: Date;
  inRange: boolean;
  count: number;
};

function parseDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function toDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function addDays(base: Date, days: number) {
  const next = new Date(base);
  next.setDate(base.getDate() + days);
  return next;
}

const ALPHA_LEVELS = [0, 0.2, 0.45, 0.7, 1.0];

function getLevelIndexByMax(count: number, maxCount: number): number {
  if (count <= 0) return 0;

  const ratio = count / maxCount;

  if (ratio < 0.25) return 1;
  if (ratio < 0.5) return 2;
  if (ratio < 0.75) return 3;
  return 4;
}

function getMonthLabels(weeks: GridCell[][]) {
  const labels: { label: string; weekIndex: number }[] = [];
  let lastMonth = -1;

  for (let weekIndex = 0; weekIndex < weeks.length; weekIndex += 1) {
    const firstInRangeDay = weeks[weekIndex].find((cell) => cell.inRange);
    if (!firstInRangeDay) {
      continue;
    }

    const month = firstInRangeDay.date.getMonth();
    if (month !== lastMonth) {
      labels.push({
        weekIndex,
        label: firstInRangeDay.date.toLocaleDateString("en-US", {
          month: "short",
        }),
      });
      lastMonth = month;
    }
  }

  return labels;
}

function getCurrentStreak(keysWithActivity: Set<string>) {
  let streak = 0;
  let cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  while (keysWithActivity.has(toDateKey(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
}

export default function StudyHeatmap({
  data,
  className,
  maxCount = 15,
  brandColorRgb = "46, 164, 79",
}: StudyHeatmapProps) {
  const { weeks, monthLabels, totalActiveDays, currentStreak, totalReviews } =
    useMemo(() => {
      const countByDate = new Map<string, number>();
      for (const item of data) {
        countByDate.set(item.date, item.count);
      }

      const orderedDates = [...data].sort((a, b) =>
        a.date.localeCompare(b.date),
      );
      const firstDate =
        orderedDates.length > 0
          ? parseDateKey(orderedDates[0].date)
          : addDays(new Date(), -364);
      const lastDate =
        orderedDates.length > 0
          ? parseDateKey(orderedDates[orderedDates.length - 1].date)
          : new Date();

      firstDate.setHours(0, 0, 0, 0);
      lastDate.setHours(0, 0, 0, 0);

      const gridStart = addDays(firstDate, -firstDate.getDay());
      const gridEnd = addDays(lastDate, 6 - lastDate.getDay());

      const flatCells: GridCell[] = [];
      for (
        let current = new Date(gridStart);
        current <= gridEnd;
        current = addDays(current, 1)
      ) {
        const key = toDateKey(current);
        flatCells.push({
          key,
          date: new Date(current),
          count: countByDate.get(key) ?? 0,
          inRange: current >= firstDate && current <= lastDate,
        });
      }

      const weekChunks: GridCell[][] = [];
      for (let index = 0; index < flatCells.length; index += 7) {
        weekChunks.push(flatCells.slice(index, index + 7));
      }

      const activeDays = data.filter((entry) => entry.count > 0).length;
      const keysWithActivity = new Set(
        data.filter((entry) => entry.count > 0).map((entry) => entry.date),
      );

      return {
        weeks: weekChunks,
        monthLabels: getMonthLabels(weekChunks),
        totalActiveDays: activeDays,
        currentStreak: getCurrentStreak(keysWithActivity),
        totalReviews: data.reduce((sum, entry) => sum + entry.count, 0),
      };
    }, [data]);

  const getCellStyle = (count: number) => {
    const levelIndex = getLevelIndexByMax(count, maxCount);
    if (levelIndex === 0) return {};
    const alpha = ALPHA_LEVELS[levelIndex];
    return {
      backgroundColor: `rgba(${brandColorRgb}, ${alpha})`,
    };
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Study Heatmap</CardTitle>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>
              <strong className="font-semibold text-foreground">
                {totalActiveDays}
              </strong>{" "}
              active days
            </span>
            <span className="hidden sm:inline">•</span>
            <span>
              <strong className="font-semibold text-foreground">
                {currentStreak}
              </strong>{" "}
              day streak
            </span>
            <span className="hidden sm:inline">•</span>
            <span>
              <strong className="font-semibold text-foreground">
                {totalReviews}
              </strong>{" "}
              reviews total
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {/* 横スクロール領域 */}
          <div className="overflow-x-auto pb-2">
            <div className="w-max min-w-full">
              {/* 月ラベル */}
              <div className="relative mb-2 h-5">
                {monthLabels.map((month) => (
                  <span
                    key={`${month.label}-${month.weekIndex}`}
                    className="absolute text-xs font-medium text-muted-foreground"
                    style={{ left: `${month.weekIndex * 0.875}rem` }}
                  >
                    {month.label}
                  </span>
                ))}
              </div>

              {/* グリッド全体：framer-motion で順番にふわっと表示 */}
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-50px" }}
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.015, // 週ごとに少しずつ遅れてアニメーション
                    },
                  },
                }}
                className="flex gap-0.5"
              >
                {weeks.map((week, weekIndex) => (
                  <motion.div
                    key={`week-${weekIndex}`}
                    variants={{
                      hidden: { opacity: 0, scale: 0.8 },
                      show: { opacity: 1, scale: 1 },
                    }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-rows-7 gap-0.5"
                  >
                    {week.map((cell) => {
                      const levelIndex = getLevelIndexByMax(
                        cell.count,
                        maxCount,
                      );

                      return (
                        <div
                          key={cell.key}
                          style={
                            cell.inRange && levelIndex > 0
                              ? getCellStyle(cell.count)
                              : {}
                          }
                          className={cn(
                            "h-3 w-3 rounded-sm transition-transform duration-150",
                            "hover:scale-125 hover:z-20 hover:shadow-sm",
                            cell.inRange
                              ? levelIndex === 0
                                ? "bg-muted/60 dark:bg-muted/40"
                                : ""
                              : "bg-transparent",
                          )}
                          title={
                            cell.inRange
                              ? `${cell.key}: ${cell.count} / ${maxCount} reviews (${Math.round((cell.count / maxCount) * 100)}%)`
                              : undefined
                          }
                        />
                      );
                    })}
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* 凡例領域 */}
          <div className="mt-4 flex items-center justify-end gap-1 text-xs text-muted-foreground">
            <span className="mr-1">0</span>
            <div className="h-3 w-3 rounded-sm bg-muted/60 dark:bg-muted/40" />
            {ALPHA_LEVELS.slice(1).map((alpha, idx) => (
              <div
                key={idx}
                className="h-3 w-3 rounded-sm"
                style={{
                  backgroundColor: `rgba(${brandColorRgb}, ${alpha})`,
                }}
              />
            ))}
            <span className="ml-1">{maxCount}+</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
