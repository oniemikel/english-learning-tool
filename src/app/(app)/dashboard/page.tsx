// src/app/(app)/dashboard/page.tsx
import WelcomeBanner from '@/components/dashboard/welcome-banner';
import StatsGrid from '@/components/dashboard/stats-grid';
import TodayProgressCard from '@/components/dashboard/today-progress-card';
import StudyGoals from '@/components/dashboard/study-goals';
import RecentDecks from '@/components/dashboard/recent-decks';
import WeeklyActivity from '@/components/dashboard/weekly-activity';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <WelcomeBanner />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TodayProgressCard />
        </div>
        <StudyGoals />
      </div>
      <StatsGrid />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <RecentDecks />
        <WeeklyActivity />
      </div>
    </div>
  );
}
