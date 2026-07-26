// src/components/dashboard/stats-grid.tsx
import MetricCard from './metric-card';
import { DASHBOARD_DATA } from '@/lib/mock-data';

const StatsGrid = () => {
  const { stats } = DASHBOARD_DATA;
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Words Learned"
        value={stats.wordsLearned.value}
        change={stats.wordsLearned.change}
        icon="WordsLearned"
        color="#7c3aed"
      />
      <MetricCard
        title="Accuracy"
        value={stats.accuracy.value}
        change={stats.accuracy.change}
        icon="Accuracy"
        color="#059669"
      />
      <MetricCard
        title="Study Time"
        value={stats.studyTime.value}
        change={stats.studyTime.change}
        icon="StudyTime"
        color="#d97706"
      />
      <MetricCard
        title="Streak"
        value={stats.streak.value}
        change={stats.streak.change}
        icon="Streak"
        color="#be185d"
      />
    </div>
  );
};

export default StatsGrid;
