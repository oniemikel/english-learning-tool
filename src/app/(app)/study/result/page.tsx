"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/ui/page-title";
import { useStudyStore } from "@/stores/study-store";
import { StatCard } from "@/components/ui/stat-card";
import { saveStudySession } from "@/lib/data/history";
import { CheckCircle, Clock3, Target, XCircle } from "lucide-react";

function formatDuration(totalMinutes: number) {
  const safeMinutes = Math.max(0, totalMinutes);
  const hours = Math.floor(safeMinutes / 60);
  const minutes = safeMinutes % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
}

export default function StudyResultPage() {
  const { deckId, mode, solved, correct, ratingCounts, startTime, resetProgress } =
    useStudyStore();
  const hasSavedRef = useRef(false);

  const incorrect = Math.max(0, solved - correct);
  const accuracy = solved === 0 ? 0 : Math.round((correct / solved) * 100);
  const minutes = startTime === 0 ? 0 : Math.max(1, Math.round((Date.now() - startTime) / 1000 / 60));

  useEffect(() => {
    if (hasSavedRef.current || solved === 0 || startTime === 0) {
      return;
    }

    hasSavedRef.current = true;

    void saveStudySession({
      deckId,
      mode,
      totalReviewed: solved,
      correctCount: correct,
      incorrectCount: incorrect,
      accuracyRate: accuracy,
      fsrsBreakdown: ratingCounts,
      minutes,
    })
      .then(() => {
        console.log("Study log saved successfully.");
      })
      .catch((error) => {
        console.error("Failed to save study log:", error);
      });
  }, [deckId, mode, solved, correct, incorrect, accuracy, ratingCounts, minutes, startTime]);

  const stats = [
    {
      title: "Total Words Reviewed",
      value: solved,
      icon: <CheckCircle className="h-5 w-5 text-muted-foreground" />,
    },
    {
      title: "Correct Answers",
      value: correct,
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    },
    {
      title: "Incorrect Answers",
      value: solved - correct,
      icon: <XCircle className="h-5 w-5 text-red-500" />,
    },
    {
      title: "Accuracy Rate",
      value: `${accuracy}%`,
      icon: <Target className="h-5 w-5 text-muted-foreground" />,
    },
    {
      title: "Study Duration",
      value: formatDuration(minutes),
      icon: <Clock3 className="h-5 w-5 text-muted-foreground" />,
    },
  ];

  const fsrsResponseStats = [
    { label: "Again", value: ratingCounts.again },
    { label: "Hard", value: ratingCounts.hard },
    { label: "Good", value: ratingCounts.good },
    { label: "Easy", value: ratingCounts.easy },
  ];

  return (
    <section>
      <PageTitle
        title="Study Session Results"
        description="Here's how you did in this session."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
          />
        ))}
      </div>
      <div className="mt-4 rounded-lg border bg-card p-4">
        <h2 className="text-sm font-medium text-muted-foreground">FSRS Response Breakdown</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {fsrsResponseStats.map((item) => (
            <div key={item.label} className="rounded-md border bg-background p-3">
              <div className="text-sm text-muted-foreground">{item.label}</div>
              <div className="mt-1 text-2xl font-semibold">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 flex flex-wrap justify-end gap-2">
        <Link href={deckId ? `/decks/${deckId}` : "/decks"}>
          <Button variant="outline" onClick={resetProgress}>
            Back to Deck
          </Button>
        </Link>
        <Link href="/study">
          <Button variant="outline" onClick={resetProgress}>
            Study Again
          </Button>
        </Link>
        <Link href="/history">
          <Button variant="secondary" onClick={resetProgress}>
            View History
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button onClick={resetProgress}>Back to Dashboard</Button>
        </Link>
      </div>
    </section>
  );
}
