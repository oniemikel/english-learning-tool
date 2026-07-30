// src/components/dashboard/stats-grid.tsx
import MetricCard from "./metric-card";

interface StatsGridProps {
  stats: {
    totalDecks: number;
    totalWords: number;
    wordsToReview: number;
    newWords: number;
  };
}

const StatsGrid = ({ stats }: StatsGridProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total Decks"
        value={stats.totalDecks.toString()}
        icon="Decks"
        color="#7c3aed"
      />
      <MetricCard
        title="Total Words"
        value={stats.totalWords.toString()}
        icon="Words"
        color="#059669"
      />
      <MetricCard
        title="Words to Review"
        value={stats.wordsToReview.toString()}
        icon="Review"
        color="#d97706"
      />
      <MetricCard
        title="New Words"
        value={stats.newWords.toString()}
        icon="New"
        color="#be185d"
      />
    </div>
  );
};

export default StatsGrid;
